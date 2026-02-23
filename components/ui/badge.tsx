import * as React from "react";
import { cn } from "@/lib/cn";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "stone" | "pop";
};

const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  stone: "border border-[color-mix(in_srgb,var(--border)_74%,white)] bg-[var(--stone)] text-[var(--fg)]",
  pop: "bg-[var(--accent)] text-[var(--on-accent)] shadow-[var(--shadow-soft)]"
};

export function Badge({ className, variant = "stone", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em]",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
