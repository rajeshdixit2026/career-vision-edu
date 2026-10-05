import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Building2, Compass, ShieldCheck, Target } from "lucide-react";
import { HOME_STATS, IMAGES } from "@/lib/site";
import PageHeader from "@/components/layout/PageHeader";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

const VALUES = [
  {
    icon: Compass,
    title: "Transparent Guidance",
    copy: "Real fees, real approvals, real placement data — no sugar-coating, no hidden commissions talk.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Colleges Only",
    copy: "Every partner college is UGC/AICTE-recognised and physically verified by our team before we recommend it.",
  },
  {
    icon: Target,
    title: "Student-First Counselling",
    copy: "We recommend what fits YOU — budget, marks, distance and career goals — not what pays us more.",
  },
  {
    icon: Building2,
    title: "End-to-End Support",
    copy: "From the first counselling call to hostel, scholarship and loan paperwork after admission.",
  },
];

export default function AboutUs() {
  return (
    <>
      <PageHeader
        badge="About Us"
        title="Guiding careers across India, honestly since 2013"
        description="Career Vision EduServices is a Bihar-based admission and career guidance consultancy helping students choose the right course, college and career path — with funding support that makes it possible."
        image={IMAGES.heroCampus}
      />

      {/* Story */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <motion.div {...fadeUp} transition={{ duration: 0.4 }}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#92400E]">Our story</p>
          <h2 className="mt-2 font-heading text-3xl font-bold md:text-4xl">
            From a Gopalganj office to thousands of student success stories
          </h2>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            <p>
              Career Vision EduServices began with one belief: every student deserves honest,
              expert guidance — not sales pitches. From our office on Banjari Road in Gopalganj
              (Bihar), we have spent 5+ years counseling students from Gopalganj, across Bihar,
              and neighbouring states.
            </p>
            <p>
              As an authorized enrollment partner for universities across the country, we guide
              students into traditional, online and distance-learning programmes — engineering,
              nursing, pharmacy, management, law, education and more. And because fees decide
              everything for most families, we built deep expertise in Bihar Student Credit Card
              (MNSSBY) funding, scholarships and education loans.
            </p>
            <p>
              The result: thousands of students in the right course, at the right college, with the
              paperwork done right.
            </p>
          </div>
        </motion.div>
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }}>
          <img
            src={IMAGES.campusModern}
            alt="Top accredited university campus"
            className="aspect-[4/3] w-full rounded-2xl border-4 border-gold object-cover shadow-[0_20px_50px_-20px_rgba(4,25,78,0.35)]"
          />
        </motion.div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/10 bg-navy py-12 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          {HOME_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading text-3xl font-bold text-gold md:text-4xl">{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-white/65 md:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} transition={{ duration: 0.4 }}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#92400E]">Why families trust us</p>
          <h2 className="mt-2 max-w-2xl font-heading text-3xl font-bold md:text-4xl">
            Built on transparency, verified partnerships and student-first advice
          </h2>
        </motion.div>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value, i) => (
            <motion.div key={value.title} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.06 }}>
              <div
                data-testid={`about-value-card-${value.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className="card-lift h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(4,25,78,0.08)]"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-navy text-gold">
                  <value.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-heading text-base font-bold">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value.copy}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-navy py-16 text-white">
        <div className="absolute inset-0 dot-grid" aria-hidden />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:px-6">
          <h2 className="font-heading text-2xl font-bold md:text-3xl">
            Ready to plan your admission the right way?
          </h2>
          <Link
            to="/apply"
            data-testid="about-cta-apply-btn"
            className="press inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-bold text-navy transition-colors hover:bg-[#ffdd5c]"
          >
            Apply Now — it's free <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
