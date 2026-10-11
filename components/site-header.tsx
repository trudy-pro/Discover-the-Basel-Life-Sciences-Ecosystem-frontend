"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bookmark, Compass, RotateCcw, Sparkles, UserRound } from "lucide-react";
import { useHydrated, useNavigator } from "@/lib/store";
import { cn } from "@/lib/utils";
import { BrandMark } from "./brand-mark";

export function SiteHeader() {
  const hydrated = useHydrated();
  const pathname = usePathname();
  const router = useRouter();
  const shortlistCount = useNavigator((s) => s.shortlist.length);
  const hasResults = useNavigator((s) => s.matches.length > 0);
  const reset = useNavigator((s) => s.reset);
  const showResults = hydrated && hasResults;

  // Segments of the desktop nav pill; the current page is the raised white segment.
  const segment = (href: string) =>
    cn(
      "inline-flex min-h-[40px] items-center gap-2 rounded-full px-4 text-[15px] font-bold transition-all",
      pathname === href ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink",
    );
  const segmentIcon = (href: string) => cn("h-[18px] w-[18px]", pathname === href ? "text-primary" : "text-muted");

  const startOver = () => {
    reset();
    router.push("/");
  };

  return (
    <header className="no-print sticky top-0 z-[900] bg-canvas/85 shadow-float backdrop-blur-xl lg:bg-transparent lg:px-6 lg:pt-3 lg:shadow-none lg:backdrop-blur-none">
      {/* Desktop: a floating rounded bar. Mobile: a full-width bar. */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[72px] lg:rounded-full lg:bg-white/95 lg:pl-3 lg:pr-3 lg:shadow-[0_2px_16px_rgba(0,0,0,0.06)] lg:backdrop-blur-xl">
        <Link href="/" className="flex min-h-[44px] min-w-0 items-center gap-2.5 lg:gap-3" aria-label="Ariadne, home">
          <BrandMark className="h-9 w-9 ring-2 ring-stitch-primary-fixed lg:h-12 lg:w-12 lg:ring-0" />
          <span className="text-headline-sm font-bold leading-none tracking-tight text-ink lg:text-[22px] lg:leading-tight">
            Ariadne
          </span>
        </Link>

        {/* Desktop navigation. On smaller screens the bottom nav takes over. */}
        <nav aria-label="Main" className="hidden items-center gap-1 rounded-full bg-canvas-mid p-1 lg:flex">
          <Link href="/directory" className={segment("/directory")} aria-current={pathname === "/directory" ? "page" : undefined}>
            <Compass className={segmentIcon("/directory")} aria-hidden />
            Directory
          </Link>
          {showResults && (
            <Link href="/results" className={segment("/results")} aria-current={pathname === "/results" ? "page" : undefined}>
              <Sparkles className={segmentIcon("/results")} aria-hidden />
              Results
            </Link>
          )}
          <Link href="/shortlist" className={segment("/shortlist")} aria-current={pathname === "/shortlist" ? "page" : undefined}>
            <Bookmark className={segmentIcon("/shortlist")} aria-hidden />
            Shortlist
            {hydrated && shortlistCount > 0 && (
              <span className="min-w-[22px] rounded-full bg-stitch-primary-fixed px-1.5 text-center text-xs font-bold leading-5 text-primary">
                {shortlistCount}
                <span className="sr-only"> saved</span>
              </span>
            )}
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-1 lg:gap-3">
          <span className="flex items-center gap-1.5 rounded-full bg-canvas-mid px-2.5 py-1 lg:hidden">
            <span aria-hidden className="h-2 w-2 animate-pulse rounded-full bg-stitch-tertiary" />
            <span className="text-label-sm font-bold uppercase text-stitch-tertiary">BSL AI Active</span>
          </span>
          {showResults && (
            <button
              type="button"
              onClick={startOver}
              aria-label="Start over"
              title="Start over"
              className="flex h-11 w-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-canvas-high hover:text-ink"
            >
              <RotateCcw className="h-5 w-5" aria-hidden />
            </button>
          )}
          <InterfaceLanguagePlaceholder />
          <Link
            href="/profile"
            aria-label="Your profile"
            aria-current={pathname === "/profile" ? "page" : undefined}
            // Mobile only: a filled 32px avatar inside a 44px touch target.
            className="flex h-11 w-11 items-center justify-center rounded-full lg:hidden"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
              <UserRound className="h-[18px] w-[18px]" aria-hidden />
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}

/**
 * PLACEHOLDER: interface language switch from the design. It has no functionality
 * yet; the interface is English-only (the answer language is set on the landing page).
 * EN is shown as current; DE and FR are marked unavailable.
 */
function InterfaceLanguagePlaceholder() {
  return (
    <div role="group" aria-label="Interface language" className="hidden items-center rounded-full bg-canvas-mid p-1 lg:flex">
      {(["EN", "DE", "FR"] as const).map((code) => {
        const current = code === "EN";
        return (
          <button
            key={code}
            type="button"
            aria-pressed={current}
            aria-disabled={!current}
            title={current ? "English" : "Not available yet"}
            className={cn(
              "min-h-[36px] rounded-full px-4 text-label-md font-bold tracking-wide",
              current ? "bg-white text-ink shadow-sm" : "cursor-default text-muted",
            )}
          >
            {code}
            {!current && <span className="sr-only"> (not available yet)</span>}
          </button>
        );
      })}
    </div>
  );
}
