import { cn } from "@/lib/utils";

export function JoviaMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#3b2364] to-[#16032f] ring-1 ring-[#FFD700]/40 shadow-[0_10px_30px_-12px_rgba(255,215,0,0.4)]",
        className
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6">
        <defs>
          <linearGradient id="jovia-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFE566" />
            <stop offset="100%" stopColor="#FFC400" />
          </linearGradient>
        </defs>
        <path
          d="M13.5 2 6 13.2h4.6L9.4 22 18 10.4h-4.9L13.5 2Z"
          fill="url(#jovia-gold)"
        />
      </svg>
      <span className="absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full bg-[#2EFF00] ring-2 ring-[#16032f]" />
    </span>
  );
}

export function JoviaLogo({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <JoviaMark />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-base font-extrabold tracking-wide text-white">
            JOVIA
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-[0.32em] text-[#FFD700]">
            Network
          </span>
        </span>
      )}
    </span>
  );
}
