import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-2xl border border-[#6B4FA1]/40 bg-[#16032f]/70 px-4 py-2 text-sm text-white placeholder:text-[#8f80b8] transition-all focus-visible:outline-none focus-visible:border-[#FFD700] focus-visible:shadow-[0_0_0_3px_rgba(255,215,0,0.14)] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
