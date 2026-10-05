import { BookOpen, Clock, IndianRupee, Sparkles, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Course } from "@/lib/types";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Card
      data-testid={`course-card-${course.id}`}
      className="card-lift flex h-full flex-col border-slate-200 shadow-[0_4px_20px_-4px_rgba(4,25,78,0.08)]"
    >
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="bg-secondary font-semibold text-secondary-foreground">
            {course.level}
          </Badge>
          <Badge variant="outline" className="gap-1 font-medium">
            <Clock className="size-3" /> {course.duration}
          </Badge>
          {course.popular && (
            <Badge className="gap-1 border-none bg-gold font-bold text-navy">
              <Sparkles className="size-3" /> Popular
            </Badge>
          )}
        </div>
        <h3 className="mt-2 font-heading text-lg font-bold leading-snug text-foreground">{course.name}</h3>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 pt-0">
        <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <IndianRupee className="size-3.5" /> Indicative Fee
          </span>
          <span className="text-sm font-bold text-primary">{course.fee_range}</span>
        </div>
        <p className="flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground">
          <BookOpen className="mt-0.5 size-3.5 shrink-0 text-gold" />
          <span>
            <span className="font-semibold text-foreground/70">Eligibility:</span> {course.eligibility}
          </span>
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">{course.description}</p>
        <div className="mt-auto pt-1">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground/70">
            <TrendingUp className="size-3.5 text-gold" /> Career Outcomes
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {course.career_outcomes.slice(0, 3).map((outcome) => (
              <span
                key={outcome}
                className="rounded-full bg-gold-soft px-2.5 py-0.5 text-[11px] font-semibold text-[#78350F]"
              >
                {outcome}
              </span>
            ))}
            {course.career_outcomes.length > 3 && (
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                +{course.career_outcomes.length - 3} more
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
