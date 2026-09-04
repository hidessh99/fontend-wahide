import * as React from "react";

import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

const nativeSelectVariants = cva(
  "w-full min-w-0 appearance-none transition outline-none select-none cursor-pointer disabled:pointer-events-none disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default:
          "border-input selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 h-8 rounded-lg border bg-transparent py-1 pr-8 pl-2.5 text-sm focus-visible:ring-3 aria-invalid:ring-3 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] data-[size=sm]:py-0.5",
        pill: "bg-surface text-foreground border-border hover:border-foreground-muted focus:border-emerald-600 dark:focus:border-wise-green h-10 rounded-full border pr-8 pl-3.5 text-xs font-semibold dark:bg-[#10110e]",
        rounded:
          "bg-surface text-foreground border-border hover:border-foreground-muted focus:border-emerald-600 dark:focus:border-wise-green h-10 rounded-xl border pr-8 pl-3.5 text-xs font-semibold dark:bg-[#10110e]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> &
  VariantProps<typeof nativeSelectVariants> & {
    size?: "sm" | "default";
    wrapperClassName?: string;
  };

function NativeSelect({
  className,
  wrapperClassName,
  variant = "default",
  size = "default",
  ...props
}: NativeSelectProps) {
  return (
    <div
      className={cn(
        "group/native-select relative w-fit has-[select:disabled]:opacity-50",
        wrapperClassName
      )}
      data-slot="native-select-wrapper"
      data-size={size}
    >
      <select
        data-slot="native-select"
        data-size={size}
        className={cn(nativeSelectVariants({ variant }), className)}
        {...props}
      />
      <ChevronDownIcon
        className={cn(
          "pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 select-none",
          variant === "pill" ? "text-foreground-muted size-3.5" : "text-muted-foreground size-4"
        )}
        aria-hidden="true"
        data-slot="native-select-icon"
      />
    </div>
  );
}

function NativeSelectOption({ className, ...props }: React.ComponentProps<"option">) {
  return (
    <option
      data-slot="native-select-option"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  );
}

function NativeSelectOptGroup({ className, ...props }: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  );
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption };
