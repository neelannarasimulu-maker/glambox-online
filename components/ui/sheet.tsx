import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/cn";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

export const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-slate-950/40" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed right-0 top-0 z-50 flex h-full w-80 flex-col gap-6 bg-[var(--card)] p-6 shadow-xl",
        className
      )}
      {...props}
    />
  </DialogPrimitive.Portal>
));
SheetContent.displayName = "SheetContent";
