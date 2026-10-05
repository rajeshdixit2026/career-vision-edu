import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  GraduationCap,
  Phone,
  Quote,
  Star,
} from "lucide-react";
import { apiGet } from "@/lib/api";
import type { College, Course } from "@/lib/types";
import { FALLBACK_COLLEGES, FALLBACK_COURSES } from "@/lib/fallbackData";
import { CONTACT, HOME_STATS, IMAGES, SERVICES, TESTIMONIALS } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CollegeCard from "@/components/cards/CollegeCard";
import CourseCard from "@/components/cards/CourseCard";
import QuickCounsellingModal from "@/components/forms/QuickCounsellingModal";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  const coursesQuery = useQuery({ queryKey: ["courses"], queryFn: () => apiGet<Course[]>("/courses") });
  const collegesQuery = useQuery({ queryKey: ["colleges"], queryFn: () => apiGet<College[]>("/colleges") });

  const popularCourses = (
    coursesQuery.isError ? FALLBACK_COURSES : (coursesQuery.data ?? [])
  )
    .filter((course) => course.popular)
    .slice(0, 6);
  const featuredColleges = (
    collegesQuery.isError ? FALLBACK_COLLEGES : (collegesQuery.data ?? [])
  )
    .filter((college) => college.featured)
    .slice(0, 6);

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-navy text-white">
        <img
          src={IMAGES.heroCampus}
          alt="Indian university students collaborating on campus grounds"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 hero-scrim" />
        <div className="absolute inset-0 dot-grid" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 pb-20 pt-32 sm:px-6 md:pt-36 lg:grid-cols-12 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7"
          >
            <p className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3.5 py-1 text-xs font-bold text-navy">
              <Star className="size-3 fill-navy" /> Trusted Career &amp; Admission Guidance
            </p>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-[3.5rem]">
              Make the Right Choice for <span className="text-gold">Your Future.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
              Get expert career counseling and admission guidance to choose the right course, college
              and career path with confidence
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                data-testid="hero-book-counselling-btn"
                onClick={() => setModalOpen(true)}
                className="press gap-2 rounded-full bg-gold px-6 font-bold text-navy hover:bg-[#ffdd5c]"
              >
                <CalendarCheck className="size-4" /> Book Free Counselling
              </Button>
              <Link
                to="/colleges"
                data-testid="hero-explore-colleges-btn"
                className="press gap-2 rounded-full border border-white/30 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:border-gold hover:text-gold"
              >
                Explore Colleges <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70">
              <span className="flex items-center gap-1.5">
                <span className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-4 fill-gold text-gold" />
                  ))}
                </span>
                4.9/5 from 2,000+ students
              </span>
              <span className="hidden h-4 w-px bg-white/25 sm:block" />
              <span>100% free · No registration fee</span>
            </div>
          </motion.div>

          {/* Counselor card */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-4 lg:col-span-5"
          >
            <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <span className="flex size-12 items-center justify-center rounded-full bg-gold text-navy">
                  <GraduationCap className="size-6" />
                </span>
                <div>
                  <p className="font-heading text-base font-bold">Talk to a Senior Counselor</p>
                  <p className="text-xs text-white/65">12+ years of admission experience</p>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-white/80">
                {[
                  "Free 1-on-1 session — 15 minutes, zero obligation",
                  "Course + college shortlist the same day",
                  "Scholarship & Bihar Credit Card check included",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gold" /> {line}
                  </li>
                ))}
              </ul>
              <Button
                className="press mt-5 w-full rounded-full bg-gold font-bold text-navy hover:bg-[#ffdd5c]"
                data-testid="hero-counselor-card-book-btn"
                onClick={() => setModalOpen(true)}
              >
                Book Free Counselling
              </Button>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold">Quick finder</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Engineering & Technology", "Medical & Nursing", "Management & Commerce", "Law"].map((cat) => (
                  <Link
                    key={cat}
                    to={`/courses?category=${encodeURIComponent(cat)}`}
                    data-testid={`hero-quickfinder-${cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/85 transition-colors hover:border-gold hover:text-gold"
                  >
                    {cat.split(" &")[0]}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ribbon ───────────────────────────────────────── */}
      <section className="border-y border-white/10 bg-navy-deep py-10 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          {HOME_STATS.map((stat) => (
            <div key={stat.label} className="text-center md:text-left" data-testid="home-stat-item">
              <p className="font-heading text-3xl font-bold text-gold md:text-4xl">{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-white/65 md:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} transition={{ duration: 0.4 }}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#92400E]">What we do</p>
          <h2 className="mt-2 max-w-2xl font-heading text-3xl font-bold md:text-4xl">
            Everything you need to get admitted — under one roof
          </h2>
        </motion.div>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <motion.div key={service.title} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.06 }}>
              <Link
                to={service.path}
                data-testid={`home-service-card-${service.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className="card-lift block h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(4,25,78,0.08)]"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-navy text-gold">
                  <service.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-heading text-lg font-bold">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary">
                  Learn more <ArrowRight className="size-3.5 text-gold" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Popular courses ────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <motion.div {...fadeUp} transition={{ duration: 0.4 }}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#92400E]">Courses</p>
              <h2 className="mt-2 font-heading text-3xl font-bold md:text-4xl">Most sought-after courses</h2>
            </motion.div>
            <Link
              to="/courses"
              data-testid="home-view-all-courses-btn"
              className="press inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-primary transition-colors hover:border-navy hover:bg-navy hover:text-white"
            >
              View all courses <ArrowRight className="size-4" />
            </Link>
          </div>
          {coursesQuery.isPending ? (
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-72 animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {popularCourses.map((course, i) => (
                <motion.div key={course.id} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.05 }}>
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Featured colleges ──────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <motion.div {...fadeUp} transition={{ duration: 0.4 }}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#92400E]">Colleges</p>
            <h2 className="mt-2 font-heading text-3xl font-bold md:text-4xl">Featured partner colleges</h2>
          </motion.div>
          <Link
            to="/colleges"
            data-testid="home-view-all-colleges-btn"
            className="press inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-primary transition-colors hover:border-navy hover:bg-navy hover:text-white"
          >
            Explore all colleges <ArrowRight className="size-4" />
          </Link>
        </div>
        {collegesQuery.isPending ? (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredColleges.map((college, i) => (
              <motion.div key={college.id} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.05 }}>
                <CollegeCard college={college} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ── Why choose us ──────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="relative">
            <img
              src={IMAGES.counseling}
              alt="Career counselor guiding a student in a 1-on-1 consultation"
              className="aspect-[4/3] w-full rounded-2xl border-4 border-gold object-cover shadow-[0_20px_50px_-20px_rgba(4,25,78,0.35)]"
            />
            <div className="absolute -bottom-6 right-4 rounded-2xl bg-navy p-4 text-white shadow-xl md:right-10">
              <p className="font-heading text-2xl font-bold text-gold">12+ Years</p>
              <p className="text-xs text-white/70">of admission guidance</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#92400E]">Why Career Vision</p>
            <h2 className="mt-2 font-heading text-3xl font-bold md:text-4xl">
              Honest guidance, from people who do this every day
            </h2>
            <ul className="mt-8 space-y-4">
              {[
                "Transparent advice — real fees, real approvals, real placement data",
                "Authorized enrollment partner for universities across India",
                "Dedicated counselor from first call to final admission",
                "Funding support: scholarships, education loans & Bihar Student Credit Card",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm font-medium md:text-base">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#16A34A]" /> {point}
                </li>
              ))}
            </ul>
            <Link
              to="/about"
              data-testid="home-about-link"
              className={`press mt-8 inline-flex items-center gap-1.5 rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-card`}
            >
              Know more about us <ArrowRight className="size-4 text-gold" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Funding support ────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} transition={{ duration: 0.4 }}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#92400E]">Funding support</p>
          <h2 className="mt-2 max-w-2xl font-heading text-3xl font-bold md:text-4xl">
            Money should never come between you and your degree
          </h2>
        </motion.div>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              title: "Bihar Student Credit Card",
              copy: "Education loans up to ₹4 lakh under MNSSBY — 0% interest for girls, transgender and PwD students; 4% for others.",
              path: "/bihar-credit-card",
            },
            {
              title: "Scholarships",
              copy: "National and state scholarships, plus university merit waivers of up to 50% — we find what you qualify for.",
              path: "/scholarships",
            },
            {
              title: "Education Loans",
              copy: "Zero-collateral loans up to ₹7.5 lakh and collateral-free options from partner banks, with full paperwork support.",
              path: "/education-loan",
            },
          ].map((card, i) => (
            <motion.div key={card.title} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.06 }}>
              <Link
                to={card.path}
                data-testid={`home-funding-card-${card.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className="card-lift block h-full rounded-2xl border-l-4 border-gold bg-navy p-6 text-white"
              >
                <h3 className="font-heading text-lg font-bold">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{card.copy}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-gold">
                  Learn more <ArrowRight className="size-3.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} transition={{ duration: 0.4 }}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#92400E]">Testimonials</p>
            <h2 className="mt-2 font-heading text-3xl font-bold md:text-4xl">
              Students who found their path with us
            </h2>
          </motion.div>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.06 }}>
                <Card
                  data-testid={`home-testimonial-${t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  className="h-full border-slate-200 shadow-[0_4px_20px_-4px_rgba(4,25,78,0.08)]"
                >
                  <CardHeader className="pb-2">
                    <Quote className="size-6 fill-gold-soft text-gold" />
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col">
                    <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{t.quote}</p>
                    <div className="mt-4 flex items-center gap-1">
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} className="size-3.5 fill-gold text-gold" />
                      ))}
                    </div>
                    <p className="mt-2 text-sm font-bold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.course}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA band ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-navy py-20 text-white">
        <div className="absolute inset-0 dot-grid" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-heading text-3xl font-bold md:text-4xl">
            Confused about which college is right for you?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/75 md:text-base">
            Book a free counselling session — our senior counselors will map out your best options
            within 24 hours.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              data-testid="home-cta-book-btn"
              onClick={() => setModalOpen(true)}
              className="press gap-2 rounded-full bg-gold px-7 font-bold text-navy hover:bg-[#ffdd5c]"
            >
              <CalendarCheck className="size-4" /> Book Free Counselling
            </Button>
            <a
              href={`tel:${CONTACT.phone1.replace(/\s/g, "")}`}
              data-testid="home-cta-call-link"
              className="press inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:border-gold hover:text-gold"
            >
              <Phone className="size-4" /> {CONTACT.phone1}
            </a>
          </div>
        </div>
      </section>

      <QuickCounsellingModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
