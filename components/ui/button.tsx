import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-2xl font-extrabold transition-all disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-amber-brand cursor-pointer",
  {
    variants: {
      variant: {
        amber: "bg-amber-brand text-ink shadow-[0_8px_22px_rgba(245,165,10,.35)] hover:bg-amber-deep hover:-translate-y-0.5",
        ghost: "border-2 border-current hover:bg-ink hover:text-cream dark:hover:bg-cream dark:hover:text-ink",
        wa: "bg-wa text-white shadow-[0_8px_22px_rgba(31,174,83,.35)] hover:brightness-95 hover:-translate-y-0.5",
        soft: "card-surface hover:border-amber-brand",
        dark: "bg-ink text-cream hover:opacity-90",
      },
      size: {
        default: "px-5 py-3 text-sm",
        sm: "px-3.5 py-2 text-xs rounded-xl",
        lg: "px-7 py-4 text-base",
        icon: "size-10 rounded-xl",
      },
    },
    defaultVariants: { variant: "amber", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";
export { buttonVariants };
