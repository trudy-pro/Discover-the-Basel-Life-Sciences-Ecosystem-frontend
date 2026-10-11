"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { parseNeed } from "@/lib/api";
import { useHydrated, useNavigator } from "@/lib/store";
import {
  CuratedTile,
  ExampleCards,
  IntakeComposer,
  LanguageSwitch,
  MAX_NEED_LENGTH,
  SuggestionChips,
} from "@/components/intake";

export default function IntakePage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const needText = useNavigator((s) => s.needText);
  const setNeedText = useNavigator((s) => s.setNeedText);
  const setProfile = useNavigator((s) => s.setProfile);
  const language = useNavigator((s) => s.language);
  const setLanguage = useNavigator((s) => s.setLanguage);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highlight, setHighlight] = useState(false);
  const highlightTimer = useRef<ReturnType<typeof setTimeout>>();
  const text = hydrated ? needText : "";

  useEffect(() => () => clearTimeout(highlightTimer.current), []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = needText.trim();
    if (trimmed.length < 15) {
      setError("Describe your team and what you need in at least one sentence.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      setProfile(await parseNeed(trimmed, language ?? undefined));
      router.push("/profile");
    } catch {
      setError("Your description could not be read. Check your connection and try again.");
      setBusy(false);
    }
  };

  // Suggestions and examples fill the composer; the user can edit before sending.
  const fill = (value: string, scroll = false) => {
    setNeedText(value.slice(0, MAX_NEED_LENGTH));
    setError(null);
    const el = document.getElementById("need");
    el?.focus({ preventScroll: scroll });
    if (scroll) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    }
    setHighlight(true);
    clearTimeout(highlightTimer.current);
    highlightTimer.current = setTimeout(() => setHighlight(false), 600);
  };

  return (
    <>
      <section className="relative isolate overflow-hidden px-4 pb-6 pt-6 sm:px-6 lg:px-12 lg:pb-14 lg:pt-8">
        {/* Ambient glow behind the composer (desktop only). */}
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-12 -z-10 hidden h-[340px] w-[720px] -translate-x-1/2 rounded-full bg-[#FFB5A0]/25 blur-[110px] lg:block" />
        <div aria-hidden className="pointer-events-none absolute right-1/4 top-44 -z-10 hidden h-[280px] w-[380px] rounded-full bg-stitch-secondary-fixed/40 blur-[90px] lg:block" />

        <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 text-left lg:items-center lg:gap-0 lg:text-center">
          <div className="flex flex-col gap-2 lg:items-center lg:gap-0">
            <span aria-hidden className="mb-5 hidden h-14 w-14 items-center justify-center rounded-full bg-canvas-mid shadow-sm lg:flex">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-stitch-primary-fixed text-primary">
                <Sparkles className="h-6 w-6" />
              </span>
            </span>
            <h1 className="max-w-2xl text-headline-xl-mobile font-bold tracking-tight text-ink lg:mb-3 lg:text-headline-xl">
              Chat with Ariadne
            </h1>
            <p className="max-w-2xl text-body-md leading-relaxed text-stitch-secondary lg:mb-8">
              <span className="lg:hidden">
                Discover your place in Basel’s life sciences ecosystem. Get matched labs, investors, programmes and experts
                across Basel-Stadt and Basel-Landschaft, with a tailored 90-day trajectory.
              </span>
              <span className="hidden lg:inline">
                Discover Your Place in Basel’s Life Sciences Ecosystem. Speak or type in English, German or French. You get
                matched labs, investors, programmes and experts across Basel-Stadt and Basel-Landschaft, each with a reason
                and its source, and a 12-month plan with a 90-day view.
              </span>
            </p>
          </div>

          <IntakeComposer
            value={text}
            busy={busy}
            error={error}
            highlight={highlight}
            language={language}
            onChange={setNeedText}
            onSubmit={submit}
            onTranscript={(heard) => {
              const next = needText.trim() ? `${needText.trim()} ${heard}` : heard;
              setNeedText(next.slice(0, MAX_NEED_LENGTH));
              setError(null);
            }}
            onError={setError}
          />

          <div className="w-full lg:mt-6">
            <SuggestionChips onPick={(value) => fill(value)} />
          </div>

          <div className="w-full lg:mt-8 lg:flex lg:justify-center">
            <LanguageSwitch value={language} hydrated={hydrated} onChange={setLanguage} />
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 pb-6 sm:px-6 lg:px-12 lg:py-10">
        <ExampleCards selectedText={text} onPick={(value) => fill(value, true)} />
        <CuratedTile />
      </div>
    </>
  );
}
