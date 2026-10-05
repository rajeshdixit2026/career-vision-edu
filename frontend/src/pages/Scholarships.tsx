import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Award, CalendarDays, CheckCircle2 } from "lucide-react";
import { IMAGES } from "@/lib/site";
import PageHeader from "@/components/layout/PageHeader";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

const SCHOLARSHIPS = [
  {
    name: "Bihar Student Credit Card (MNSSBY)",
    provider: "Govt. of Bihar",
    benefit: "₹4 lakh education loan at 0% / 4% interest",
    status: "Open all year",
    open: true,
    note: "For Bihar-domicile students in higher or technical education — our team files the complete application for you.",
  },
  {
    name: "National Scholarship Portal (NSP)",
    provider: "Ministry of Education",
    benefit: "₹10,000 – ₹1 lakh+ per year",
    status: "Annual window",
    open: false,
    note: "Pre-matric, post-matric and merit-cum-means scholarships for SC/ST/OBC/minority and general students.",
  },
  {
    name: "State Post-Matric Scholarships",
    provider: "State Welfare Departments",
    benefit: "Full or partial fee reimbursement",
    status: "Annual window",
    open: false,
    note: "State-specific post-matric schemes for reserved categories — we check which state's scheme you qualify for.",
  },
  {
    name: "University Merit Scholarships",
    provider: "Partner universities",
    benefit: "10 – 50% tuition waiver",
    status: "At admission",
    open: true,
    note: "Merit-based tuition waivers at our partner colleges — often combined with early admission offers.",
  },
  {
    name: "PM YASASVI Entrance Scholarship",
    provider: "Ministry of Social Justice",
    benefit: "Tuition + hostel support",
    status: "Annual exam",
    open: false,
    note: "For OBC, EBC and DNT students in classes 9–12 — entrance-based selection for top schools.",
  },
  {
    name: "AICTE / UGC Pragati & Saksham",
    provider: "AICTE",
    benefit: "₹50,000 per year",
    status: "Annual window",
    open: false,
    note: "For girl students (Pragati) and differently-abled students (Saksham) in AICTE-approved technical courses.",
  },
];

export default function Scholarships() {
  return (
    <>
      <PageHeader
        badge="Scholarships & Schemes"
        title="Every rupee of support you qualify for — claimed"
        description="Government scholarships, state schemes and university merit waivers. We identify what you qualify for and file the applications with you."
        image={IMAGES.documents}
      />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} transition={{ duration: 0.4 }}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#92400E]">Current schemes</p>
          <h2 className="mt-2 max-w-2xl font-heading text-3xl font-bold md:text-4xl">
            Scholarships we help you apply for
          </h2>
        </motion.div>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SCHOLARSHIPS.map((scholarship, i) => (
            <motion.div key={scholarship.name} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.05 }}>
              <div
                data-testid={`scholarship-card-${i}`}
                className="card-lift flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(4,25,78,0.08)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <Award className="size-6 text-gold" />
                  <span
                    className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      scholarship.open ? "bg-[#DCFCE7] text-[#166534]" : "bg-gold-soft text-[#78350F]"
                    }`}
                  >
                    <CalendarDays className="size-3" /> {scholarship.status}
                  </span>
                </div>
                <h3 className="mt-4 font-heading text-base font-bold leading-snug">{scholarship.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {scholarship.provider}
                </p>
                <p className="mt-3 text-sm font-bold text-primary">{scholarship.benefit}</p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{scholarship.note}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-1 items-center gap-10 rounded-2xl border-l-4 border-gold bg-navy p-8 text-white md:grid-cols-2 md:p-10">
          <div>
            <h2 className="font-heading text-2xl font-bold md:text-3xl">
              Not sure what you qualify for?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-base">
              Scholarship eligibility depends on your category, income, state and course. Our
              counselors run a free check on your profile and file the paperwork with you — so
              deadlines never get missed.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {["Free eligibility check", "Document preparation", "Portal filing & follow-up"].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 shrink-0 text-gold" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-start gap-4 md:items-end">
            <Link
              to="/apply"
              data-testid="scholarships-cta-apply-btn"
              className="press inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-bold text-navy transition-colors hover:bg-[#ffdd5c]"
            >
              Get a free eligibility check <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/contact"
              data-testid="scholarships-cta-contact-link"
              className="text-sm font-semibold text-white/70 underline-offset-4 transition-colors hover:text-gold hover:underline"
            >
              or talk to a counselor first
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
