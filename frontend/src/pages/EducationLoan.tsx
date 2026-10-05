import { motion } from "motion/react";
import { BadgePercent, Banknote, FileText, Landmark, ShieldCheck } from "lucide-react";
import { IMAGES } from "@/lib/site";
import PageHeader from "@/components/layout/PageHeader";
import FundingCalculator from "@/components/tools/FundingCalculator";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

const OPTIONS = [
  {
    icon: BadgePercent,
    title: "Bihar Student Credit Card (MNSSBY)",
    rate: "4% p.a. (0% for girls/transgender/PwD)",
    copy: "State-backed loan up to ₹4 lakh with no collateral and no guarantor — our flagship funding route for Bihar-domicile students.",
    highlight: true,
  },
  {
    icon: Banknote,
    title: "Zero-Collateral Bank Loan",
    rate: "9 – 11% p.a.",
    copy: "Under the national education-loan scheme, banks finance up to ₹7.5 lakh without collateral for approved courses.",
    highlight: false,
  },
  {
    icon: Landmark,
    title: "Secured Education Loan",
    rate: "8.5 – 10.5% p.a.",
    copy: "Above ₹7.5 lakh, collateral-backed loans cover tuition, hostel and living costs with longer tenures up to 10 years.",
    highlight: false,
  },
];

const PARTNER_BANKS = ["State Bank of India", "Bank of Baroda", "Punjab National Bank", "Union Bank of India", "Canara Bank", "IDFC FIRST Bank"];

export default function EducationLoan() {
  return (
    <>
      <PageHeader
        badge="Education Loan Assistance"
        title="Finance your degree without the stress"
        description="From Bihar Student Credit Card to zero-collateral bank loans — we compare options, prepare your file and stay with you until disbursement."
        image={IMAGES.documents}
      />

      {/* Loan comparison */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} transition={{ duration: 0.4 }}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#92400E]">Your options</p>
          <h2 className="mt-2 max-w-2xl font-heading text-3xl font-bold md:text-4xl">
            Three ways to fund your education
          </h2>
        </motion.div>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {OPTIONS.map((option, i) => (
            <motion.div key={option.title} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.07 }}>
              <div
                data-testid={`loan-option-card-${i}`}
                className={`card-lift h-full rounded-2xl border p-6 ${
                  option.highlight
                    ? "border-l-4 border-l-gold border-slate-200 bg-navy text-white"
                    : "border-slate-200 bg-white shadow-[0_4px_20px_-4px_rgba(4,25,78,0.08)]"
                }`}
              >
                <option.icon className={`size-6 ${option.highlight ? "text-gold" : "text-primary"}`} />
                <h3 className="mt-3 font-heading text-lg font-bold">{option.title}</h3>
                <p className={`mt-1 text-sm font-bold ${option.highlight ? "text-gold" : "text-primary"}`}>
                  {option.rate}
                </p>
                <p className={`mt-2 text-sm leading-relaxed ${option.highlight ? "text-white/70" : "text-muted-foreground"}`}>
                  {option.copy}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-2xl font-bold md:text-3xl">Try the EMI estimator</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              Move the slider to your loan amount and course duration — see the monthly EMI at a
              typical commercial rate, and what you'd save through the schemes we help you access.
            </p>
            <div className="mt-8">
              <FundingCalculator ratePercent={10.5} />
            </div>
          </div>
          <div className="space-y-10">
            <div>
              <h2 className="font-heading text-2xl font-bold md:text-3xl">Banks we work with</h2>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {PARTNER_BANKS.map((bank) => (
                  <span
                    key={bank}
                    className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-foreground/75"
                    data-testid={`loan-bank-chip-${bank.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  >
                    {bank}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold md:text-3xl">Loan file checklist</h2>
              <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {["Admission letter", "Fee structure from college", "10th & 12th marksheets", "Graduation marksheets", "Income proof", "Address & ID proof", "Bank statements (6 months)", "Co-applicant KYC"].map((doc) => (
                  <li key={doc} className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm font-medium">
                    <FileText className="size-4 shrink-0 text-gold" /> {doc}
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#16A34A]" />
                We prepare the complete file before you walk into the branch — no rejections on paperwork.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
