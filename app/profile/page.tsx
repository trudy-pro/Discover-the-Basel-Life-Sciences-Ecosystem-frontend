"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Plus } from "lucide-react";
import { NEED_CATEGORIES, NEED_META, STAGES, STAGE_LABEL, THERAPEUTIC_AREAS, THERAPEUTIC_AREA_LABELS } from "@/lib/entity-meta";
import { useHydrated, useNavigator } from "@/lib/store";
import { LANGUAGES, LANGUAGE_LABEL } from "@/lib/i18n";
import type { Language, NeedCategory, Profile, Stage } from "@/lib/types";
import { uid } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";
import { NeedRow, ReviewCard, ReviewField, ReviewInput } from "@/components/profile-review";
import { Dropdown } from "@/components/ui/dropdown";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkflowSteps } from "@/components/workflow-steps";

export default function ProfilePage() {
  const hydrated = useHydrated();
  const router = useRouter();
  const profile = useNavigator((s) => s.profile);
  const setProfile = useNavigator((s) => s.setProfile);
  const runAnalysis = useNavigator((s) => s.runAnalysis);
  const analysing = useNavigator((s) => s.analysing);
  const [newCategory, setNewCategory] = useState<NeedCategory | "">("");

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-12 sm:px-6">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6 sm:py-14">
        <WorkflowSteps current={2} />
        <EmptyState
          title="No profile yet"
          body="Describe your team and needs first. Your profile appears here for you to check."
          actionLabel="Describe your needs"
          actionHref="/"
        />
      </div>
    );
  }

  const update = (patch: Partial<Profile>) => setProfile({ ...profile, ...patch });
  const unused = NEED_CATEGORIES.filter((c) => !profile.needs.some((n) => n.category === c));

  const addNeed = () => {
    if (!newCategory) return;
    update({
      needs: [...profile.needs, { id: uid("need"), category: newCategory, detail: NEED_META[newCategory].defaultDetail }],
    });
    setNewCategory("");
  };

  const confirm = async () => {
    await runAnalysis();
    router.push("/results");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-10 sm:px-6 sm:py-14">
      <header className="space-y-3">
        <div className="pb-2">
          <WorkflowSteps current={2} />
        </div>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">Check what we understood</h1>
        <p className="max-w-2xl text-base leading-relaxed text-[#696763] sm:text-lg">
          Correct anything that is off. Your matches and 12-month Basel ecosystem roadmap are built from this profile.
        </p>
      </header>

      <div className="space-y-8">
        <ReviewCard>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-ink">Your team</h2>
            <span className="text-xs font-medium text-[#94918B]">Core parameters</span>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <ReviewField label="Company name" hint="(optional)" id="company">
              <ReviewInput
                id="company"
                value={profile.companyName ?? ""}
                placeholder="e.g. Helix Bio"
                onChange={(e) => update({ companyName: e.target.value || undefined })}
              />
            </ReviewField>
            <ReviewField label="Team size" id="team">
              <ReviewInput
                id="team"
                type="number"
                min={1}
                max={5000}
                value={profile.teamSize}
                onChange={(e) => update({ teamSize: Math.max(1, Number(e.target.value) || 1) })}
              />
            </ReviewField>
            <ReviewField label="Stage" id="stage">
              <Dropdown<Stage>
                id="stage"
                labelledBy="stage-label"
                value={profile.stage}
                options={STAGES.map((s) => ({ value: s, label: STAGE_LABEL[s] }))}
                onChange={(stage) => update({ stage })}
              />
            </ReviewField>
            <ReviewField label="Field" id="area">
              <Dropdown
                id="area"
                labelledBy="area-label"
                value={profile.therapeuticArea}
                options={THERAPEUTIC_AREAS.map((a) => ({ value: a, label: THERAPEUTIC_AREA_LABELS[a] }))}
                onChange={(therapeuticArea) => update({ therapeuticArea })}
              />
            </ReviewField>
            <ReviewField label="Answer language" id="language">
              <Dropdown<Language>
                id="language"
                labelledBy="language-label"
                value={profile.language}
                options={LANGUAGES.map((l) => ({ value: l, label: LANGUAGE_LABEL[l] }))}
                onChange={(language) => update({ language })}
              />
            </ReviewField>
          </div>
        </ReviewCard>

        <ReviewCard className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-ink">Key needs &amp; resources</h2>
            <p className="text-sm text-[#696763]">Add the key resources, partners or expertise you’re looking for in Basel.</p>
          </div>

          {profile.needs.length === 0 ? (
            <p className="rounded-2xl border border-[#ECE9E2] bg-[#FAF9F7] p-4 text-sm text-[#696763]">
              No needs listed. Add at least one below to get matches.
            </p>
          ) : (
            <ul className="space-y-3">
              {profile.needs.map((need) => (
                <NeedRow
                  key={need.id}
                  category={need.category}
                  detail={need.detail}
                  onDetailChange={(detail) =>
                    update({ needs: profile.needs.map((n) => (n.id === need.id ? { ...n, detail } : n)) })
                  }
                  onRemove={() => update({ needs: profile.needs.filter((n) => n.id !== need.id) })}
                />
              ))}
            </ul>
          )}

          {unused.length > 0 && (
            <div className="pt-2">
              <label id="new-need-label" htmlFor="new-need" className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#94918B]">
                Add a need
              </label>
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <div className="w-full sm:flex-1">
                  <Dropdown<NeedCategory>
                    id="new-need"
                    labelledBy="new-need-label"
                    value={newCategory}
                    placeholder="Choose a category"
                    options={unused.map((c) => ({ value: c, label: NEED_META[c].label }))}
                    onChange={setNewCategory}
                  />
                </div>
                <button
                  type="button"
                  onClick={addNeed}
                  disabled={!newCategory}
                  className="inline-flex h-12 w-full shrink-0 items-center justify-center gap-1.5 rounded-xl border border-dashed border-primary/50 bg-primary-soft/50 px-5 text-sm font-bold text-primary transition-all hover:border-primary hover:bg-primary-soft disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                  Add need
                </button>
              </div>
            </div>
          )}
        </ReviewCard>

        <div className="flex flex-col items-center gap-5 pt-3 sm:flex-row">
          <button
            type="button"
            onClick={confirm}
            disabled={analysing || profile.needs.length === 0}
            className="inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-primary px-8 text-base font-bold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-primary/40 active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 sm:w-auto"
          >
            {analysing ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : null}
            {analysing ? "Finding matches" : "Show my matches"}
            {!analysing && <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />}
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="min-h-[44px] text-sm font-bold text-[#383835] underline decoration-[#94918B] underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
          >
            Edit description
          </button>
        </div>
      </div>
    </div>
  );
}
