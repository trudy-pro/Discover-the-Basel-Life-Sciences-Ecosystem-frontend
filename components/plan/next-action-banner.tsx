import { ChevronRight, Mail } from "lucide-react";
import type { Deadline, Entity, Language, RoadmapStep } from "@/lib/types";

interface Props {
  step: RoadmapStep;
  contacts: Entity[];
  deadline?: Deadline;
  formatDate: (iso: string) => string;
  language: Language;
  onDraftEmail: (entityId: string) => void;
  onOpenActionPlan: () => void;
}

/** "Next immediate action": step 1, its first contacts and the nearest deadline. */
export function NextActionBanner({ step, contacts, deadline, formatDate, language, onDraftEmail, onOpenActionPlan }: Props) {
  const first = contacts[0];
  return (
    <section
      aria-label="Next immediate action"
      className="print-avoid-break my-6 flex flex-wrap items-center gap-3.5 rounded-xl border border-orange-200/50 bg-[#FEF6EE] p-4 sm:px-5 sm:py-[22px]"
    >
      <div className="min-w-[220px] flex-1 text-sm leading-relaxed text-orange-800">
        <span className="mb-1.5 inline-block rounded-full bg-white px-2.5 py-1 tabular-nums text-[10px] font-bold tracking-widest text-primary shadow-sm">
          NEXT IMMEDIATE ACTION
        </span>
        <p>
          <strong>
            Step 1: <span lang={language}>{step.title}</span>.
          </strong>
          {contacts.length > 0 && (
            <>
              {" "}
              First contacts: <strong>{contacts.map((c) => c.name).join(", ")}.</strong>
            </>
          )}
          {deadline && (
            <>
              {" "}
              Next deadline:{" "}
              <strong className="underline underline-offset-2">
                {deadline.title}, {formatDate(deadline.date)}.
              </strong>
            </>
          )}
        </p>
      </div>
      <div className="no-print flex flex-wrap gap-2.5">
        {first && (
          <button
            type="button"
            onClick={() => onDraftEmail(first.id)}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md bg-primary px-3.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark lg:min-h-[38px]"
          >
            <Mail className="h-4 w-4" aria-hidden />
            Draft intro to {first.name}
          </button>
        )}
        <button
          type="button"
          onClick={onOpenActionPlan}
          className="inline-flex min-h-[44px] items-center gap-1 rounded-md border border-orange-200 bg-orange-50 px-3.5 text-sm font-bold text-primary transition-colors hover:bg-orange-100 hover:text-orange-800 lg:min-h-[38px]"
        >
          Open action plan
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </section>
  );
}
