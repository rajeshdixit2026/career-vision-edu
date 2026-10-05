import { useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { IMAGES } from "@/lib/site";
import PageHeader from "@/components/layout/PageHeader";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

export default function ApplyNow() {
  const [searchParams] = useSearchParams();
  const college = searchParams.get("college") ?? "";
  const prefill = college ? `I'm interested in admission at ${college}.` : undefined;

  return (
    <>
      <PageHeader
        badge="Apply Now"
        title="Apply for admission — with a counselor by your side"
        description="Submit your details and our admission team calls you within 24 hours with a shortlist, fee comparison and funding plan. Applying through Career Vision is 100% free."
        image={IMAGES.campusModern}
      />

      <section className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8">
        {/* Why apply */}
        <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="lg:col-span-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#92400E]">Why apply with us</p>
          <h2 className="mt-2 font-heading text-3xl font-bold md:text-4xl">
            Your admission, handled properly
          </h2>
          <ul className="mt-8 space-y-4">
            {[
              "Free profile evaluation and course-matching session",
              "Shortlist from 250+ verified partner colleges across India",
              "Complete application, documentation and deadline handling",
              "Bihar Student Credit Card, scholarship and loan support built in",
              "Post-admission support — hostel, enrolment, orientation",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm font-medium md:text-base">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#16A34A]" /> {item}
              </li>
            ))}
          </ul>
          <img
            src={IMAGES.documents}
            alt="Student and advisor completing admission paperwork"
            className="mt-10 aspect-[4/3] w-full rounded-2xl border-4 border-gold object-cover shadow-[0_20px_50px_-20px_rgba(4,25,78,0.35)]"
          />
        </motion.div>

        {/* Application form */}
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }} className="lg:col-span-7">
          <div
            data-testid="apply-form-card"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(4,25,78,0.08)] md:p-8"
          >
            <h2 className="font-heading text-xl font-bold">
              Application form{college ? ` — ${college}` : ""}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {college
                ? "You're applying via Career Vision. Confirm your details below."
                : "Fields marked * are required — the rest helps your counselor prepare better."}
            </p>
            <div className="mt-6">
              <LeadCaptureForm
                source="apply"
                showMessage
                submitLabel="Submit Application"
                defaultMessage={prefill}
              />
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
