import { ArrowRight, CalendarClock, ExternalLink, FlaskConical, Users } from "lucide-react";
import { CANTON_LABEL } from "@/lib/entity-meta";
import type { Deadline, Entity } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CardFooter, LinkButton, MonoPill, PlanCard, PlanCardTitle, daysUntil } from "./plan-card";

const actionButton =
  "inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-md border px-2.5 text-[11px] font-bold transition-colors lg:min-h-[30px]";

function contactAction(entity: Entity) {
  if (entity.type === "lab_space") return "Request tour";
  if (entity.type === "investor") return "Send email";
  return "Request intro";
}

interface ContactsProps {
  contacts: Entity[];
  onDraftEmail: (id: string) => void;
  onDetail: (id: string) => void;
  onShowMatches?: () => void;
}

export function ContactsCard({ contacts, onDraftEmail, onDetail, onShowMatches }: ContactsProps) {
  return (
    <PlanCard>
      <PlanCardTitle icon={Users} aside={<MonoPill>{contacts.length} prioritised</MonoPill>}>
        Contacts to reach first
      </PlanCardTitle>
      {contacts.length === 0 ? (
        <p className="text-sm text-gray-500">No contacts yet. Add a need to your profile to get matches.</p>
      ) : (
        <ol className="space-y-3">
          {contacts.map((entity, i) => (
            <li
              key={entity.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-3 text-xs"
            >
              <div className="min-w-0">
                <button
                  type="button"
                  onClick={() => onDetail(entity.id)}
                  className={cn("block min-h-[44px] text-left font-bold hover:underline lg:min-h-0", i < 3 ? "text-primary" : "text-gray-900")}
                >
                  {entity.name}
                </button>
                <a
                  href={`mailto:${entity.contactEmail}`}
                  className="flex min-h-[44px] items-center break-all tabular-nums text-[10px] leading-relaxed text-gray-500 hover:text-gray-900 lg:block lg:min-h-0"
                >
                  {entity.contactEmail}
                </a>
              </div>
              <button
                type="button"
                onClick={() => onDraftEmail(entity.id)}
                className={cn(
                  actionButton,
                  "no-print",
                  i === 0 ? "border-orange-200 bg-white text-primary shadow-sm hover:bg-orange-50 hover:text-orange-800" : "border-gray-200 bg-white text-gray-900 hover:bg-gray-50",
                )}
              >
                {contactAction(entity)}
              </button>
            </li>
          ))}
        </ol>
      )}
      <CardFooter>
        <span className="text-gray-500">{contacts.length} key contacts</span>
        {onShowMatches && (
          <LinkButton onClick={onShowMatches} className="no-print text-[11px]">
            See all matches →
          </LinkButton>
        )}
      </CardFooter>
    </PlanCard>
  );
}

interface FundingProps {
  deadlines: Deadline[];
  formatDate: (iso: string) => string;
  /** Website of the programme behind a deadline, if known. */
  websiteFor: (entityId: string) => string | undefined;
  onDetail: (id: string) => void;
}

export function FundingCard({ deadlines, formatDate, websiteFor, onDetail }: FundingProps) {
  const [next, ...later] = deadlines;
  const days = next ? daysUntil(next.date) : null;
  const website = next ? websiteFor(next.entityId) : undefined;
  return (
    <PlanCard>
      <PlanCardTitle
        icon={CalendarClock}
        aside={days !== null && days >= 0 && <MonoPill tone="warning">T−{days} days</MonoPill>}
      >
        Funding deadlines
      </PlanCardTitle>
      {!next ? (
        <p className="text-sm text-gray-500">No upcoming deadlines for your stage.</p>
      ) : (
        <>
          <div className="rounded-lg border border-orange-200/50 bg-orange-50 p-3">
            <div className="flex items-center justify-between gap-2">
              <time dateTime={next.date} className="tabular-nums text-xs font-bold text-primary">
                {formatDate(next.date)}
              </time>
              {days !== null && days >= 0 && days <= 60 && (
                <span className="rounded-sm bg-orange-100 px-1.5 py-1 text-[9px] font-bold text-orange-800">Deadline soon</span>
              )}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed">
              <strong className="text-xs">{next.title}</strong>
              <br />
              <span className="text-gray-500">{next.note}</span>
            </p>
            <div className="no-print mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onDetail(next.entityId)}
                className={cn(actionButton, "border-orange-200 bg-white text-primary shadow-sm hover:bg-orange-50 hover:text-orange-800")}
              >
                View programme
                <ArrowRight className="h-3 w-3" aria-hidden />
              </button>
              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(actionButton, "border-gray-200 bg-white text-gray-900 hover:bg-gray-50")}
                >
                  Website
                  <ExternalLink className="h-3 w-3" aria-hidden />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </div>
          </div>
          {later.length > 0 && (
            <ul className="mt-2 space-y-2 text-[11px] leading-relaxed text-gray-500">
              {later.map((d) => (
                <li key={d.id} className="flex gap-2">
                  <span aria-hidden className="text-primary">
                    •
                  </span>
                  <span>
                    <time dateTime={d.date} className="font-bold text-gray-900">
                      {formatDate(d.date)}
                    </time>
                    : {d.title}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
      <CardFooter>
        <span className="text-gray-500">Next call</span>
        <span className="truncate tabular-nums">{later[0]?.title ?? "None scheduled"}</span>
      </CardFooter>
    </PlanCard>
  );
}

interface LabProps {
  lab?: Entity;
  alternative?: Entity;
  onDraftEmail: (id: string) => void;
  onDetail: (id: string) => void;
  className?: string;
}

export function LabCard({ lab, alternative, onDraftEmail, onDetail, className }: LabProps) {
  return (
    <PlanCard className={className}>
      <PlanCardTitle icon={FlaskConical} aside={lab && <MonoPill>{CANTON_LABEL[lab.canton]}</MonoPill>}>
        Lab space
      </PlanCardTitle>
      {!lab ? (
        <p className="text-sm text-gray-500">
          Lab space is not among your needs. Open Refine results and write “add lab space” to include it.
        </p>
      ) : (
        <>
          <button type="button" onClick={() => onDetail(lab.id)} className="block min-h-[44px] text-left font-bold text-primary hover:underline lg:min-h-0">
            {lab.name}
          </button>
          {lab.availability && (
            <p className="my-2.5 inline-block rounded-[5px] border border-orange-200 bg-orange-50 px-1.5 py-1.5 text-[11px] text-orange-800">
              <span aria-hidden>● </span>
              {lab.availability}
            </p>
          )}
          <p className="line-clamp-3 text-xs leading-relaxed text-gray-500">{lab.description}</p>
          <button
            type="button"
            onClick={() => onDraftEmail(lab.id)}
            className="no-print mt-3 inline-flex min-h-[44px] items-center gap-1 rounded-md border border-orange-200 bg-white px-3 text-[11px] font-bold text-primary shadow-sm transition-colors hover:bg-orange-50 hover:text-orange-800 lg:min-h-[34px]"
          >
            Request waiting list &amp; viewing
            <ArrowRight className="h-3 w-3" aria-hidden />
          </button>
          {lab.facilities.length > 0 && (
            <ul className="mb-5 mt-3 flex flex-wrap gap-1.5" aria-label="Facilities">
              {lab.facilities.map((f) => (
                <li key={f} className="rounded-sm bg-gray-100 px-1.5 py-1 tabular-nums text-[9px] text-gray-600">
                  {f}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
      <CardFooter>
        <span className="text-gray-500">Alternative site</span>
        {alternative ? (
          <LinkButton onClick={() => onDetail(alternative.id)} className="text-right text-[11px]">
            {alternative.name} →
          </LinkButton>
        ) : (
          <span className="text-gray-500">None matched</span>
        )}
      </CardFooter>
    </PlanCard>
  );
}
