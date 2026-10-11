"use client";

import { useSyncExternalStore } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  FlaskConical,
  GraduationCap,
  Handshake,
  Landmark,
  Loader2,
  Microscope,
  Navigation,
  PlaneLanding,
  Route,
  ShieldCheck,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { LANGUAGES, LANGUAGE_LABEL } from "@/lib/i18n";
import type { Language } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MicButton } from "./mic-button";

/* Landing page (intake) building blocks, adapted from the Stitch desktop and mobile
   designs. They hold no state of their own: app/page.tsx owns the store bindings and
   submit logic, and each component renders both layouts (lg = desktop). */

export const MAX_NEED_LENGTH = 1200;

const DESKTOP_QUERY = "(min-width: 1024px)";

/** True on desktop widths. Renders as mobile on the server and before hydration. */
function useIsDesktop() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(DESKTOP_QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
}

interface ComposerProps {
  value: string;
  busy: boolean;
  error: string | null;
  /** Briefly ring the composer after a suggestion or example fills it. */
  highlight: boolean;
  language: Language | null;
  onChange: (text: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onTranscript: (text: string) => void;
  onError: (message: string) => void;
}

export function IntakeComposer({ value, busy, error, highlight, language, onChange, onSubmit, onTranscript, onError }: ComposerProps) {
  const isDesktop = useIsDesktop();
  const submitLabel = busy ? "Reading your needs" : "Find my matches";
  return (
    <div className="w-full">
      <form
        onSubmit={onSubmit}
        className={cn(
          "w-full rounded-2xl bg-white p-4 text-left shadow-md transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/20 lg:rounded-panel lg:shadow-xl",
          highlight && "ring-2 ring-stitch-primary-fixed lg:ring-primary/20",
        )}
      >
        <div className="flex items-center justify-between gap-2 pb-3 lg:mb-4 lg:border-b lg:border-stitch-surface-highest">
          <div className="flex items-center gap-2">
            <span aria-hidden className="h-2.5 w-2.5 rounded-sm bg-primary lg:h-3 lg:w-3" />
            <label htmlFor="need" className="text-label-md font-bold tracking-wide text-ink lg:text-headline-sm lg:tracking-tight">
              Your situation and needs
            </label>
          </div>
          <span
            id="need-count"
            className="rounded-full bg-canvas-high px-2 py-0.5 text-label-sm text-stitch-on-secondary-container lg:text-stitch-secondary"
          >
            {value.length} / {MAX_NEED_LENGTH}
            <span className="sr-only"> characters</span>
          </span>
        </div>
        <textarea
          id="need"
          rows={isDesktop ? 3 : 4}
          maxLength={MAX_NEED_LENGTH}
          className="w-full resize-none bg-transparent text-body-md leading-relaxed text-ink placeholder:text-stitch-secondary focus:outline-none max-lg:placeholder:text-[#8F7068]"
          placeholder={
            isDesktop
              ? "Describe your lab, stage, regulatory need, or therapeutic modality..."
              : "Describe your startup stage, lab specifications, therapeutic area or immediate questions..."
          }
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={error ? "need-count need-error" : "need-count"}
          aria-invalid={error ? true : undefined}
        />
        <div className="mt-2 flex items-center justify-between gap-1.5 pt-3 lg:justify-end lg:gap-1 lg:pt-2">
          <MicButton
            compact
            language={language}
            onTranscript={onTranscript}
            onError={onError}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-canvas-mid text-stitch-secondary transition-all hover:bg-canvas-high active:scale-95 disabled:opacity-60 aria-pressed:bg-stitch-error-container aria-pressed:text-stitch-error lg:h-10 lg:w-10 lg:bg-transparent lg:hover:text-ink lg:aria-pressed:bg-primary lg:aria-pressed:text-white"
          />
          <button
            type="submit"
            disabled={busy}
            aria-label={submitLabel}
            title={submitLabel}
            className="group ml-auto flex h-12 min-w-[48px] items-center justify-center gap-2 rounded-full bg-primary px-4 text-white shadow-md transition-all hover:bg-stitch-primary-container active:scale-95 disabled:opacity-70 lg:ml-1 lg:h-11 lg:w-11 lg:min-w-0 lg:px-0"
          >
            {busy ? (
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            ) : (
              <>
                <ArrowRight className="h-[22px] w-[22px] lg:hidden" aria-hidden />
                <Navigation className="hidden h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 lg:block" aria-hidden />
              </>
            )}
          </button>
        </div>
      </form>
      {error && (
        <p id="need-error" role="alert" className="mt-3 text-sm font-bold text-[#B42318] lg:text-center">
          {error}
        </p>
      )}
    </div>
  );
}

const SUGGESTIONS: { text: string; icon: LucideIcon; tone: string; desktopOnly?: boolean }[] = [
  { text: "Find BSL-2 laboratory space", icon: FlaskConical, tone: "text-primary" },
  { text: "Meet regulatory experts", icon: ShieldCheck, tone: "text-stitch-tertiary" },
  { text: "Prepare for Series A", icon: Landmark, tone: "text-stitch-primary-container" },
  { text: "Connect with relevant investors", icon: Handshake, tone: "text-stitch-secondary" },
  { text: "Explore pharma partnerships", icon: Building2, tone: "text-stitch-tertiary-container" },
  { text: "Build my 12-month plan", icon: CalendarDays, tone: "text-primary" },
  // Only in the Stitch desktop design.
  { text: "BioCampus & Tech Park leases", icon: Building2, tone: "text-primary", desktopOnly: true },
];

/** Prompt starters: a swipeable row on mobile, a wrapped cluster on desktop. */
export function SuggestionChips({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="w-full lg:flex lg:flex-col lg:items-center">
      <div className="mb-2 flex items-center justify-between lg:hidden">
        <h2 className="text-label-sm font-bold uppercase tracking-wider text-stitch-on-surface-variant">Immediate Intents</h2>
        <span aria-hidden className="text-label-sm text-stitch-tertiary">
          Swipe to explore
        </span>
      </div>
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:max-w-3xl lg:flex-wrap lg:justify-center lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
        {SUGGESTIONS.map(({ text, icon: Icon, tone, desktopOnly }) => (
          <li key={text} className={cn("shrink-0", desktopOnly && "hidden lg:block")}>
            <button
              type="button"
              onClick={() => onPick(text)}
              className="flex min-h-[44px] items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-3.5 py-2 text-body-sm text-ink shadow-sm transition-all hover:bg-canvas-mid lg:min-h-0 lg:py-1.5 lg:hover:bg-canvas-high"
            >
              <Icon className={cn("h-[18px] w-[18px] lg:hidden", tone)} aria-hidden />
              {text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface LanguageSwitchProps {
  value: Language | null;
  hydrated: boolean;
  onChange: (language: Language | null) => void;
}

/** Answer language: full-width segments on mobile, an inline pill bar on desktop. */
export function LanguageSwitch({ value, hydrated, onChange }: LanguageSwitchProps) {
  return (
    <div
      role="group"
      aria-labelledby="answer-language"
      className="flex w-full flex-col gap-2 lg:mt-2 lg:w-auto lg:flex-row lg:flex-wrap lg:items-center lg:justify-center"
    >
      <div className="flex items-center justify-between lg:contents">
        <span
          id="answer-language"
          className="text-label-sm font-bold uppercase tracking-wider text-stitch-on-surface-variant lg:text-body-sm lg:font-normal lg:normal-case lg:tracking-normal lg:text-stitch-secondary"
        >
          <span className="lg:hidden">Tri-Lingual Synthesis</span>
          <span className="hidden lg:inline">Answer language</span>
        </span>
        <span className="text-label-sm text-stitch-secondary lg:hidden">Federal AI Model</span>
      </div>
      <div className="grid grid-cols-4 gap-1 rounded-full bg-canvas-high p-1 lg:inline-flex lg:gap-0 lg:bg-canvas-mid lg:shadow-inner">
        {([null, ...LANGUAGES] as (Language | null)[]).map((option) => {
          const active = hydrated && value === option;
          return (
            <button
              key={option ?? "auto"}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option)}
              className={cn(
                "min-h-[44px] rounded-full text-label-md transition-all lg:min-h-0 lg:px-3 lg:py-1 lg:text-label-sm",
                active
                  ? "bg-white font-bold text-primary shadow-sm lg:text-ink"
                  : "text-stitch-secondary hover:text-ink",
              )}
            >
              {option ? LANGUAGE_LABEL[option] : "Auto"}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface Example {
  title: string;
  /** Mobile subtitle under the title. */
  subtitle: string;
  language: "Français" | "English" | "Deutsch";
  text: string;
  tags: [string, string];
  icon: LucideIcon;
}

// The three demo scenarios: researcher, growing biotech, foreign founder.
const EXAMPLES: Example[] = [
  {
    title: "Researcher planning a spin-off",
    subtitle: "Academic translation to early venture",
    language: "Français",
    text: "Je suis chercheuse en oncologie à l'Université de Bâle, je veux créer une startup. Qu'est-ce que je dois faire ?",
    tags: ["Tech Transfer", "Innosuisse"],
    icon: GraduationCap,
  },
  {
    title: "Growing biotech before Series A",
    subtitle: "Clinical roadmap & lab scale-up",
    language: "English",
    text: "We are a six-person oncology startup preparing for Series A. We need BSL-2 laboratory space, regulatory expertise, potential investors and pharma partners.",
    tags: ["BSL-2 Space", "Venture Syndicates"],
    icon: Microscope,
  },
  {
    title: "Founder moving to Basel",
    subtitle: "DACH inbound relocation & Swiss entity",
    language: "Deutsch",
    text: "Wir sind ein Diagnostik-Startup mit acht Personen aus Deutschland in der Seed-Phase und ziehen nach Basel. Wir brauchen Laborfläche, regulatorische Beratung und Investoren.",
    tags: ["Relocation", "Swissmedic IVD"],
    icon: PlaneLanding,
  },
];

// Badge and icon colours per language, as in the Stitch files.
const DESKTOP_BADGE: Record<Example["language"], string> = {
  Français: "bg-stitch-secondary-container text-stitch-on-secondary-container",
  English: "bg-stitch-primary-fixed text-stitch-on-primary-fixed-variant",
  Deutsch: "bg-stitch-tertiary-fixed text-stitch-on-tertiary-fixed-variant",
};
const MOBILE_BADGE: Record<Example["language"], string> = {
  Français: "bg-canvas-mid text-stitch-secondary",
  English: "bg-stitch-primary-fixed text-primary",
  Deutsch: "bg-canvas-mid text-stitch-secondary",
};
const MOBILE_ICON: Record<Example["language"], string> = {
  Français: "bg-stitch-secondary-fixed text-stitch-on-secondary-fixed",
  English: "bg-stitch-primary-fixed text-stitch-on-primary-fixed",
  Deutsch: "bg-canvas-high text-stitch-secondary",
};

/** Example scenarios: stacked cards on mobile, three columns from tablet up. */
export function ExampleCards({ selectedText, onPick }: { selectedText: string; onPick: (text: string) => void }) {
  return (
    <section aria-labelledby="examples-heading">
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between lg:mb-6">
        <div>
          <p className="flex items-center gap-1.5 text-label-sm font-bold uppercase tracking-wider text-primary lg:tracking-widest">
            <Route className="h-4 w-4 lg:hidden" aria-hidden />
            Curated Trajectories
          </p>
          <h2 id="examples-heading" className="mt-0.5 text-headline-sm font-bold tracking-tight text-ink lg:text-headline-md">
            Or start from an example
          </h2>
        </div>
        <p className="text-body-sm text-stitch-secondary">
          <span className="lg:hidden">Select any founder scenario to auto-populate the engine.</span>
          <span className="hidden lg:inline">Select any founder scenario to auto-populate the engine with tailored parameters.</span>
        </p>
      </div>
      <ul className="flex flex-col gap-3 md:grid md:grid-cols-3 md:gap-6">
        {EXAMPLES.map((example) => {
          const selected = selectedText.trim() === example.text;
          return (
            <li key={example.title}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onPick(example.text)}
                className={cn(
                  "group relative flex h-full w-full flex-col justify-between rounded-2xl bg-white p-4 text-left shadow-sm transition-all duration-300 hover:shadow-md md:rounded-panel md:p-6 md:hover:bg-canvas md:hover:shadow-xl",
                  selected && "ring-1 ring-primary/20",
                )}
              >
                <MobileCardBody example={example} selected={selected} />
                <DesktopCardBody example={example} selected={selected} />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function MobileCardBody({ example, selected }: { example: Example; selected: boolean }) {
  const { title, subtitle, language, text, tags, icon: Icon } = example;
  return (
    <span className="block md:hidden">
      <span className="flex items-start justify-between gap-2">
        <span className="flex items-center gap-2">
          <span aria-hidden className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", MOBILE_ICON[language])}>
            <Icon className="h-[18px] w-[18px]" />
          </span>
          <span className="flex flex-col">
            <span className="flex items-center gap-1.5">
              <span className="text-base font-bold leading-tight text-ink">{title}</span>
              {selected && <span aria-hidden className="h-2 w-2 shrink-0 animate-ping rounded-full bg-primary" />}
            </span>
            <span className="text-label-sm text-stitch-secondary">{subtitle}</span>
          </span>
        </span>
        <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-label-sm font-bold uppercase tracking-wider", MOBILE_BADGE[language])}>
          {language}
        </span>
      </span>
      <span className={cn("mt-3 block text-body-sm leading-relaxed text-stitch-on-surface-variant", language === "Français" && "italic")}>
        “{text}”
      </span>
      <span className="mt-3.5 flex items-center justify-between pt-3">
        <span className="flex flex-wrap gap-1.5">
          {tags.map((tag, i) => (
            <span
              key={tag}
              className={cn(
                "rounded-full px-2 py-0.5 text-label-sm",
                language === "English" && i === 0
                  ? "bg-stitch-tertiary-fixed text-stitch-on-tertiary-fixed"
                  : "bg-canvas-high text-stitch-on-secondary-container",
              )}
            >
              {tag}
            </span>
          ))}
        </span>
        <span className="inline-flex min-h-[44px] shrink-0 items-center gap-1 text-label-md font-bold text-primary transition-transform group-hover:translate-x-0.5">
          {selected ? "Active prompt" : "Load prompt"}
          {selected ? <CheckCircle2 className="h-4 w-4" aria-hidden /> : <ArrowRight className="h-4 w-4" aria-hidden />}
        </span>
      </span>
    </span>
  );
}

function DesktopCardBody({ example, selected }: { example: Example; selected: boolean }) {
  const { title, language, text, tags, icon: Icon } = example;
  return (
    <span className="hidden h-full flex-col justify-between md:flex">
      <span className="block">
        <span className="mb-4 flex items-center justify-between">
          <span className={cn("rounded-full px-2.5 py-0.5 text-label-sm font-bold uppercase", DESKTOP_BADGE[language])}>
            {language}
          </span>
          <span
            aria-hidden
            className="flex h-8 w-8 items-center justify-center rounded-full bg-canvas-mid text-stitch-secondary transition-colors group-hover:bg-stitch-primary-fixed group-hover:text-primary"
          >
            <Icon className="h-[18px] w-[18px]" />
          </span>
        </span>
        <span className="mb-2 block text-headline-sm font-bold tracking-tight text-ink">{title}</span>
        <span className="block text-body-md leading-relaxed text-stitch-secondary">“{text}”</span>
      </span>
      <span className="mt-6 flex items-center justify-between gap-2 pt-4">
        <span className="text-label-sm text-stitch-secondary">{tags.join(" • ")}</span>
        <span className="inline-flex shrink-0 items-center gap-1 text-label-md font-bold text-primary transition-transform group-hover:translate-x-1">
          {selected ? "Active prompt" : "Load prompt"}
          {selected ? <CheckCircle2 className="h-4 w-4" aria-hidden /> : <ArrowRight className="h-4 w-4" aria-hidden />}
        </span>
      </span>
    </span>
  );
}

/** Mobile-only footer tile from the Stitch mobile design. */
export function CuratedTile() {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-canvas-mid p-4 lg:hidden">
      <div className="flex items-center gap-3">
        <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-sm">
          <Workflow className="h-5 w-5" />
        </span>
        <span className="flex flex-col">
          <span className="text-label-md font-bold text-ink">Curated by Basel Area Business &amp; Innovation</span>
          <span className="text-[12px] text-stitch-secondary">Cantons Basel-Stadt, Basel-Landschaft &amp; Jura</span>
        </span>
      </div>
      <BadgeCheck className="h-5 w-5 shrink-0 text-stitch-tertiary" aria-label="Verified" />
    </div>
  );
}
