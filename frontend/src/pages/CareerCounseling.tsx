import { motion } from "motion/react";
import { CalendarCheck, CheckCircle2 } from "lucide-react";
import { IMAGES } from "@/lib/site";
import PageHeader from "@/components/layout/PageHeader";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

const STAGES = [
  {
    step: "01",
    title: "Discover",
    copy: "A free 1-on-1 session to understand your marks, interests, budget and career goals.",
  },
  {
    step: "02",
    title: "Shortlist",
    copy: "We match you to courses and verified colleges with transparent fee and placement data.",
  },
  {
    step: "03",
    title: "Decide",
    copy: "Side-by-side comparison of your options — you choose, we confirm eligibility and seats.",
  },
  {
    step: "04",
    title: "Apply",
    copy: "We handle applications, documents, deadlines and follow-ups with the college.",
  },
  {
    step: "05",
    title: "Arrive",
    copy: "Admission confirmed — plus hostel, scholarship and loan support so you actually get there.",
  },
];

export default function CareerCounseling() {
  return (
    <>
      <PageHeader
        badge="Career Counseling"
        title="Free 1-on-1 counseling that puts you on the right path"
        description="A structured five-stage session with a senior counselor — discover your options, shortlist colleges and leave with a clear admission plan."
        image={IMAGES.counseling}
      />

      {/* 5-stage framework */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} transition={{ duration: 0.4 }}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#92400E]">How it works</p>
          <h2 className="mt-2 max-w-2xl font-heading text-3xl font-bold md:text-4xl">
            Our 5-stage counseling framework
          </h2>
        </motion.div>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
          {STAGES.map((stage, i) => (
            <motion.div key={stage.step} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.07 }}>
              <div
                data-testid={`counseling-stage-${stage.step}`}
                className="card-lift h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(4,25,78,0.08)]"
              >
                <p className="font-heading text-3xl font-bold text-gold">{stage.step}</p>
                <h3 className="mt-3 font-heading text-base font-bold">{stage.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{stage.copy}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* What you get + booking form */}
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#92400E]">What you get</p>
            <h2 className="mt-2 font-heading text-3xl font-bold md:text-4xl">
              Leave the session with a plan, not a brochure
            </h2>
            <img
              src={IMAGES.counseling}
              alt="Counselor and student discussing admission options"
              className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover shadow-[0_20px_50px_-20px_rgba(4,25,78,0.35)]"
            />
            <ul className="mt-8 space-y-4">
              {[
                "Personalised course & career report based on your profile",
                "College shortlist with fee, approval and placement comparison",
                "Scholarship + Bihar Student Credit Card eligibility check",
                "Clear admission timeline — documents, deadlines, next steps",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-medium md:text-base">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#16A34A]" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6">
            <div
              data-testid="counseling-booking-card"
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(4,25,78,0.08)] md:p-8"
            >
              <h3 className="flex items-center gap-2 font-heading text-xl font-bold">
                <CalendarCheck className="size-5 text-gold" /> Book your free session
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Fill this in — a senior counselor calls you back within 24 hours.
              </p>
              <div className="mt-6">
                <LeadCaptureForm source="counselling" showMessage submitLabel="Book Free Counselling" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
