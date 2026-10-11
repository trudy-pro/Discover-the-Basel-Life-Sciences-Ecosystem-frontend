import { Loader2, Printer, Square, Volume2 } from "lucide-react";
import { HORIZON_LABEL } from "@/lib/i18n";
import type { Horizon } from "@/lib/types";
import { cn } from "@/lib/utils";

const HORIZONS: Horizon[] = ["12m", "90d"];

interface Props {
  horizon: Horizon;
  onHorizon: (horizon: Horizon) => void;
  speaking: "idle" | "loading" | "playing";
  onReadAloud: () => void;
}

/** Plan length switch, PDF export and read-aloud. */
export function PlanToolbar({ horizon, onHorizon, speaking, onReadAloud }: Props) {
  return (
    <div className="no-print flex flex-wrap items-center gap-2 lg:justify-end">
      <div role="group" aria-label="Plan length" className="flex rounded-full bg-canvas-mid p-1">
        {HORIZONS.map((h) => (
          <button
            key={h}
            type="button"
            aria-pressed={horizon === h}
            onClick={() => horizon !== h && onHorizon(h)}
            className={cn(
              "min-h-[44px] rounded-full px-3.5 text-xs font-bold capitalize transition-all lg:min-h-[30px]",
              horizon === h ? "bg-white text-primary shadow-sm" : "text-muted hover:text-ink",
            )}
          >
            {HORIZON_LABEL[h]}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 text-xs font-bold text-gray-900 transition-colors hover:bg-gray-50 lg:min-h-[36px]"
      >
        <Printer className="h-3.5 w-3.5" aria-hidden />
        Export as PDF
      </button>
      <button
        type="button"
        onClick={onReadAloud}
        aria-pressed={speaking !== "idle"}
        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md border border-orange-200 bg-white text-primary shadow-sm hover:bg-orange-50 hover:text-orange-800 px-3 text-xs font-bold transition-colors lg:min-h-[36px]"
      >
        {speaking === "loading" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
        ) : speaking === "playing" ? (
          <Square className="h-3 w-3 fill-current" aria-hidden />
        ) : (
          <Volume2 className="h-3.5 w-3.5" aria-hidden />
        )}
        {speaking === "idle" ? "Read plan aloud" : "Stop reading"}
      </button>
    </div>
  );
}
