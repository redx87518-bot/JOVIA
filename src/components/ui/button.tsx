import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold font-display transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700]/60 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[#FFD700] text-[#16032f] shadow-[0_14px_34px_-14px_rgba(255,215,0,0.55)] hover:bg-[#FFE566] hover:-translate-y-px active:scale-[0.98]",
        secondary:
          "border border-[#6B4FA1]/50 bg-[#6B4FA1]/10 text-[#E9E3F9] hover:bg-[#6B4FA1]/25 hover:border-[#FFD700]/45",
        ghost: "text-[#E9E3F9] hover:bg-[#6B4FA1]/20",
        destructive: "bg-[#E5484D] text-white hover:bg-[#ff6369]",
        whatsapp:
          "bg-[#25D366] text-[#052e16] hover:bg-[#4ceb85] active:scale-[0.98]",
        outline:
          "border border-[#FFD700]/50 bg-transparent text-[#FFD700] hover:bg-[#FFD700]/10",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
