import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";
import { ApiError, apiGet, apiPost } from "@/lib/api";
import type { Course, Lead, LeadCreate } from "@/lib/types";
import { INDIAN_STATES } from "@/lib/site";
import { FALLBACK_COURSES } from "@/lib/fallbackData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LeadCaptureFormProps {
  source: "apply" | "counselling" | "contact";
  tone?: "light" | "dark";
  showCourseField?: boolean;
  showMessage?: boolean;
  submitLabel?: string;
  defaultMessage?: string;
  onDone?: () => void;
}

type FieldErrors = Partial<Record<"name" | "phone" | "email", string>>;

function cleanPhone(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.startsWith("91") && digits.length === 12) return digits.slice(2);
  if (digits.startsWith("0") && digits.length === 11) return digits.slice(1);
  return digits;
}

export default function LeadCaptureForm({
  source,
  tone = "light",
  showCourseField = true,
  showMessage = false,
  submitLabel = "Submit Request",
  defaultMessage,
  onDone,
}: LeadCaptureFormProps) {
  const dark = tone === "dark";
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [courseInterest, setCourseInterest] = useState("");
  const [state, setState] = useState("");
  const [message, setMessage] = useState(defaultMessage ?? "");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const coursesQuery = useQuery({
    queryKey: ["courses"],
    queryFn: () => apiGet<Course[]>("/courses"),
  });
  const courseOptions = coursesQuery.isError
    ? FALLBACK_COURSES
    : (coursesQuery.data ?? []);

  const mutation = useMutation({
    mutationFn: (payload: LeadCreate) =>
      source === "contact"
        ? apiPost<Lead>("/enquiries", payload)
        : apiPost<Lead>("/leads", payload),
    onSuccess: (lead) => {
      toast.success("Request received!", {
        description: "Our counselor will call you within 24 hours.",
      });
      setSubmittedId(lead.id);
      setName("");
      setPhone("");
      setEmail("");
      setCourseInterest("");
      setState("");
      setMessage("");
      setErrors({});
      onDone?.();
    },
    onError: (err) => {
      const detail =
        err instanceof ApiError && err.body && typeof err.body === "object" && "detail" in err.body
          ? String((err.body as { detail: unknown }).detail)
          : "Please check your details and try again.";
      toast.error("Could not submit your request", { description: detail });
    },
  });

  function validate(): boolean {
    const next: FieldErrors = {};
    if (name.trim().length < 2) next.name = "Please enter your full name";
    const phoneDigits = cleanPhone(phone);
    if (!/^[6-9]\d{9}$/.test(phoneDigits)) next.phone = "Enter a valid 10-digit Indian mobile number";
    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim())) next.email = "Enter a valid email address";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate() || mutation.isPending) return;
    mutation.mutate({
      name: name.trim(),
      phone: cleanPhone(phone),
      email: email.trim() || null,
      course_interest: courseInterest || null,
      state: state || null,
      message: message.trim() || null,
      source,
    });
  }

  if (submittedId) {
    return (
      <div
        data-testid="lead-success-card"
        className={`flex h-full min-h-64 flex-col items-center justify-center rounded-xl p-8 text-center ${
          dark ? "bg-white/10 text-white" : "bg-secondary text-primary"
        }`}
      >
        <CheckCircle2 className="size-12 text-gold" />
        <h3 className="mt-4 font-heading text-xl font-bold">Thank you!</h3>
        <p className="mt-2 max-w-sm text-sm opacity-80">
          Your request has been received. Our senior counselor will call you within 24 hours on your
          registered number.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-6"
          data-testid="lead-submit-another-btn"
          onClick={() => setSubmittedId(null)}
        >
          Submit another request
        </Button>
      </div>
    );
  }

  const labelCls = `text-xs font-semibold ${dark ? "text-white/75" : "text-foreground/80"}`;
  const inputCls = dark
    ? "border-white/20 bg-white/10 text-white placeholder:text-white/45"
    : "";
  const errorCls = "mt-1 text-xs font-medium text-destructive";

  return (
    <form onSubmit={handleSubmit} noValidate data-testid={`lead-form-${source}`} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={`lead-name-${source}`} className={labelCls}>
            Full Name *
          </Label>
          <Input
            id={`lead-name-${source}`}
            data-testid="lead-name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rahul Kumar"
            autoComplete="name"
            className={inputCls}
          />
          {errors.name && <p className={errorCls}>{errors.name}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`lead-phone-${source}`} className={labelCls}>
            Mobile Number *
          </Label>
          <Input
            id={`lead-phone-${source}`}
            data-testid="lead-phone-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            type="tel"
            autoComplete="tel"
            className={inputCls}
          />
          {errors.phone && <p className={errorCls}>{errors.phone}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={`lead-email-${source}`} className={labelCls}>
            Email (optional)
          </Label>
          <Input
            id={`lead-email-${source}`}
            data-testid="lead-email-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            type="email"
            autoComplete="email"
            className={inputCls}
          />
          {errors.email && <p className={errorCls}>{errors.email}</p>}
        </div>
        {showCourseField && (
          <div className="space-y-1.5">
            <Label htmlFor={`lead-course-${source}`} className={labelCls}>
              Course Interest
            </Label>
            <Select value={courseInterest} onValueChange={(value: string) => setCourseInterest(value)}>
              <SelectTrigger id={`lead-course-${source}`} data-testid="lead-course-select" className={`w-full ${inputCls}`}>
                <SelectValue>{(v: string) => (v ? v : "Select a course")}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {courseOptions.map((course) => (
                  <SelectItem key={course.id} data-testid={`lead-course-option-${course.id}`} value={course.name}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`lead-state-${source}`} className={labelCls}>
          State
        </Label>
        <Select value={state} onValueChange={(value: string) => setState(value)}>
          <SelectTrigger id={`lead-state-${source}`} data-testid="lead-state-select" className={`w-full ${inputCls}`}>
            <SelectValue>{(v: string) => (v ? v : "Select your state")}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {INDIAN_STATES.map((option) => (
              <SelectItem key={option} data-testid={`lead-state-option-${option.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showMessage && (
        <div className="space-y-1.5">
          <Label htmlFor={`lead-message-${source}`} className={labelCls}>
            Message
          </Label>
          <Textarea
            id={`lead-message-${source}`}
            data-testid="lead-message-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what you're looking for — course, college, budget…"
            rows={3}
            className={inputCls}
          />
        </div>
      )}

      <Button
        type="submit"
        data-testid="lead-form-submit-button"
        disabled={mutation.isPending}
        className="press w-full rounded-full bg-gold font-bold text-navy hover:bg-[#ffdd5c]"
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Submitting…
          </>
        ) : (
          submitLabel
        )}
      </Button>
      <p className={`text-center text-xs ${dark ? "text-white/50" : "text-muted-foreground"}`}>
        100% free counselling · Your details stay private
      </p>
    </form>
  );
}
