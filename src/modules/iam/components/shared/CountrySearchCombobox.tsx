"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Globe, ChevronDown, Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { COUNTRIES, type CountryCodeItem } from "@/lib/countryCodes";
import { useI18n } from "@/lib/i18n/context";

interface CountrySearchComboboxProps {
  value: string; // country name, e.g. "Indonesia"
  onChange: (countryName: string) => void;
  required?: boolean;
}

export function CountrySearchCombobox({
  value,
  onChange,
  required,
}: CountrySearchComboboxProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Resolve selected country object from current value
  const selectedCountry: CountryCodeItem | undefined = useMemo(
    () =>
      COUNTRIES.find(
        (c) =>
          c.name.toLowerCase() === (value || "Indonesia").toLowerCase() ||
          c.code.toUpperCase() === (value || "").toUpperCase(),
      ) ?? COUNTRIES[0],
    [value],
  );

  // Filter countries by search query
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.nameId.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q),
    );
  }, [search]);

  // Reset focused index when filtered list changes
  useEffect(() => {
    setFocusedIndex(-1);
  }, [filtered]);

  // Auto-focus search when popover opens
  useEffect(() => {
    if (open) {
      setSearch("");
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSelect = (country: CountryCodeItem) => {
    onChange(country.name);
    setOpen(false);
    setSearch("");
    setFocusedIndex(-1);
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (focusedIndex >= 0 && filtered[focusedIndex]) {
        handleSelect(filtered[focusedIndex]);
      } else if (filtered.length === 1) {
        handleSelect(filtered[0]);
      }
    }
  };

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex < 0 || !listRef.current) return;
    const item = listRef.current.children[focusedIndex] as
      HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [focusedIndex]);

  return (
    <div ref={containerRef} className="relative">
      {/* Hidden input for HTML form required validation */}
      {required && (
        <input
          type="text"
          tabIndex={-1}
          required
          value={selectedCountry?.name ?? ""}
          onChange={() => {}}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-0 w-0 opacity-0"
        />
      )}

      {/* Trigger button */}
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls="country-search-listbox"
        aria-haspopup="listbox"
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          "bg-surface text-foreground border-border hover:border-foreground-muted",
          "flex h-11 w-full cursor-pointer items-center gap-2.5 rounded-xl border px-3.5",
          "text-xs font-semibold transition",
          "focus:border-wise-green focus:ring-wise-green focus:ring-2 focus:outline-none",
          open && "border-wise-green ring-wise-green ring-2",
          "dark:bg-[#10110e]",
        )}
      >
        {/* Leading globe icon */}
        <Globe className="text-foreground-muted size-4 shrink-0" />

        {/* Selected value */}
        <span className="flex min-w-0 flex-1 items-center gap-2 text-left">
          <span className="text-base leading-none" aria-hidden="true">
            {selectedCountry?.flag}
          </span>
          <span className="truncate">
            {selectedCountry?.name ?? t("address.selectCountry")}
          </span>
          <span className="text-foreground-muted font-mono text-[11px]">
            ({selectedCountry?.code})
          </span>
        </span>

        {/* Trailing chevron */}
        <ChevronDown
          className={cn(
            "text-foreground-muted size-4 shrink-0 transition-transform duration-150",
            open && "rotate-180",
          )}
        />
      </button>

      {/* Popover */}
      {open && (
        <div
          className={cn(
            "border-border bg-surface animate-in fade-in-0 zoom-in-95 absolute top-full left-0 z-50 mt-1.5",
            "w-full min-w-65 rounded-xl border shadow-lg",
            "dark:bg-[#10110e]",
          )}
          role="dialog"
          aria-label={t("address.selectCountry")}
        >
          {/* Search input */}
          <div className="border-border border-b p-2">
            <div className="relative">
              <Search className="text-foreground-muted pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder={t("address.searchCountry")}
                className={cn(
                  "bg-muted/40 text-foreground placeholder:text-foreground-muted",
                  "border-border focus:border-wise-green focus:ring-wise-green",
                  "h-8 w-full rounded-lg border pr-3 pl-8 text-xs font-medium",
                  "outline-none transition focus:ring-2 dark:bg-[#16180f]",
                )}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Country list */}
          <ul
            id="country-search-listbox"
            ref={listRef}
            role="listbox"
            aria-label={t("address.selectCountry")}
            className="max-h-56 overflow-y-auto py-1"
          >
            {filtered.length === 0 ? (
              <li className="text-foreground-muted px-4 py-3 text-center text-xs">
                Negara tidak ditemukan
              </li>
            ) : (
              filtered.map((country, idx) => {
                const isSelected = selectedCountry?.code === country.code;
                const isFocused = focusedIndex === idx;

                return (
                  <li
                    key={country.code}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(country)}
                    className={cn(
                      "flex cursor-pointer items-center gap-2.5 px-3 py-2 text-xs transition",
                      isFocused
                        ? "bg-muted text-foreground"
                        : "hover:bg-muted/60",
                      isSelected &&
                        "text-wise-green dark:text-wise-green font-semibold",
                    )}
                  >
                    <span className="text-base leading-none" aria-hidden="true">
                      {country.flag}
                    </span>
                    <span className="min-w-0 flex-1 truncate">
                      {country.name}
                      {country.nameId !== country.name && (
                        <span className="text-foreground-muted ml-1 font-normal">
                          ({country.nameId})
                        </span>
                      )}
                    </span>
                    <span className="text-foreground-muted font-mono text-[10px]">
                      {country.code}
                    </span>
                    {isSelected && (
                      <Check className="text-wise-green size-3.5 shrink-0" />
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
