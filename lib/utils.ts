import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Register the custom font sizes from tailwind.config.ts; otherwise twMerge reads
// e.g. `text-label-md` as a text colour and drops it next to `text-primary`.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["headline-xl", "headline-xl-mobile", "headline-md", "headline-sm", "body-md", "body-sm", "label-md", "label-sm"] },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
