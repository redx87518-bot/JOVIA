import { cn } from "@/lib/utils";

/**
 * Renders an activity's official icon image. Falls back to the activity emoji
 * if the image fails to load (offline dev server, etc.).
 */
export function ActivityImage({
  src,
  emoji,
  alt,
  className,
}: {
  src: string;
  emoji: string;
  alt: string;
  className?: string;
}) {
  return (
    <span className={cn("relative block overflow-hidden", className)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        draggable={false}
        className="h-full w-full object-cover"
        onError={(e) => {
          const el = e.currentTarget;
          if (el.dataset.fellback) return;
          el.dataset.fellback = "1";
          const parent = el.parentElement;
          if (parent) {
            el.remove();
            parent.textContent = emoji;
          }
        }}
      />
    </span>
  );
}
