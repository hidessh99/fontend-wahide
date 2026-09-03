import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center font-semibold whitespace-nowrap transition-transform duration-150 ease-out outline-none select-none cursor-pointer disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Wise Signature Primary CTA (Lime Green + Dark Green Text + Scale Hover)
        primaryPill:
          "bg-wise-green text-dark-green rounded-full hover:scale-105 active:scale-95 hover:bg-pastel-green focus-visible:ring-2 focus-visible:ring-wise-green focus-visible:ring-offset-2",
        // Wise Subtle Secondary
        secondaryPill:
          "bg-[rgba(22,51,0,0.08)] dark:bg-[rgba(159,232,112,0.12)] text-near-black dark:text-foreground rounded-full hover:scale-105 active:scale-95 hover:bg-[rgba(22,51,0,0.14)] dark:hover:bg-[rgba(159,232,112,0.2)]",
        // Wise Outline Ring Pill
        outlinePill:
          "border border-[rgba(14,15,12,0.15)] dark:border-[rgba(251,252,249,0.15)] text-near-black dark:text-foreground rounded-full hover:scale-105 active:scale-95 hover:border-wise-green",
        // Destructive Danger Pill
        dangerPill:
          "bg-destructive text-white rounded-full hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-destructive",

        // Standard Variants with Wise Scale Feel
        default:
          "bg-wise-green text-dark-green rounded-full hover:scale-105 active:scale-95 hover:bg-pastel-green",
        outline:
          "border border-border bg-background hover:bg-muted text-foreground rounded-full hover:scale-105 active:scale-95",
        secondary:
          "bg-secondary text-secondary-foreground rounded-full hover:scale-105 active:scale-95",
        ghost: "hover:bg-muted hover:text-foreground rounded-full hover:scale-105 active:scale-95",
        destructive: "bg-destructive text-white rounded-full hover:scale-105 active:scale-95",
        link: "text-dark-green dark:text-wise-green underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 text-sm gap-2",
        xs: "h-7 px-3 text-xs gap-1",
        sm: "h-9 px-4 text-xs gap-1.5",
        lg: "h-13 px-8 text-base gap-2.5",
        xl: "h-15 px-10 text-lg gap-3",
        icon: "size-11 rounded-full",
        "icon-xs": "size-6 rounded-full [&_svg]:size-3",
        "icon-sm": "size-9 rounded-full",
        "icon-lg": "size-13 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primaryPill",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "primaryPill",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
