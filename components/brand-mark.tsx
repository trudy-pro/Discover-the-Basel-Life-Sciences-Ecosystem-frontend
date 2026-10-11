import { cn } from "@/lib/utils";

/** Ariadne mark: three linked nodes and a spark. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("flex shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-sm", className)}
    >
      <svg className="h-[55%] w-[55%]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7" cy="15" r="2.5" strokeWidth="2" />
        <circle cx="17" cy="7" r="2.5" strokeWidth="2" />
        <circle cx="16.5" cy="17.5" r="2.5" strokeWidth="2" />
        <path d="M9.2 13.7l5.3-5.3M9.5 15.5l4.5 1.5" strokeWidth="1.75" />
        <path d="M7 6l.8 1.5L9.3 8.3l-1.5.8L7 10.6l-.8-1.5L4.7 8.3l1.5-.8z" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}
