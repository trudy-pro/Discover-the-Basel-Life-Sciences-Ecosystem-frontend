"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, LayoutGrid, MessageCircle, Sparkles, type LucideIcon } from "lucide-react";
import { useHydrated, useNavigator } from "@/lib/store";
import { cn } from "@/lib/utils";

const ITEMS: { href: string; label: string; icon: LucideIcon; /** Extra paths that highlight this item. */ also?: string[] }[] = [
  { href: "/", label: "Chat", icon: MessageCircle, also: ["/profile"] },
  { href: "/directory", label: "Directory", icon: LayoutGrid },
  { href: "/results", label: "Results", icon: Sparkles },
  { href: "/shortlist", label: "Shortlist", icon: Bookmark },
];

/** Mobile and tablet navigation, fixed to the bottom of the screen. Hidden on desktop. */
export function BottomNav() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const shortlistCount = useNavigator((s) => s.shortlist.length);

  return (
    <nav
      aria-label="Main"
      className="no-print fixed inset-x-0 bottom-0 z-[850] bg-canvas/90 pb-[env(safe-area-inset-bottom)] shadow-[0_-1px_12px_rgba(0,0,0,0.05)] backdrop-blur-xl lg:hidden"
    >
      <ul className="mx-auto flex h-16 max-w-xl items-center justify-around px-1">
        {ITEMS.map(({ href, label, icon: Icon, also }) => {
          const active = pathname === href || (also?.includes(pathname) ?? false);
          const count = href === "/shortlist" && hydrated ? shortlistCount : 0;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex min-h-[48px] min-w-[64px] flex-col items-center justify-center gap-0.5 rounded-xl px-2 text-label-sm transition-colors",
                  active ? "font-bold text-primary" : "text-muted hover:text-ink",
                )}
              >
                <Icon className="h-[22px] w-[22px]" aria-hidden />
                {label}
                {count > 0 && (
                  <span className="absolute right-2.5 top-1 min-w-[18px] rounded-full bg-primary px-1 text-center text-[10px] font-bold leading-[18px] text-white">
                    {count}
                    <span className="sr-only"> saved</span>
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
