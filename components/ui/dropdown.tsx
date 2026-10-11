"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DropdownOption<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  /** Id of the trigger, so a <label htmlFor> focuses it. */
  id: string;
  /** Id of the visible label; gives the combobox its accessible name. */
  labelledBy: string;
  value: T | "";
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Styled single-select following the WAI-ARIA "select-only combobox" pattern.
 * Focus stays on the trigger; the highlighted option is exposed through
 * aria-activedescendant. Keys: Arrow Up/Down, Home/End, Enter/Space to choose,
 * Escape to close, Tab to leave, and typing to jump to an option.
 */
export function Dropdown<T extends string>({ id, labelledBy, value, options, onChange, placeholder, className }: Props<T>) {
  const listId = useId();
  const root = useRef<HTMLDivElement>(null);
  const typeahead = useRef({ text: "", timer: undefined as ReturnType<typeof setTimeout> | undefined });
  const [open, setOpen] = useState(false);
  const selectedIndex = options.findIndex((o) => o.value === value);
  const [active, setActive] = useState(Math.max(0, selectedIndex));
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;
  const optionId = (i: number) => `${listId}-opt-${i}`;

  // Close when pointing anywhere outside the component.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Keep the highlighted option visible in long lists.
  useEffect(() => {
    if (open) document.getElementById(optionId(active))?.scrollIntoView({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, active]);

  useEffect(() => () => clearTimeout(typeahead.current.timer), []);

  const openAt = (index: number) => {
    setActive(Math.min(Math.max(index, 0), options.length - 1));
    setOpen(true);
  };

  const choose = (index: number) => {
    const option = options[index];
    if (option) onChange(option.value);
    setOpen(false);
  };

  const jumpTo = (char: string) => {
    const t = typeahead.current;
    clearTimeout(t.timer);
    t.text += char.toLowerCase();
    t.timer = setTimeout(() => (t.text = ""), 500);
    const start = open ? active + 1 : Math.max(0, selectedIndex);
    const ordered = [...options.slice(start), ...options.slice(0, start)];
    const match = ordered.find((o) => o.label.toLowerCase().startsWith(t.text));
    if (match) openAt(options.indexOf(match));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = options.length - 1;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) openAt(selectedIndex >= 0 ? selectedIndex : 0);
        else if (!e.altKey) setActive((i) => Math.min(i + 1, last));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (open && e.altKey) choose(active);
        else if (!open) openAt(selectedIndex >= 0 ? selectedIndex : 0);
        else setActive((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        openAt(0);
        break;
      case "End":
        e.preventDefault();
        openAt(last);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (open) choose(active);
        else openAt(selectedIndex >= 0 ? selectedIndex : 0);
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          setOpen(false);
        }
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) jumpTo(e.key);
    }
  };

  return (
    <div ref={root} className="relative">
      <button
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${labelledBy} ${id}`}
        aria-activedescendant={open ? optionId(active) : undefined}
        onClick={() => (open ? setOpen(false) : openAt(selectedIndex >= 0 ? selectedIndex : 0))}
        onKeyDown={onKeyDown}
        onBlur={(e) => {
          if (!root.current?.contains(e.relatedTarget as Node)) setOpen(false);
        }}
        className={cn(
          "flex h-12 w-full items-center justify-between gap-3 rounded-xl border px-4 text-left text-sm font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
          open
            ? "border-primary bg-white text-primary"
            : "border-[#DCD9D1] bg-[#FAFAF8] text-ink hover:border-[#C4BFB5] focus-visible:border-primary focus-visible:bg-white",
          className,
        )}
      >
        <span className={cn("truncate", !selected && "font-medium text-[#696763]")}>{selected?.label ?? placeholder}</span>
        <ChevronDown
          aria-hidden
          className={cn("h-4 w-4 shrink-0 transition-transform", open ? "rotate-180 text-primary" : "text-[#696763]")}
        />
      </button>

      <ul
        id={listId}
        role="listbox"
        aria-labelledby={labelledBy}
        hidden={!open}
        className="absolute inset-x-0 top-full z-30 mt-2 max-h-72 space-y-0.5 overflow-y-auto rounded-2xl border border-[#C4BFB5] bg-white p-2 shadow-[0_12px_32px_-8px_rgba(20,20,19,0.18)]"
      >
        {options.map((option, i) => {
          const isSelected = option.value === value;
          return (
            <li
              key={option.value}
              id={optionId(i)}
              role="option"
              aria-selected={isSelected}
              // Keep focus on the trigger while clicking.
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(i)}
              className={cn(
                "flex min-h-[44px] cursor-pointer items-center justify-between gap-3 rounded-xl px-4 text-sm font-bold transition-colors",
                isSelected ? "bg-primary-soft text-primary" : "text-[#5A5A5A]",
                i === active && !isSelected && "bg-canvas-low text-ink",
              )}
            >
              <span>{option.label}</span>
              {isSelected && <Check aria-hidden className="h-4 w-4 shrink-0" />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
