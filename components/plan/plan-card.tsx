import type { LucideIcon } from "lucide-react";
import type { Horizon, RoadmapStep } from "@/lib/types";
import { cn } from "@/lib/utils";

/* Shared building blocks for the Plan tab, styled after the Stitch "Action Plan" design. */

export function PlanCard({ className, children, id }: { className?: string; children: React.ReactNode; id?: string }) {
  return (
    <section
      id={id}
      className={cn(
        "print-plain print-avoid-break rounded-[13px] border border-gray-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] sm:p-5",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function PlanCardTitle({ icon: Icon, children, aside }: { icon: LucideIcon; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="mb-5 mt-1 flex items-center justify-between gap-2">
      <h3 className="flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-wide text-gray-900">
        <span aria-hidden className="rounded-lg bg-[#F6F5F3] p-1.5">
          <Icon className="h-4 w-4" />
        </span>
        {children}
      </h3>
      {aside}
    </div>
  );
}

export function MonoPill({ children, tone = "neutral", className }: { children: React.ReactNode; tone?: "neutral" | "warning"; className?: string }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded px-1.5 py-1 text-center tabular-nums text-[10px] leading-tight tracking-wide",
        tone === "warning" ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-600",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function CardFooter({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-4 text-[11px]">{children}</div>;
}

/** Text-style button in the accent colour. */
export function LinkButton({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={cn("min-h-[44px] text-left font-bold text-primary hover:text-primary-dark lg:min-h-0", className)}
    />
  );
}

/** "Month 3", "Months 1–3", "Week 2" or "Weeks 1–4". */
export function periodLabel(step: Pick<RoadmapStep, "start" | "end">, horizon: Horizon) {
  const unit = horizon === "90d" ? "Week" : "Month";
  return step.start === step.end ? `${unit} ${step.start}` : `${unit}s ${step.start}–${step.end}`;
}

/** Whole days from today until an ISO date (negative when past). */
export function daysUntil(iso: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(iso);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}
