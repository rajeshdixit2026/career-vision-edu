import { motion } from "motion/react";
import { CheckCircle2, FileText, IndianRupee, Percent } from "lucide-react";
import { IMAGES } from "@/lib/site";
import PageHeader from "@/components/layout/PageHeader";
import FundingCalculator from "@/components/tools/FundingCalculator";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

const BENEFITS = [
  {
    icon: IndianRupee,
    value: "₹4 Lakh",
    label: "Maximum education loan under the Dr. Ambedkar Nishchay Swayam Sahayata Yojana (MNSSBY)",
  },
  {
    icon: Percent,
    value: "0% Interest",
    label: "For girls, transgender and differently-abled students — 4% simple interest for others",
  },
  {
    icon: FileText,
    value: "No Guarantor",
    label: "Unsecured loan against your Student Credit Card — no collateral, no guarantor needed",
  },
];

export default function BiharStudentCreditCard() {
  return (
    <>
      <PageHeader
        badge="MNSSBY · Govt. of Bihar"
        title="Bihar Student Credit Card — up to ₹4 lakh for your education"
        description="We handle the complete MNSSBY application for you: eligibility check, documents, portal process and disbursement follow-up — free with your admission guidance."
        image={IMAGES.documents}
      />

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {BENEFITS.map((benefit, i) => (
            <motion.div key={benefit.value} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.07 }}>
              <div
                data-testid={`bcc-benefit-card-${i}`}
                className="card-lift h-full rounded-2xl border-l-4 border-gold bg-navy p-6 text-white"
              >
                <benefit.icon className="size-6 text-gold" />
                <p className="mt-3 font-heading text-3xl font-bold text-gold">{benefit.value}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{benefit.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
          {/* Eligibility + documents */}
          <div className="space-y-10">
            <div>
              <h2 className="font-heading text-2xl font-bold md:text-3xl">Who is eligible?</h2>
              <ul className="mt-5 space-y-3">
                {[
                  "Bihar domicile (Caste + Residence certificates required)",
                  "Admission to a recognised higher education / approved technical course",
                  "Annual family income within MNSSBY limits",
                  "Not availing a similar government scholarship/loan for the same course",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm font-medium md:text-base">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#16A34A]" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold md:text-3xl">Documents you'll need</h2>
              <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {[
                  "Aadhaar card",
                  "Bihar residence certificate",
                  "Caste certificate",
                  "10th & 12th mark sheets",
                  "Income certificate",
                  "College admission letter",
                  "Bank account (student)",
                  "Passport-size photos",
                ].map((doc) => (
                  <li
                    key={doc}
                    className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm font-medium"
                  >
                    <FileText className="size-4 shrink-0 text-gold" /> {doc}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Calculator on navy card */}
          <div className="relative overflow-hidden rounded-2xl bg-navy p-6 text-white md:p-8">
            <div className="absolute inset-0 dot-grid" aria-hidden />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Plan your repayment</p>
              <h2 className="mt-2 font-heading text-2xl font-bold md:text-3xl">
                See what a Credit Card loan really costs
              </h2>
              <p className="mt-2 text-sm text-white/70">
                MNSSBY charges 0% interest to girls, transgender and PwD students, and 4% simple
                interest to others — a fraction of commercial loans.
              </p>
              <div className="mt-6">
                <FundingCalculator ratePercent={4} compareRatePercent={10.5} tone="dark" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
