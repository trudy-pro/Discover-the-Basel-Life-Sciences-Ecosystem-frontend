"use client";

import Link from "next/link";
import { Bookmark, Pencil } from "lucide-react";
import { CANTON_LABEL, NEED_META, STAGE_LABEL, THERAPEUTIC_AREA_LABELS } from "@/lib/entity-meta";
import { LANGUAGE_LABEL } from "@/lib/i18n";
import { useNavigator } from "@/lib/store";

/** "Your team" card beside the results (Stitch Action Plan sidebar). */
export function ProfileSidebar() {
  const profile = useNavigator((s) => s.profile);
  const shortlistCount = useNavigator((s) => s.shortlist.length);
  if (!profile) return null;

  return (
    <aside
      aria-label="Your profile"
      className="no-print self-start rounded-xl border border-gray-200/80 bg-white p-4 lg:sticky lg:top-24"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-gray-900">{profile.companyName ?? "Your team"}</h2>
        <Link
          href="/profile"
          aria-label="Edit profile"
          className="flex items-center justify-center rounded-md p-1 text-primary hover:bg-primary-soft max-lg:h-11 max-lg:w-11"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
      <p className="mb-1 text-xs text-gray-600">
        {profile.teamSize} people, {STAGE_LABEL[profile.stage]}, {THERAPEUTIC_AREA_LABELS[profile.therapeuticArea]}
      </p>
      <p className="text-xs text-gray-500">Answers in {LANGUAGE_LABEL[profile.language]}</p>

      <div className="mt-4 border-t border-gray-100 pt-3">
        <h3 className="mb-2.5 text-xs font-bold text-gray-900">Needs</h3>
        <ul className="flex flex-wrap gap-2 lg:flex-col">
          {profile.needs.map((need) => (
            <li key={need.id} className="rounded-lg border border-gray-100 bg-gray-50/70 p-2.5">
              <p className="text-xs font-bold text-gray-800">{NEED_META[need.category].label}</p>
              <p className="hidden text-[11px] text-gray-500 lg:block">{need.detail}</p>
            </li>
          ))}
        </ul>

        {(profile.cantonFilter || (profile.constraints?.length ?? 0) > 0) && (
          <>
            <h3 className="mb-2 mt-4 text-xs font-bold text-gray-900">Refinements</h3>
            <ul className="space-y-1 text-xs text-gray-500">
              {profile.cantonFilter && <li>Only {CANTON_LABEL[profile.cantonFilter]}</li>}
              {profile.constraints?.map((c) => <li key={c}>Investors: {c}</li>)}
            </ul>
          </>
        )}

        <Link
          href="/shortlist"
          className="mt-2 flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/70 p-2.5 text-xs font-bold text-gray-800 hover:text-primary max-lg:min-h-[44px]"
        >
          <span className="flex items-center gap-1.5">
            <Bookmark className="h-3.5 w-3.5 text-gray-500" aria-hidden />
            Shortlist
          </span>
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-stitch-primary-fixed px-1.5 text-[10px] font-bold text-primary">
            {shortlistCount}
            <span className="sr-only"> saved</span>
          </span>
        </Link>
      </div>
    </aside>
  );
}
