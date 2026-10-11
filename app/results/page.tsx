"use client";

import { useState } from "react";
import { CalendarRange, LayoutGrid, MapPin, MessageSquare, Share2 } from "lucide-react";
import { useHydrated, useNavigator } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ChatPanel } from "@/components/chat-panel";
import { EmptyState } from "@/components/empty-state";
import { GraphTab } from "@/components/graph-tab";
import { MapTab } from "@/components/map-tab";
import { MatchesTab } from "@/components/matches-tab";
import { ProfileSidebar } from "@/components/profile-sidebar";
import { PlanTab } from "@/components/plan-tab";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkflowSteps } from "@/components/workflow-steps";

const TABS = [
  { id: "matches", label: "Matches", icon: LayoutGrid },
  { id: "plan", label: "Plan", icon: CalendarRange },
  { id: "map", label: "Map", icon: MapPin },
  { id: "graph", label: "Graph", icon: Share2 },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ResultsPage() {
  const hydrated = useHydrated();
  const profile = useNavigator((s) => s.profile);
  const hasMatches = useNavigator((s) => s.matches.length > 0);
  const analysing = useNavigator((s) => s.analysing);
  const matchCount = useNavigator((s) => s.matches.length);
  const [tab, setTab] = useState<TabId>("matches");
  const [chatOpen, setChatOpen] = useState(false);

  if (!hydrated) return <ResultsSkeleton />;

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <EmptyState
          title="No results yet"
          body="Describe your team and what you need. Your matches, 12-month plan, map and graph appear here."
          actionLabel="Describe your needs"
          actionHref="/"
        />
      </div>
    );
  }

  const onTabKey = (e: React.KeyboardEvent) => {
    const i = TABS.findIndex((t) => t.id === tab);
    if (e.key === "ArrowRight") setTab(TABS[(i + 1) % TABS.length].id);
    if (e.key === "ArrowLeft") setTab(TABS[(i - 1 + TABS.length) % TABS.length].id);
  };

  return (
    <>
    <div className="no-print mx-auto flex max-w-[1400px] justify-center px-4 pt-6 sm:px-6">
      <WorkflowSteps current={3} />
    </div>
    <div
      className={cn(
        "mx-auto grid max-w-[1400px] gap-5 px-4 pb-12 pt-4 sm:px-6",
        chatOpen ? "lg:grid-cols-[250px_minmax(0,1fr)_320px] xl:grid-cols-[280px_minmax(0,1fr)_320px]" : "lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)] xl:gap-8",
      )}
    >
      <ProfileSidebar />

      <div className="min-w-0">
        {/* On mobile and tablet the tab row sticks under the header; the bottom nav is site navigation. */}
        <div className="no-print sticky top-16 z-[800] -mx-4 flex items-center justify-between gap-2 bg-canvas/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:gap-3 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <div
            role="tablist"
            aria-label="Results"
            onKeyDown={onTabKey}
            className="grid flex-1 grid-cols-4 gap-1 rounded-full bg-canvas-mid p-1 lg:inline-flex lg:flex-none"
          >
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                id={`tab-${id}`}
                aria-selected={tab === id}
                aria-controls="results-panel"
                tabIndex={tab === id ? 0 : -1}
                onClick={() => setTab(id)}
                className={cn(
                  "flex min-h-[44px] items-center justify-center gap-1.5 rounded-full px-1 text-xs font-bold transition-all sm:gap-2 sm:px-4 sm:text-sm lg:min-h-[40px]",
                  tab === id ? "bg-white text-primary shadow-sm" : "text-muted hover:text-ink",
                )}
              >
                <Icon className={cn("hidden h-4 w-4 sm:block", tab === id ? "text-primary" : "text-muted")} aria-hidden />
                {label}
                {id === "matches" && matchCount > 0 && (
                  <span
                    className={cn(
                      "hidden rounded px-1.5 py-0.5 text-[10px] sm:inline",
                      tab === id ? "bg-primary-soft text-primary" : "bg-white text-gray-600",
                    )}
                  >
                    {matchCount}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="ml-auto">
            <Button
              variant={chatOpen ? "accent" : "outline"}
              onClick={() => setChatOpen((o) => !o)}
              aria-expanded={chatOpen}
              aria-label="Refine results"
              className="h-11 w-11 px-0 sm:w-auto sm:px-4 lg:h-10"
            >
              <MessageSquare className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Refine results</span>
            </Button>
          </div>
        </div>

        <div id="results-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="mt-5" aria-busy={analysing}>
          {analysing && !hasMatches ? (
            <CardSkeletons />
          ) : !hasMatches ? (
            <EmptyState
              title="No matches for this profile"
              body="Your current needs and refinements return nothing. Add a need, or open Refine results and write “both cantons”."
              actionLabel="Edit profile"
              actionHref="/profile"
            />
          ) : (
            <div className={cn(analysing && "opacity-60")}>
              {tab === "matches" && <MatchesTab />}
              {tab === "plan" && <PlanTab onShowMatches={() => setTab("matches")} />}
              {tab === "map" && <MapTab />}
              {tab === "graph" && <GraphTab />}
            </div>
          )}
        </div>
      </div>

      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
    </>
  );
}

function CardSkeletons() {
  return (
    <div className="grid gap-4 md:grid-cols-2" role="status" aria-label="Loading matches">
      {Array.from({ length: 6 }, (_, i) => (
        <Skeleton key={i} className="h-52 rounded-2xl" />
      ))}
    </div>
  );
}

function ResultsSkeleton() {
  return (
    <div className="mx-auto grid max-w-[1400px] gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
      <Skeleton className="h-64 rounded-2xl" />
      <CardSkeletons />
    </div>
  );
}
