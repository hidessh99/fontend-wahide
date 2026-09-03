"use client";

import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SearchInputProps {
  value?: string;
  onChange?: (val: string) => void;
  onSearch: (val: string) => void;
  onClear: () => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  buttonText?: string;
  autoFocus?: boolean;
}

/**
 * Reusable Unified Search Input Component with Auto-Clear Button and Search Action
 */
export function SearchInput({
  value: externalValue,
  onChange,
  onSearch,
  onClear,
  placeholder = "Cari data...",
  className,
  inputClassName,
  disabled = false,
  buttonText = "Cari",
  autoFocus = false,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(externalValue ?? "");

  useEffect(() => {
    if (externalValue !== undefined) {
      setInternalValue(externalValue);
    }
  }, [externalValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalValue(val);
    onChange?.(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(internalValue);
  };

  const handleClear = () => {
    setInternalValue("");
    onChange?.("");
    onClear();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-1 items-center gap-2", className)}
    >
      <div className="relative flex-1">
        <Search className="text-foreground-muted pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
        <input
          type="text"
          value={internalValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          className={cn(
            "bg-surface text-foreground border-border hover:border-foreground-muted placeholder:text-muted-foreground h-10 w-full rounded-full border pr-9 pl-10 text-xs font-semibold outline-none transition focus:border-emerald-600 disabled:opacity-50 dark:bg-[#10110e] dark:focus:border-emerald-500",
            inputClassName
          )}
        />
        {internalValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="text-foreground-muted hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer p-0.5 transition"
            aria-label="Hapus Pencarian"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      <Button
        type="submit"
        variant="primaryPill"
        size="sm"
        disabled={disabled}
        className="h-10 shrink-0 cursor-pointer px-4 text-xs font-bold shadow-xs"
      >
        <Search className="mr-1 size-3.5" />
        <span>{buttonText}</span>
      </Button>
    </form>
  );
}
