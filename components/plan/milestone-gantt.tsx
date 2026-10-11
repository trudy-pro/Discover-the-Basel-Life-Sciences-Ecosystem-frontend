import type { Horizon, Language, RoadmapStep } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PlanCard, periodLabel } from "./plan-card";

interface Props {
  steps: RoadmapStep[];
  horizon: Horizon;
  periods: number;
  selectedId: string;
  language: Language;
  /** Short line under each step title, e.g. its first contacts. */
  subtitleFor: (step: RoadmapStep) => string;
  onSelect: (id: string) => void;
}

/** Steps that start before one of their prerequisites has started. */
function sequencingConflicts(steps: RoadmapStep[]) {
  return steps.filter((step) =>
    step.dependsOn.some((id) => {
      const dep = steps.find((s) => s.id === id);
      return dep !== undefined && dep.start > step.start;
    }),
  );
}

export function MilestoneGantt({ steps, horizon, periods, selectedId, language, subtitleFor, onSelect }: Props) {
  const unit = horizon === "90d" ? "W" : "M";
  const columns = { gridTemplateColumns: `repeat(${periods}, minmax(0, 1fr))` };
  const conflicts = sequencingConflicts(steps);

  return (
    <PlanCard className="mt-6 overflow-hidden p-0 sm:p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 pb-[18px] pt-6 sm:px-5">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            Milestone timeline{" "}
            <span className="tabular-nums text-xs font-normal text-gray-500">
              · {steps.length} steps · {horizon === "90d" ? "90 days" : "12 months"}
            </span>
          </h2>
          <p className="mt-1.5 text-[11px] text-gray-500">Sequenced so each step starts after the steps it depends on.</p>
        </div>
        <p className="flex items-center gap-1 whitespace-nowrap text-[11px] text-gray-500">
          <i aria-hidden className="inline-block h-2.5 w-2.5 rounded-sm bg-primary" /> Step 1 (start)
          <i aria-hidden className="ml-3 inline-block h-2.5 w-2.5 rounded-sm bg-[#FBE3D6]" /> Following steps
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[760px] sm:min-w-[880px]">
          <div className="grid min-h-[42px] grid-cols-[220px_minmax(0,1fr)] border-t border-gray-100 bg-gray-50 sm:grid-cols-[305px_minmax(0,1fr)]">
            <div className="flex items-center border-r border-gray-200 px-3.5 text-[11px] font-bold">MILESTONE / ACTIVITY</div>
            <div className="grid" style={columns}>
              {Array.from({ length: periods }, (_, i) => (
                <span
                  key={i}
                  className={cn(
                    "grid place-items-center border-r border-gray-100 tabular-nums text-[11px]",
                    i === 0 && "bg-orange-50 text-primary",
                  )}
                >
                  {unit}
                  {i + 1}
                </span>
              ))}
            </div>
          </div>

          <ol>
            {steps.map((step, i) => {
              const selected = step.id === selectedId;
              const span = Math.min(step.end, periods) - step.start + 1;
              return (
                <li
                  key={step.id}
                  className={cn(
                    "grid min-h-[61px] grid-cols-[220px_minmax(0,1fr)] border-t border-gray-100 sm:grid-cols-[305px_minmax(0,1fr)]",
                    selected && "bg-orange-50/40",
                  )}
                >
                  <div className="flex items-center gap-2.5 border-r border-gray-200 px-3.5 py-3 text-xs">
                    <span
                      aria-hidden
                      className={cn(
                        "grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px]",
                        i === 0 ? "border-primary bg-primary text-white" : "border-gray-200 bg-gray-50 text-gray-600",
                      )}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <strong lang={language} className={cn("block font-bold leading-snug", i === 0 && "text-primary")}>
                        {step.title}
                      </strong>
                      <small className="mt-0.5 block truncate text-[11px] text-gray-500">{subtitleFor(step)}</small>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelect(step.id)}
                      aria-pressed={selected}
                      aria-label={`${i === 0 ? "Start now" : "View step"}: ${step.title}`}
                      className={cn(
                        "no-print ml-auto inline-flex min-h-[44px] shrink-0 items-center whitespace-nowrap rounded-md border px-2 text-[10px] font-bold transition-colors lg:min-h-[28px]",
                        i === 0 ? "border-orange-200 bg-white text-primary shadow-sm hover:bg-orange-50 hover:text-orange-800" : "border-gray-200 bg-white hover:bg-gray-50",
                      )}
                    >
                      {i === 0 ? "Start now" : "View"}
                    </button>
                  </div>
                  <div className="grid items-center px-1" style={columns}>
                    {step.start <= periods && (
                      <button
                        type="button"
                        tabIndex={-1}
                        aria-hidden
                        onClick={() => onSelect(step.id)}
                        title={periodLabel(step, horizon)}
                        style={{ gridColumn: `${step.start} / span ${span}` }}
                        className={cn(
                          "truncate rounded-md px-1 py-2 text-center text-[10px] font-bold transition-colors",
                          i === 0
                            ? "bg-primary text-white hover:bg-primary-dark"
                            : "bg-[#FBE3D6] text-[#7C2D12] hover:bg-[#F7D2BF]",
                          selected && "ring-2 ring-primary ring-offset-1",
                        )}
                      >
                        {periodLabel(step, horizon)}
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-3 border-t border-gray-200 bg-slate-50 px-4 py-4 text-[11px] sm:flex-row sm:px-5">
        <span>
          <span aria-hidden className={conflicts.length ? "text-orange-600" : "text-[#08AE87]"}>
            ●
          </span>{" "}
          <span className="text-gray-500">Status:</span>{" "}
          {conflicts.length === 0
            ? "No sequencing conflicts found"
            : `Check order: ${conflicts.map((s) => `step ${steps.indexOf(s) + 1}`).join(", ")} start before a prerequisite`}
        </span>
        <span className="no-print text-gray-500">Step 1 starts now. Select a step for its contacts and next actions.</span>
      </div>
    </PlanCard>
  );
}
