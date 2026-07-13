import * as React from "react";
import { cn } from "@/lib/utils";
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-xl border-2 border-line bg-surface px-3.5 py-2.5 text-sm font-semibold outline-none transition-colors focus:border-amber-brand placeholder:text-muted-fg",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
