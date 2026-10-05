import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { Info } from "lucide-react";
import { apiGet } from "@/lib/api";
import type { Course } from "@/lib/types";
import { CATEGORY_ICONS, COURSE_CATEGORIES, categorySlug } from "@/lib/site";
import { FALLBACK_COURSES } from "@/lib/fallbackData";
import PageHeader from "@/components/layout/PageHeader";
import CourseCard from "@/components/cards/CourseCard";

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") ?? "";

  const coursesQuery = useQuery({
    queryKey: ["courses", category],
    queryFn: () =>
      apiGet<Course[]>(`/courses${category ? `?category=${encodeURIComponent(category)}` : ""}`),
  });

  const courses = coursesQuery.isError ? FALLBACK_COURSES : (coursesQuery.data ?? []);

  function selectCategory(value: string) {
    setSearchParams(value ? { category: value } : {});
  }

  return (
    <>
      <PageHeader
        badge="Courses We Offer"
        title="Find the course that fits your future"
        description="Undergraduate, postgraduate and diploma programmes across engineering, nursing, pharmacy, management, law, education and more — all with admission guidance and funding support."
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2" data-testid="courses-category-filter">
          <button
            type="button"
            data-testid="filter-category-all"
            onClick={() => selectCategory("")}
            className={`press rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              category === ""
                ? "border-navy bg-navy text-white"
                : "border-slate-300 bg-white text-foreground/75 hover:border-navy hover:text-navy"
            }`}
          >
            All Courses
          </button>
          {COURSE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              data-testid={`filter-category-${categorySlug(cat)}`}
              onClick={() => selectCategory(cat)}
              className={`press flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                category === cat
                  ? "border-navy bg-navy text-white"
                  : "border-slate-300 bg-white text-foreground/75 hover:border-navy hover:text-navy"
              }`}
            >
              <span aria-hidden>{CATEGORY_ICONS[cat]}</span>
              {cat}
            </button>
          ))}
        </div>

        {coursesQuery.isPending ? (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : (
          <>
            {coursesQuery.isError && (
              <p className="mt-8 flex items-center gap-2 rounded-xl border border-dashed border-gold bg-gold-soft px-4 py-3 text-sm font-medium text-[#78350F]">
                <Info className="size-4 shrink-0" />
                Live catalog is briefly unavailable — showing a few popular courses meanwhile.
              </p>
            )}
            <p className="mt-8 text-sm font-medium text-muted-foreground" data-testid="courses-count-text">
              {courses.length} course{courses.length === 1 ? "" : "s"}{" "}
              {category ? `in ${category}` : "available"}
            </p>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.3) }}
                >
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </div>
            {!coursesQuery.isError && courses.length === 0 && (
              <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <p className="font-heading text-lg font-bold">No courses in this category yet</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try another category — or call us, we add new programmes every admission season.
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
