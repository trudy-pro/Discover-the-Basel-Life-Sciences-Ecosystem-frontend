import {
  Factory,
  FileText,
  FlaskConical,
  Heart,
  Landmark,
  Microscope,
  Rocket,
  Scale,
  Stethoscope,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { NEED_META } from "@/lib/entity-meta";
import type { NeedCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";

/* Presentational pieces for the profile review step (/profile), styled after the
   Stitch "Check what we understood" design. All state lives in app/profile/page.tsx. */

/** Card wrapper for a section of the review form. */
export function ReviewCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-[#E3E0D8] bg-white p-6 shadow-[0_4px_24px_rgba(20,20,19,0.03)] transition-colors hover:border-[#D4D0C5] sm:p-8",
        className,
      )}
    >
      {children}
    </section>
  );
}

// Stitch form controls: warm fill, rounded corners, orange focus ring.
const control =
  "h-12 rounded-xl border-[#DCD9D1] bg-[#FAFAF8] px-4 text-sm font-bold text-ink placeholder:font-medium placeholder:text-[#94918B] transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/25 max-lg:h-12";

export function ReviewField({
  label,
  hint,
  id,
  children,
}: {
  label: string;
  hint?: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label id={`${id}-label`} htmlFor={id} className="block text-sm font-bold text-[#383835]">
        {label} {hint && <span className="text-xs font-normal text-[#94918B]">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

export function ReviewInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <Input {...props} className={cn(control, props.className)} />;
}


// Icon and tint per need category. The first four follow the Stitch design.
const NEED_STYLE: Record<NeedCategory, { icon: LucideIcon; tile: string }> = {
  lab_space: { icon: FlaskConical, tile: "bg-[#FEEFEA] text-[#D95B30]" },
  investors: { icon: Users, tile: "bg-[#EAF2FF] text-[#2F6FE4]" },
  regulatory: { icon: FileText, tile: "bg-[#E8F8F0] text-[#199E64]" },
  pharma_partners: { icon: Heart, tile: "bg-[#F4EEFD] text-[#8644E2]" },
  acceleration: { icon: Rocket, tile: "bg-[#FFF6E0] text-[#B7791F]" },
  research: { icon: Microscope, tile: "bg-[#E6F6F8] text-[#0E7C86]" },
  grants: { icon: Landmark, tile: "bg-[#EEF7E6] text-[#4D8B1F]" },
  manufacturing: { icon: Factory, tile: "bg-[#EEF0F3] text-[#4A5568]" },
  legal_ip: { icon: Scale, tile: "bg-[#FCEEF4] text-[#C2386B]" },
  clinical: { icon: Stethoscope, tile: "bg-[#EDEFFD] text-[#4F5BD5]" },
};

export function NeedRow({
  category,
  detail,
  onDetailChange,
  onRemove,
}: {
  category: NeedCategory;
  detail: string;
  onDetailChange: (detail: string) => void;
  onRemove: () => void;
}) {
  const { icon: Icon, tile } = NEED_STYLE[category];
  const label = NEED_META[category].label;
  return (
    <li className="flex flex-col items-stretch gap-3 rounded-2xl border border-[#ECE9E2] bg-[#FAF9F7] p-2 sm:flex-row sm:items-center sm:p-2.5">
      <div className="flex min-w-[190px] items-center gap-3 px-2 py-1">
        <span aria-hidden className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", tile)}>
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-sm font-bold text-[#232321]">{label}</span>
      </div>
      <div className="flex flex-1 items-center gap-2">
        <Input
          aria-label={`Detail for ${label}`}
          value={detail}
          onChange={(e) => onDetailChange(e.target.value)}
          className="h-11 rounded-xl border-[#E3E0D8] bg-white px-4 font-bold shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
        />
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          title="Remove requirement"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E3E0D8] bg-white text-[#94918B] transition-colors hover:border-[#94918B] hover:bg-[#FDFCFB] hover:text-[#232321]"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </li>
  );
}
