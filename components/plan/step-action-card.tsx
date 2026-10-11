"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, Download, ExternalLink } from "lucide-react";
import { NEED_META, STAGE_LABEL, THERAPEUTIC_AREA_LABELS, TYPE_META } from "@/lib/entity-meta";
import type { Entity, Horizon, Profile, RoadmapStep } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PlanCard, periodLabel } from "./plan-card";

const STORAGE_KEY = "ariadne-plan-checklist";

interface Task {
  id: string;
  title: string;
  note: string;
}

/** Ticked checklist items, kept in this browser only. Reads and writes never throw. */
function useChecklist(stepId: string) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  useEffect(() => {
    try {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Record<string, Record<string, boolean>>;
      setDone(all[stepId] ?? {});
    } catch {
      setDone({});
    }
  }, [stepId]);
  const toggle = (taskId: string, checked: boolean) => {
    const next = { ...done, [taskId]: checked };
    setDone(next);
    try {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Record<string, Record<string, boolean>>;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...all, [stepId]: next }));
    } catch {
      /* storage unavailable: keep the in-memory state */
    }
  };
  return { done, toggle };
}

function downloadBriefing(profile: Profile, step: RoadmapStep, number: number) {
  const lines = [
    "BASEL ECOSYSTEM: PITCH BRIEFING",
    "",
    `Company: ${profile.companyName ?? ""}`,
    `Team: ${profile.teamSize} people`,
    `Stage: ${STAGE_LABEL[profile.stage]}`,
    `Field: ${THERAPEUTIC_AREA_LABELS[profile.therapeuticArea] ?? profile.therapeuticArea}`,
    `Needs: ${profile.needs.map((n) => `${NEED_META[n.category].label} (${n.detail})`).join("; ")}`,
    `Plan step: ${number}. ${step.title}`,
    "",
    "Project description:",
    "",
    "Funding needs:",
    "",
    "Lab requirements:",
    "",
    "Partners we are looking for:",
    "",
    "Questions for the first meeting:",
    "",
  ];
  const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "pitch-briefing.txt";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

interface Props {
  id?: string;
  step: RoadmapStep;
  number: number;
  horizon: Horizon;
  profile: Profile;
  related: Entity[];
  /** Prerequisite steps as { number, title }. */
  prerequisites: { number: number; title: string }[];
  onDraftEmail?: (id: string) => void;
  onDetail?: (id: string) => void;
  /** Print version: no buttons or checklist. */
  interactive?: boolean;
}

/** The selected step as an action card: what to do, a checklist and who to contact. */
export function StepActionCard({ id, step, number, horizon, profile, related, prerequisites, onDraftEmail, onDetail, interactive = true }: Props) {
  const tasks: Task[] = [
    ...prerequisites.map((p) => ({ id: `prereq-${p.number}`, title: `Finish step ${p.number} first`, note: p.title })),
    ...related.slice(0, 3).map((e) => ({ id: `contact-${e.id}`, title: `Contact ${e.name}`, note: TYPE_META[e.type].label })),
  ];
  const { done, toggle } = useChecklist(step.id);
  const doneCount = tasks.filter((t) => done[t.id]).length;
  const first = related[0];
  const isFirst = number === 1;

  return (
    <PlanCard id={id} className="mt-6 scroll-mt-28 border-2 border-orange-200 p-[18px] sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-block rounded-full border border-orange-200 bg-primary-soft px-2.5 py-1 tabular-nums text-[10px] font-bold leading-normal tracking-widest text-primary">
          {isFirst ? "TODAY'S ACTION PLAN" : "ACTION PLAN"} · STEP {number} ({periodLabel(step, horizon).toUpperCase()})
        </span>
        {isFirst && (
          <span className="inline-block rounded-full border border-[#BCEBDC] bg-[#E7FAF3] px-2.5 py-1 text-[11px] text-[#00805F]">
            <span aria-hidden>● </span>Recommended next step
          </span>
        )}
      </div>
      <h3 lang={profile.language} className="mb-2 mt-3.5 text-[19px] font-bold leading-snug text-gray-900 sm:text-[21px]">
        {step.title}
      </h3>
      <p lang={profile.language} className="mb-2 max-w-prose leading-relaxed text-gray-500">
        {step.description}
      </p>

      {interactive && tasks.length > 0 && (
        <fieldset className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <legend className="sr-only">Step-by-step checklist</legend>
          <div className="mb-3 mt-1 flex flex-wrap justify-between gap-2 text-xs">
            <strong>
              STEP-BY-STEP CHECKLIST ({tasks.length} {tasks.length === 1 ? "TASK" : "TASKS"})
            </strong>
            <span className="tabular-nums text-primary" aria-live="polite">
              {doneCount} OF {tasks.length} DONE
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {tasks.map((task, i) => (
              <label
                key={task.id}
                className="flex min-h-[44px] cursor-pointer gap-2.5 rounded-[7px] border border-gray-200 bg-white p-3 text-xs"
              >
                <input
                  type="checkbox"
                  checked={Boolean(done[task.id])}
                  onChange={(e) => toggle(task.id, e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                />
                <span>
                  <strong className={cn(done[task.id] && "text-gray-400 line-through")}>
                    {i + 1}. {task.title}
                  </strong>
                  <small className="mt-0.5 block text-[11px] text-gray-500">{task.note}</small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {!interactive && related.length > 0 && (
        <p className="text-sm">
          <strong>Who to contact:</strong> {related.map((e) => e.name).join(", ")}
        </p>
      )}

      {interactive && (
        <div className="mt-5 flex flex-wrap justify-between gap-3 border-t border-gray-200 pt-[18px]">
          <div className="flex flex-wrap items-center gap-2">
            {first && onDraftEmail && (
              <button
                type="button"
                onClick={() => onDraftEmail(first.id)}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-bold text-white transition-colors hover:bg-primary-dark lg:min-h-[36px]"
              >
                <CalendarCheck className="h-4 w-4" aria-hidden />
                Draft intro email to {first.name}
              </button>
            )}
            <button
              type="button"
              onClick={() => downloadBriefing(profile, step, number)}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 text-xs font-bold transition-colors hover:bg-gray-50 lg:min-h-[36px]"
            >
              <Download className="h-4 w-4" aria-hidden />
              Download briefing template
            </button>
            {first && (
              <a
                href={first.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[44px] w-full items-center gap-1 text-xs font-bold text-primary hover:text-primary-dark lg:min-h-0"
              >
                Open {first.name} website
                <ExternalLink className="h-3 w-3" aria-hidden />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </div>
          {related.length > 0 && (
            <div className="text-[11px] leading-loose sm:ml-auto sm:text-right">
              <span className="text-gray-500">Contacts for this step:</span>
              <ul>
                {related.map((e) => (
                  <li key={e.id}>
                    <button type="button" onClick={() => onDetail?.(e.id)} className="min-h-[44px] font-bold hover:text-primary lg:min-h-[28px]">
                      {e.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </PlanCard>
  );
}
