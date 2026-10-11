import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Existing token names, remapped to the Figma redesign the same way the Figma
        // export aliases them (--blue -> orange, --navy -> charcoal).
        primary: { DEFAULT: "#C2410C", dark: "#9A3412", soft: "#FFF3E8" },
        accent: { DEFAULT: "#1A1A1A", dark: "#000000", soft: "#EBE8E0" },
        ink: "#1A1A1A",
        muted: "#5A5A5A",
        line: "#C4BFB5",
        surface: "#F3F3F3",
        // Stitch neutrals: warm page background and hairline borders.
        canvas: { DEFAULT: "#FAF9F6", low: "#F4F3F0", mid: "#EFEEEB", high: "#E9E8E5" },
        hairline: "#E2DFD8",
        // Stitch accent roles used on the landing page (badges, status, icons).
        stitch: {
          secondary: "#545F73",
          "secondary-container": "#D5E0F8",
          "on-secondary-container": "#586377",
          "secondary-fixed": "#D8E3FB",
          "on-secondary-fixed": "#111C2D",
          tertiary: "#00685F",
          "tertiary-container": "#008378",
          "tertiary-fixed": "#89F5E7",
          "on-tertiary-fixed": "#00201D",
          "on-tertiary-fixed-variant": "#005049",
          "primary-container": "#D34011",
          "primary-fixed": "#FFDBD1",
          "on-primary-fixed": "#3B0900",
          "on-primary-fixed-variant": "#872000",
          "on-surface-variant": "#5A413A",
          "surface-highest": "#E3E2DF",
          "error-container": "#FFDAD6",
          error: "#BA1A1A",
        },
        // Figma palette (mirrors the :root tokens in app/redesign.css).
        figma: {
          orange: "#C2410C",
          "orange-soft": "#FFF3E8",
          "bg-primary": "#F3F3F3",
          "bg-secondary": "#EBE8E0",
          text: "#1A1A1A",
          "text-secondary": "#5A5A5A",
          border: "#C4BFB5",
          blue: "#458CC9",
          error: "#D33E3F",
        },
        // Pre-redesign values, kept so nothing is lost and a rollback is one rename away.
        legacy: {
          primary: { DEFAULT: "#123B7A", dark: "#0C2B5C", soft: "#E8EEF8" },
          accent: { DEFAULT: "#0E8F8A", dark: "#0A6E6A", soft: "#E1F4F2" },
          ink: "#14213D",
          muted: "#5A6781",
          line: "#DCE3EE",
          surface: "#F4F7FB",
        },
      },
      fontFamily: {
        sans: ["var(--font-lato)", "Lato", "Helvetica Neue", "Arial", "sans-serif"],
      },
      // Stitch type scale (names don't clash with Tailwind's text-sm/xl/...).
      fontSize: {
        "headline-xl": ["40px", { lineHeight: "48px", letterSpacing: "-0.025em" }],
        "headline-xl-mobile": ["28px", { lineHeight: "36px", letterSpacing: "-0.02em" }],
        "headline-md": ["24px", { lineHeight: "32px", letterSpacing: "-0.015em" }],
        "headline-sm": ["18px", { lineHeight: "26px", letterSpacing: "-0.01em" }],
        "body-md": ["15px", { lineHeight: "24px" }],
        "body-sm": ["13px", { lineHeight: "20px" }],
        "label-md": ["13px", { lineHeight: "18px", letterSpacing: "0.02em" }],
        "label-sm": ["11px", { lineHeight: "16px", letterSpacing: "0.04em" }],
      },
      borderRadius: {
        card: "1.5rem",
        panel: "2rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(18, 59, 122, 0.06), 0 6px 20px -12px rgba(18, 59, 122, 0.25)",
        ambient: "0 10px 30px -10px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.04)",
        float: "0 1px 8px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
