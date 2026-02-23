import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/cn";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  asChild?: boolean;
};

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-[var(--primary)] text-[var(--on-primary)] shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:brightness-110",
  secondary:
    "bg-[var(--secondary)] text-[var(--on-secondary)] shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:brightness-110",
  outline:
    "border border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_88%,transparent)] text-[var(--fg)] hover:bg-[var(--muted)]",
  ghost: "text-[var(--fg)] hover:bg-[var(--muted)]"
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot : "button";
    return (
      <Component
        ref={ref}
        className={cn(
          "inline-flex min-h-10 items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold tracking-[0.01em] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
