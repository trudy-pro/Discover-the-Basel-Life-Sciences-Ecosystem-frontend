import type { Metadata, Viewport } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import "./redesign.css";
import { BottomNav } from "@/components/bottom-nav";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Overlays } from "@/components/overlays";

// Lato ships 400 and 700 here; semibold (600) resolves to 700, medium (500) to 400.
const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "Ariadne - Basel Life Sciences AI Navigator",
  description:
    "Matched labs, investors, programmes and experts across Basel-Stadt and Basel-Landschaft, each with a reason and its source, and a 12-month plan.",
};

// viewport-fit=cover exposes the safe-area insets the mobile bottom nav pads for.
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={lato.variable}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[2000] focus:rounded-lg focus:bg-white focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <SiteHeader />
        {/* Bottom padding keeps content clear of the mobile bottom nav. */}
        <main id="main" className="flex-1 pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
          {children}
        </main>
        <SiteFooter />
        <BottomNav />
        <Overlays />
      </body>
    </html>
  );
}
