import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[#FFD700] text-[#16032f]",
        secondary: "border-[#6B4FA1]/50 bg-[#6B4FA1]/15 text-[#E9E3F9]",
        success: "border-[#2EFF00]/40 bg-[#2EFF00]/10 text-[#2EFF00]",
        warning: "border-[#FF9F1C]/50 bg-[#FF9F1C]/10 text-[#FFB85C]",
        danger: "border-[#FF5C5C]/50 bg-[#FF5C5C]/10 text-[#FF8A8A]",
        outline: "border-[#6B4FA1]/60 text-[#E9E3F9]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
