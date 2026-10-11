import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Inquiry", href: "/" },
  { label: "Profile & Needs Review", href: "/profile" },
  { label: "Matches & Roadmap", href: "/results" },
] as const;

/**
 * Progress through the matching workflow: describe needs, review the profile,
 * view matches. Completed steps link back. On narrow screens only the current
 * step keeps its visible label.
 */
export function WorkflowSteps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <nav aria-label="Progress">
      <ol className="flex flex-wrap items-center gap-2 text-xs font-medium sm:gap-3 sm:text-sm">
        {STEPS.map((step, i) => {
          const n = i + 1;
          const state = n < current ? "done" : n === current ? "current" : "upcoming";
          const label = (
            <span className={cn(state !== "current" && "sr-only sm:not-sr-only")}>
              {state === "done" ? `${n}. ${step.label}` : step.label}
              {state === "done" && <span className="sr-only"> (completed)</span>}
            </span>
          );
          return (
            <li key={step.label} className="flex items-center gap-2 sm:gap-3">
              {i > 0 && <ChevronRight aria-hidden className="h-4 w-4 shrink-0 text-[#94918B]" />}
              {state === "done" ? (
                <Link href={step.href} className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 text-[#383835] hover:text-ink sm:min-h-0 sm:min-w-0 sm:justify-start">
                  <span aria-hidden className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E8F8F0] text-[#199E64]">
                    <Check className="h-3 w-3" strokeWidth={2.5} />
                  </span>
                  {label}
                </Link>
              ) : (
                <span
                  aria-current={state === "current" ? "step" : undefined}
                  className={cn("flex items-center gap-2", state === "current" ? "font-bold" : "text-[#94918B]")}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs",
                      state === "current" ? "bg-primary text-white" : "border border-[#DBD7CE]",
                    )}
                  >
                    {n}
                  </span>
                  <span className={cn(state === "current" && "text-primary-dark")}>{label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
