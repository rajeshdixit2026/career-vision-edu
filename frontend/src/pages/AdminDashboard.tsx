import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Download,
  Inbox,
  LockKeyhole,
  LogOut,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react";
import { ApiError, apiGet, apiPost } from "@/lib/api";
import type { AdminLeadsResponse, AdminSession, Lead } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SOURCE_LABELS: Record<string, string> = {
  apply: "Application",
  counselling: "Counselling",
  contact: "Enquiry",
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toCsv(leads: Lead[]): string {
  const header = ["Date", "Name", "Mobile", "Email", "Course Interest", "State", "Type", "Message"];
  const rows = leads.map((lead) =>
    [
      formatDate(lead.created_at),
      lead.name,
      lead.phone,
      lead.email ?? "",
      lead.course_interest ?? "",
      lead.state ?? "",
      SOURCE_LABELS[lead.source ?? ""] ?? lead.source ?? "",
      (lead.message ?? "").replace(/\s+/g, " "),
    ]
      .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
      .join(","),
  );
  return [header.join(","), ...rows].join("\n");
}

/** Login gate — shown until the PIN cookie session is established. */
function PinGate({ onSuccess }: { onSuccess: () => void }) {
  const [pin, setPin] = useState("");

  const loginMutation = useMutation({
    mutationFn: (value: string) => apiPost<AdminSession>("/admin/login", { pin: value }),
    onSuccess: () => {
      toast.success("Welcome back!");
      onSuccess();
    },
    onError: (err) => {
      const message =
        err instanceof ApiError && err.status === 401
          ? "That PIN is incorrect. Please try again."
          : "Could not sign you in. Please try again.";
      toast.error("Login failed", { description: message });
    },
  });

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-navy px-4 pt-20">
      <div className="absolute inset-0 dot-grid" aria-hidden />
      <div
        data-testid="admin-login-card"
        className="relative w-full max-w-sm rounded-2xl border border-white/15 bg-white/10 p-7 backdrop-blur-xl"
      >
        <span className="flex size-11 items-center justify-center rounded-xl bg-gold text-navy">
          <LockKeyhole className="size-5" />
        </span>
        <h1 className="mt-4 font-heading text-2xl font-bold text-white">Admin Login</h1>
        <p className="mt-1.5 text-sm text-white/65">
          Enter your passcode to view student enquiries.
        </p>
        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (pin.trim() && !loginMutation.isPending) loginMutation.mutate(pin.trim());
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="admin-pin" className="text-xs font-semibold text-white/75">
              Passcode
            </Label>
            <Input
              id="admin-pin"
              type="password"
              data-testid="admin-pin-input"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter passcode"
              autoComplete="current-password"
              className="border-white/20 bg-white/10 text-white placeholder:text-white/45"
            />
          </div>
          <Button
            type="submit"
            data-testid="admin-login-submit-btn"
            disabled={loginMutation.isPending}
            className="press w-full rounded-full bg-gold font-bold text-navy hover:bg-[#ffdd5c]"
          >
            {loginMutation.isPending ? "Signing in…" : "Sign In"}
          </Button>
        </form>
      </div>
    </section>
  );
}

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");

  const sessionQuery = useQuery({
    queryKey: ["admin-session"],
    queryFn: () => apiGet<AdminSession>("/admin/me"),
    retry: false,
  });
  const authenticated = sessionQuery.data?.authenticated === true;

  const leadsQuery = useQuery({
    queryKey: ["admin-leads"],
    queryFn: () => apiGet<AdminLeadsResponse>("/admin/leads"),
    enabled: authenticated,
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiPost<AdminSession>("/admin/logout"),
    onSuccess: () => {
      queryClient.clear();
      void sessionQuery.refetch();
      toast.success("Signed out");
    },
  });

  const leads = leadsQuery.data?.leads ?? [];
  const stats = leadsQuery.data?.stats;

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return leads.filter((lead) => {
      if (sourceFilter && lead.source !== sourceFilter) return false;
      if (!term) return true;
      return [lead.name, lead.phone, lead.email, lead.course_interest, lead.state]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(term));
    });
  }, [leads, search, sourceFilter]);

  function downloadCsv() {
    const blob = new Blob([toCsv(filtered)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `career-vision-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} enquiries`);
  }

  if (sessionQuery.isPending) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-navy pt-20">
        <RefreshCw className="size-6 animate-spin text-gold" />
      </section>
    );
  }

  if (!authenticated) {
    return <PinGate onSuccess={() => void sessionQuery.refetch()} />;
  }

  const statCards = [
    { label: "Total Enquiries", value: stats?.total ?? 0, testid: "admin-stat-total" },
    { label: "Last 7 Days", value: stats?.last_7_days ?? 0, testid: "admin-stat-recent" },
    { label: "Applications", value: stats?.apply ?? 0, testid: "admin-stat-apply" },
    { label: "Counselling", value: stats?.counselling ?? 0, testid: "admin-stat-counselling" },
    { label: "Contact Form", value: stats?.contact ?? 0, testid: "admin-stat-contact" },
  ];

  return (
    <>
      {/* Header band */}
      <section className="relative overflow-hidden bg-navy pb-12 pt-28 text-white md:pt-32">
        <div className="absolute inset-0 dot-grid" aria-hidden />
        <div className="relative mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3.5 py-1 text-xs font-bold text-navy">
              <ShieldCheck className="size-3" /> Private Area
            </p>
            <h1 className="mt-4 font-heading text-3xl font-bold md:text-4xl">Student Enquiries</h1>
            <p className="mt-2 text-sm text-white/70">
              Every counselling request, application and contact enquiry from your website.
            </p>
          </div>
          <div className="flex gap-2.5">
            <Button
              variant="outline"
              data-testid="admin-refresh-btn"
              onClick={() => void leadsQuery.refetch()}
              className="gap-2 rounded-full border-white/30 bg-transparent text-white hover:bg-white/10"
            >
              <RefreshCw className={`size-4 ${leadsQuery.isFetching ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Button
              variant="outline"
              data-testid="admin-logout-btn"
              onClick={() => logoutMutation.mutate()}
              className="gap-2 rounded-full border-white/30 bg-transparent text-white hover:bg-white/10"
            >
              <LogOut className="size-4" /> Sign Out
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {statCards.map((card) => (
            <div
              key={card.label}
              data-testid={card.testid}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(4,25,78,0.08)]"
            >
              <p className="font-heading text-3xl font-bold text-primary">{card.value}</p>
              <p className="mt-1 text-xs font-medium text-muted-foreground">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(4,25,78,0.08)] md:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="admin-search" className="text-xs font-semibold text-foreground/80">
              Search
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="admin-search"
                data-testid="admin-search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, mobile, course…"
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="admin-source" className="text-xs font-semibold text-foreground/80">
              Request type
            </Label>
            <Select value={sourceFilter} onValueChange={(value: string) => setSourceFilter(value)}>
              <SelectTrigger id="admin-source" data-testid="admin-source-select" className="w-full">
                <SelectValue>
                  {(v: string) => (v ? (SOURCE_LABELS[v] ?? v) : "All types")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SOURCE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value} data-testid={`admin-source-option-${value}`}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2.5">
            <Button
              variant="outline"
              className="rounded-full"
              data-testid="admin-clear-filters-btn"
              onClick={() => {
                setSearch("");
                setSourceFilter("");
              }}
            >
              Clear
            </Button>
            <Button
              data-testid="admin-export-csv-btn"
              onClick={downloadCsv}
              disabled={filtered.length === 0}
              className="press gap-2 rounded-full bg-navy font-semibold text-white hover:bg-navy-card"
            >
              <Download className="size-4" /> Export CSV
            </Button>
          </div>
        </div>

        {/* Table */}
        {leadsQuery.isPending ? (
          <div className="mt-8 h-64 animate-pulse rounded-2xl bg-muted" />
        ) : leadsQuery.isError ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="font-heading text-lg font-bold">Could not load enquiries</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Your session may have expired. Sign out and sign in again.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div
            data-testid="admin-empty-state"
            className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center"
          >
            <Inbox className="mx-auto size-10 text-muted-foreground" />
            <p className="mt-4 font-heading text-lg font-bold">
              {leads.length === 0 ? "No enquiries yet" : "No enquiries match your filters"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {leads.length === 0
                ? "New student requests from your website will appear here automatically."
                : "Try clearing the search or the request-type filter."}
            </p>
          </div>
        ) : (
          <div
            data-testid="admin-leads-table"
            className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_-4px_rgba(4,25,78,0.08)]"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Course Interest</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((lead) => (
                  <TableRow key={lead.id} data-testid={`admin-lead-row-${lead.id}`}>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {formatDate(lead.created_at)}
                    </TableCell>
                    <TableCell>
                      <span className="block font-semibold text-foreground">{lead.name}</span>
                      {lead.email && (
                        <span className="block text-xs text-muted-foreground">{lead.email}</span>
                      )}
                      {lead.message && (
                        <span className="mt-1 block max-w-xs text-xs italic text-muted-foreground">
                          “{lead.message}”
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-semibold">{lead.phone}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {lead.course_interest ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {lead.state ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="whitespace-nowrap bg-secondary font-semibold text-secondary-foreground"
                      >
                        {SOURCE_LABELS[lead.source ?? ""] ?? lead.source}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        <a
                          href={`tel:+91${lead.phone}`}
                          aria-label={`Call ${lead.name}`}
                          data-testid={`admin-call-btn-${lead.id}`}
                          className="flex size-8 items-center justify-center rounded-full bg-navy text-white transition-colors hover:bg-navy-card"
                        >
                          <Phone className="size-3.5" />
                        </a>
                        <a
                          href={`https://wa.me/91${lead.phone}`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`WhatsApp ${lead.name}`}
                          data-testid={`admin-whatsapp-btn-${lead.id}`}
                          className="flex size-8 items-center justify-center rounded-full bg-[#25D366] text-white transition-colors hover:bg-[#1DA851]"
                        >
                          <MessageCircle className="size-3.5" />
                        </a>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <p className="mt-4 text-xs text-muted-foreground">
          Showing {filtered.length} of {leads.length} enquiries
        </p>
      </section>
    </>
  );
}
