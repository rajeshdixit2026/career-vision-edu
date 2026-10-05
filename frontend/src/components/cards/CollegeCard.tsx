import { Link } from "react-router-dom";
import { MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { College } from "@/lib/types";
import { buttonVariants } from "@/components/ui/button";

export default function CollegeCard({ college }: { college: College }) {
  return (
    <Card
      data-testid={`college-card-${college.id}`}
      className="card-lift flex h-full flex-col border-slate-200 shadow-[0_4px_20px_-4px_rgba(4,25,78,0.08)]"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-lg font-bold leading-snug">{college.name}</h3>
          <Badge
            variant="outline"
            className={`shrink-0 border-none font-bold ${
              college.type === "Government" ? "bg-gold text-navy" : "bg-secondary text-secondary-foreground"
            }`}
          >
            {college.type}
          </Badge>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5 text-gold" /> {college.city}, {college.state}
          </span>
          <span className="flex items-center gap-1 font-semibold text-foreground">
            <Star className="size-4 fill-gold text-gold" /> {college.rating.toFixed(1)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 pt-0">
        <div className="flex flex-wrap gap-1.5">
          {college.streams.slice(0, 3).map((stream) => (
            <span
              key={stream}
              className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground"
            >
              {stream}
            </span>
          ))}
          {college.streams.length > 3 && (
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
              +{college.streams.length - 3} more
            </span>
          )}
        </div>
        <div className="rounded-lg bg-muted px-3 py-2">
          <p className="text-xs font-medium text-muted-foreground">Fee Range</p>
          <p className="text-sm font-bold text-primary">{college.fee_range}</p>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{college.description}</p>
        <div className="mt-auto pt-2">
          <Link
            to={`/apply?college=${encodeURIComponent(college.name)}`}
            data-testid={`college-apply-btn-${college.id}`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Apply via Career Vision
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
