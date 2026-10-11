"use client";

import { useEffect, useState } from "react";
import { PERIODS, topContacts } from "@/lib/api";
import { STAGE_LABEL, THERAPEUTIC_AREA_LABELS } from "@/lib/entity-meta";
import { LOCALE } from "@/lib/i18n";
import { useNavigator } from "@/lib/store";
import type { Entity, RoadmapStep } from "@/lib/types";
import { speak, stopSpeaking } from "@/lib/voice";
import { EmptyState } from "./empty-state";
import { ContactsCard, FundingCard, LabCard } from "./plan/info-cards";
import { MilestoneGantt } from "./plan/milestone-gantt";
import { NextActionBanner } from "./plan/next-action-banner";
import { PlanToolbar } from "./plan/plan-toolbar";
import { StepActionCard } from "./plan/step-action-card";

const ACTION_CARD_ID = "plan-action-card";

/** The Plan tab ("Action Plan"), laid out after the Stitch design and filled from the generated plan. */
export function PlanTab({ onShowMatches }: { onShowMatches?: () => void }) {
  const plan = useNavigator((s) => s.plan);
  const profile = useNavigator((s) => s.profile);
  const matches = useNavigator((s) => s.matches);
  const entities = useNavigator((s) => s.entities);
  const openDetail = useNavigator((s) => s.openDetail);
  const openEmail = useNavigator((s) => s.openEmail);
  const setHorizon = useNavigator((s) => s.setHorizon);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState<"idle" | "loading" | "playing">("idle");
  const [voiceError, setVoiceError] = useState<string | null>(null);

  useEffect(() => stopSpeaking, []);

  if (!plan || plan.steps.length === 0 || !profile) {
    return (
      <EmptyState
        title="No plan yet"
        body="Add at least one need to your profile to generate a plan."
        actionLabel="Edit profile"
        actionHref="/profile"
      />
    );
  }

  const steps = plan.steps;
  const selected = steps.find((s) => s.id === selectedId) ?? steps[0];
  const contacts = topContacts(matches, 5);
  const labs = matches.filter((m) => m.needCategory === "lab_space").map((m) => m.entity);
  const lab = labs.find((e) => e.availability) ?? labs[0];
  const alternativeLab = labs.find((e) => e.id !== lab?.id);
  const entityById = (id: string): Entity | undefined =>
    entities.find((e) => e.id === id) ?? matches.find((m) => m.entity.id === id)?.entity;
  const relatedTo = (step: RoadmapStep) =>
    step.relatedEntityIds.map(entityById).filter((e): e is Entity => Boolean(e));
  const prerequisitesOf = (step: RoadmapStep) =>
    step.dependsOn
      .map((id) => steps.findIndex((s) => s.id === id))
      .filter((i) => i >= 0)
      .sort((a, b) => a - b)
      .map((i) => ({ number: i + 1, title: steps[i].title }));
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(LOCALE[profile.language], { day: "numeric", month: "short", year: "numeric" });
  const firstStepContacts = relatedTo(steps[0]);
  const bannerContacts = (firstStepContacts.length ? firstStepContacts : contacts).slice(0, 2);

  const scrollToActionCard = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(ACTION_CARD_ID)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  const readAloud = async () => {
    if (speaking !== "idle") {
      stopSpeaking();
      setSpeaking("idle");
      return;
    }
    setVoiceError(null);
    setSpeaking("loading");
    try {
      const playing = speak(plan.summary, profile.language);
      setSpeaking("playing");
      await playing;
    } catch {
      setVoiceError("Voice output is not available in this browser.");
    } finally {
      setSpeaking("idle");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-headline-sm font-bold text-gray-900">
          Your next {plan.horizon === "12m" ? "12 months" : "90 days"} in Basel
        </h2>
        <PlanToolbar
          horizon={plan.horizon}
          onHorizon={(h) => {
            setSelectedId(null);
            void setHorizon(h);
          }}
          speaking={speaking}
          onReadAloud={readAloud}
        />
      </div>
      <p className="print-only mt-1 text-sm text-muted">
        {profile.companyName ?? "Your team"}: {profile.teamSize} people, {STAGE_LABEL[profile.stage]},{" "}
        {THERAPEUTIC_AREA_LABELS[profile.therapeuticArea]}
      </p>
      {/* The summary is what "Read plan aloud" speaks; it also heads the PDF export. */}
      <p lang={profile.language} className="print-only mt-3 leading-relaxed">
        {plan.summary}
      </p>
      {voiceError && (
        <p role="alert" className="no-print mt-2 text-sm font-bold text-[#B42318]">
          {voiceError}
        </p>
      )}

      <NextActionBanner
        step={steps[0]}
        contacts={bannerContacts}
        deadline={plan.deadlines[0]}
        formatDate={formatDate}
        language={profile.language}
        onDraftEmail={openEmail}
        onOpenActionPlan={() => {
          setSelectedId(steps[0].id);
          scrollToActionCard();
        }}
      />

      <div className="grid grid-cols-1 items-start gap-3.5 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
        <ContactsCard contacts={contacts} onDraftEmail={openEmail} onDetail={openDetail} onShowMatches={onShowMatches} />
        <FundingCard
          deadlines={plan.deadlines}
          formatDate={formatDate}
          websiteFor={(id) => entityById(id)?.website}
          onDetail={openDetail}
        />
        <LabCard
          lab={lab}
          alternative={alternativeLab}
          onDraftEmail={openEmail}
          onDetail={openDetail}
          className="md:col-span-2 xl:col-span-1"
        />
      </div>

      <MilestoneGantt
        steps={steps}
        horizon={plan.horizon}
        periods={PERIODS[plan.horizon]}
        selectedId={selected.id}
        language={profile.language}
        subtitleFor={(step) => {
          const names = relatedTo(step).map((e) => e.name);
          return names.length ? names.slice(0, 2).join(" · ") : step.description;
        }}
        onSelect={(id) => {
          setSelectedId(id);
          scrollToActionCard();
        }}
      />

      {/* Selected step (screen) */}
      <div className="no-print" aria-live="polite">
        <StepActionCard
          id={ACTION_CARD_ID}
          step={selected}
          number={steps.indexOf(selected) + 1}
          horizon={plan.horizon}
          profile={profile}
          related={relatedTo(selected)}
          prerequisites={prerequisitesOf(selected)}
          onDraftEmail={openEmail}
          onDetail={openDetail}
        />
      </div>

      {/* Every step (print) */}
      <div className="print-only">
        {steps.map((step, i) => (
          <StepActionCard
            key={step.id}
            step={step}
            number={i + 1}
            horizon={plan.horizon}
            profile={profile}
            related={relatedTo(step)}
            prerequisites={prerequisitesOf(step)}
            interactive={false}
          />
        ))}
      </div>
    </div>
  );
}
