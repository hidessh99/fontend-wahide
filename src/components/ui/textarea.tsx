import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const textareaVariants = cva(
  "w-full min-w-0 transition outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 disabled:bg-input/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 flex field-sizing-content min-h-16 rounded-lg border bg-transparent px-2.5 py-2 text-base focus-visible:ring-3 aria-invalid:ring-3 md:text-sm",
        rounded:
          "bg-surface text-foreground border-border hover:border-foreground-muted focus:border-wise-green focus:ring-wise-green min-h-20 rounded-xl border p-3.5 text-xs font-semibold focus:ring-2 dark:bg-[#10110e]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface TextareaProps
  extends React.ComponentProps<"textarea">,
    VariantProps<typeof textareaVariants> {
  isError?: boolean;
}

function Textarea({ className, variant, isError, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        textareaVariants({ variant }),
        isError && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/30",
        className
      )}
      {...props}
    />
  );
}

export { Textarea, textareaVariants };
