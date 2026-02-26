import { createElement, type CSSProperties, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type RevealProps = {
  as?: ElementType;
  delayMs?: number;
  className?: string;
  children: ReactNode;
};

export function Reveal({ as = "div", delayMs = 0, className, children }: RevealProps) {
  return createElement(
    as,
    {
      className: cn("glb-reveal", className),
      style: { ["--reveal-delay" as "--reveal-delay"]: `${delayMs}ms` } as CSSProperties
    },
    children
  );
}
