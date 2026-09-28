import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Banner {
  title: string;
  body: string;
  cta: string;
  href: string;
  from: string;
  to: string;
  accent: string;
  image: string;
  tag: string;
}

interface HeroBannersProps {
  banner: Banner;
  index: number;
  count: number;
  onSelect: (index: number) => void;
}

export function HeroBanners({ banner, index, count, onSelect }: HeroBannersProps) {
  return (
    <section aria-label="Featured campaigns" className="container pb-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={banner.title}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-3xl p-7 sm:p-10"
          style={{ background: `linear-gradient(135deg, ${banner.from}, ${banner.to})` }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl"
            style={{ background: `${banner.accent}22` }}
          />
          <div className="relative flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between md:gap-8">
            <div className="max-w-2xl">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em]"
                style={{ background: `${banner.accent}1f`, color: banner.accent }}
              >
                {banner.tag}
              </span>
              <h2 className="mt-3 font-display text-2xl font-extrabold leading-tight text-white sm:text-4xl">
                {banner.title}
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-[#CFC4EC] sm:text-base">
                {banner.body}
              </p>
            </div>
            <div className="flex w-full items-center justify-between gap-4 md:w-auto">
              <Link to={banner.href} className="shrink-0">
                <span className="btn-gold inline-flex items-center gap-2">
                  {banner.cta} <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
              {/* Extracted campaign image from joviapltform.site */}
              <div
                className="relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/20 sm:h-24 sm:w-36 md:h-32 md:w-44 lg:h-36 lg:w-52"
                style={{ background: banner.to }}
              >
                <img
                  src={banner.image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  draggable={false}
                  className="h-full w-full object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(120deg, ${banner.from}80, transparent 45%)`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Carousel dots */}
          <div className="relative mt-6 flex gap-2">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onSelect(i)}
                aria-label={`Show banner ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-8" : "w-3 opacity-50"
                )}
                style={{ background: i === index ? banner.accent : "#6B4FA1" }}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
