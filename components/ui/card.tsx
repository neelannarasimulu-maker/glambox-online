import * as React from "react";
import { cn } from "@/lib/cn";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  accent?: boolean;
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, accent = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "group relative rounded-[var(--radius)] border border-[color-mix(in_srgb,var(--border)_74%,white)] bg-[color-mix(in_srgb,var(--card)_94%,white)] shadow-[var(--shadow-soft)] backdrop-blur-[2px] transition duration-500 hover:-translate-y-1.5 hover:shadow-[var(--shadow)]",
        accent &&
          "overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-1.5 before:bg-gradient-to-r before:from-[var(--primary)] before:via-[var(--accent)] before:to-[var(--secondary)] after:pointer-events-none after:absolute after:inset-0 after:bg-[radial-gradient(80%_60%_at_100%_0%,color-mix(in_srgb,var(--accent)_10%,transparent)_0%,transparent_70%)]",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-2 p-6", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-xl font-semibold tracking-[-0.01em] text-[var(--fg)]", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm leading-6 text-[var(--muted-foreground)]", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";
