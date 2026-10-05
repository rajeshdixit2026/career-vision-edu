import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Info, Search } from "lucide-react";
import { apiGet } from "@/lib/api";
import type { College } from "@/lib/types";
import { COURSE_CATEGORIES, categorySlug, IMAGES } from "@/lib/site";
import { FALLBACK_COLLEGES } from "@/lib/fallbackData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageHeader from "@/components/layout/PageHeader";
import CollegeCard from "@/components/cards/CollegeCard";

export default function Colleges() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [state, setState] = useState("");
  const [stream, setStream] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const params = new URLSearchParams();
  if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
  if (state) params.set("state", state);
  if (stream) params.set("stream", stream);
  const qs = params.toString();

  const collegesQuery = useQuery({
    queryKey: ["colleges", { debouncedSearch, state, stream }],
    queryFn: () => apiGet<College[]>(`/colleges${qs ? `?${qs}` : ""}`),
  });

  // One unfiltered fetch just to derive the state filter options.
  const allQuery = useQuery({ queryKey: ["colleges"], queryFn: () => apiGet<College[]>("/colleges") });
  const states = allQuery.isError
    ? [...new Set(FALLBACK_COLLEGES.map((c) => c.state))].sort()
    : [...new Set((allQuery.data ?? []).map((c) => c.state))].sort();

  const colleges = collegesQuery.isError ? FALLBACK_COLLEGES : (collegesQuery.data ?? []);
  const hasFilters = Boolean(debouncedSearch.trim() || state || stream);

  return (
    <>
      <PageHeader
        badge="Partner Colleges"
        title="250+ verified colleges across India"
        description="Government, private and deemed universities we work with directly — with transparent fees, real approvals and end-to-end admission support."
        image={IMAGES.campusModern}
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(4,25,78,0.08)] md:grid-cols-4" data-testid="colleges-filter-bar">
          <div className="space-y-1.5">
            <Label htmlFor="college-search" className="text-xs font-semibold text-foreground/80">
              Search
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="college-search"
                data-testid="college-search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search college…"
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="college-state" className="text-xs font-semibold text-foreground/80">
              State
            </Label>
            <Select value={state} onValueChange={(value: string) => setState(value)}>
              <SelectTrigger id="college-state" data-testid="college-state-select" className="w-full">
                <SelectValue>{(v: string) => (v ? v : "All States")}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {states.map((option) => (
                  <SelectItem key={option} value={option} data-testid={`college-state-option-${categorySlug(option)}`}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="college-stream" className="text-xs font-semibold text-foreground/80">
              Stream
            </Label>
            <Select value={stream} onValueChange={(value: string) => setStream(value)}>
              <SelectTrigger id="college-stream" data-testid="college-stream-select" className="w-full">
                <SelectValue>{(v: string) => (v ? v : "All Streams")}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {COURSE_CATEGORIES.map((option) => (
                  <SelectItem key={option} value={option} data-testid={`college-stream-option-${categorySlug(option)}`}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              className="w-full rounded-full"
              data-testid="college-filters-clear-btn"
              onClick={() => {
                setSearch("");
                setState("");
                setStream("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {collegesQuery.isPending ? (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : (
          <>
            {collegesQuery.isError && (
              <p className="mt-8 flex items-center gap-2 rounded-xl border border-dashed border-gold bg-gold-soft px-4 py-3 text-sm font-medium text-[#78350F]">
                <Info className="size-4 shrink-0" />
                Live directory is briefly unavailable — showing a few featured colleges meanwhile.
              </p>
            )}
            <p className="mt-8 text-sm font-medium text-muted-foreground" data-testid="colleges-count-text">
              {colleges.length} college{colleges.length === 1 ? "" : "s"} found
              {hasFilters ? " — adjust filters to see more" : ""}
            </p>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {colleges.map((college, i) => (
                <motion.div
                  key={college.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.3) }}
                >
                  <CollegeCard college={college} />
                </motion.div>
              ))}
            </div>
            {!collegesQuery.isError && colleges.length === 0 && (
              <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center" data-testid="colleges-empty-state">
                <p className="font-heading text-lg font-bold">No colleges match those filters</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try clearing a filter — or tell us what you need and we'll find it for you.
                </p>
                <Button
                  variant="outline"
                  className="mt-6 rounded-full"
                  data-testid="colleges-empty-clear-btn"
                  onClick={() => {
                    setSearch("");
                    setState("");
                    setStream("");
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
