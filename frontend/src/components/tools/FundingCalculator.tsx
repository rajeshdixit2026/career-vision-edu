import { useMemo, useState } from "react";
import { Info, IndianRupee, PiggyBank } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FundingCalculatorProps {
  ratePercent: number;
  compareRatePercent?: number;
  tone?: "light" | "dark";
  maxAmount?: number;
}

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** Monthly-EMI estimator for education funding (MNSSBY 0%/4% or commercial loans). */
export default function FundingCalculator({
  ratePercent,
  compareRatePercent,
  tone = "light",
  maxAmount = 400000,
}: FundingCalculatorProps) {
  const dark = tone === "dark";
  const [amount, setAmount] = useState(200000);
  const [years, setYears] = useState("3");

  const emi = useMemo(() => {
    const n = Number(years) * 12;
    const r = ratePercent / 12 / 100;
    if (r === 0) return amount / n;
    const factor = Math.pow(1 + r, n);
    return (amount * r * factor) / (factor - 1);
  }, [amount, years, ratePercent]);

  const compareEmi = useMemo(() => {
    if (compareRatePercent === undefined) return null;
    const n = Number(years) * 12;
    const r = compareRatePercent / 12 / 100;
    const factor = Math.pow(1 + r, n);
    return (amount * r * factor) / (factor - 1);
  }, [amount, years, compareRatePercent]);

  const n = Number(years) * 12;
  const total = Math.round(emi) * n;
  const interest = total - amount;
  const savings = compareEmi === null ? null : Math.round((compareEmi - emi) * n);

  const labelCls = dark ? "text-xs font-semibold text-white/75" : "text-xs font-semibold text-foreground/80";
  const panelCls = dark ? "bg-white/10 text-white" : "bg-muted text-foreground";

  return (
    <div
      data-testid="funding-calculator"
      className={cn(
        "rounded-2xl border p-6",
        dark ? "border-white/15 bg-navy-card text-white" : "border-slate-200 bg-white shadow-[0_4px_20px_-4px_rgba(4,25,78,0.08)]",
      )}
    >
      <div className="flex items-center gap-2">
        <PiggyBank className={cn("size-5", dark ? "text-gold" : "text-primary")} />
        <h3 className="font-heading text-lg font-bold">EMI Estimator</h3>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <span className={labelCls}>Loan amount</span>
            <span
              data-testid="funding-amount-value"
              className={cn("flex items-center text-sm font-bold", dark ? "text-gold" : "text-primary")}
            >
              <IndianRupee className="size-3.5" /> {inr.format(amount)}
            </span>
          </div>
          <input
            type="range"
            min={50000}
            max={maxAmount}
            step={10000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            data-testid="funding-amount-range"
            aria-label="Loan amount"
            className="mt-3 w-full accent-gold"
          />
          <div className="mt-1 flex justify-between text-[11px] opacity-60">
            <span>₹50,000</span>
            <span>₹{inr.format(maxAmount)}</span>
          </div>
        </div>

        <div>
          <span className={labelCls}>Course duration</span>
          <Select value={years} onValueChange={(value: string) => setYears(value)}>
            <SelectTrigger
              data-testid="funding-years-select"
              className={cn("mt-2 w-full", dark && "border-white/20 bg-white/10 text-white")}
            >
              <SelectValue>{(v: string) => `${v} year${Number(v) > 1 ? "s" : ""}`}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {["1", "2", "3", "4"].map((y) => (
                <SelectItem key={y} value={y} data-testid={`funding-years-option-${y}y`}>
                  {y} year{Number(y) > 1 ? "s" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={cn("rounded-xl p-4", panelCls)}>
          <div className="flex items-end justify-between">
            <div>
              <p className={labelCls}>Monthly EMI</p>
              <p
                data-testid="funding-emi-value"
                className={cn("mt-1 flex items-center font-heading text-3xl font-bold", dark ? "text-gold" : "text-primary")}
              >
                <IndianRupee className="size-6" />
                {inr.format(Math.round(emi))}
              </p>
            </div>
            <p className="text-right text-[11px] opacity-70">
              {ratePercent}% p.a. · {years} yr
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-3 text-sm border-current/15">
            <div>
              <p className={labelCls}>Total interest</p>
              <p data-testid="funding-interest-value" className="mt-0.5 font-bold">
                ₹{inr.format(Math.max(interest, 0))}
              </p>
            </div>
            <div>
              <p className={labelCls}>Total payable</p>
              <p data-testid="funding-total-value" className="mt-0.5 font-bold">
                ₹{inr.format(total)}
              </p>
            </div>
          </div>
        </div>

        {savings !== null && savings > 0 && (
          <div
            data-testid="funding-savings-value"
            className={cn(
              "flex items-center gap-2 rounded-xl border border-dashed p-3 text-sm font-semibold",
              dark ? "border-gold/40 text-gold" : "border-gold bg-gold-soft text-[#78350F]",
            )}
          >
            <Info className="size-4 shrink-0" />
            You save about ₹{inr.format(savings)} compared to a {compareRatePercent}% commercial education loan.
          </div>
        )}
      </div>
    </div>
  );
}
