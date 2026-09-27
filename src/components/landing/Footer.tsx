import { Link } from "react-router-dom";
import { ExternalLink, MessageCircle } from "lucide-react";
import { JoviaLogo } from "@/components/JoviaLogo";

const EXPLORE = [
  { label: "Videos", href: "#videos" },
  { label: "Features", href: "#features" },
  { label: "Packages", href: "#packages" },
  { label: "FAQ", href: "#faq" },
];

export function Footer() {
  return (
    <footer className="relative mt-8 border-t border-[#6B4FA1]/25 bg-[#0d0413]/80">
      <div className="container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4 lg:col-span-1">
          <JoviaLogo />
          <p className="max-w-xs text-sm leading-relaxed text-[#B9A6E8]">
            Watch, play, connect and earn. Nigeria's entertainment monetization network —
            registered with the CAC.
          </p>
        </div>

        <nav aria-label="Explore">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#FFD700]">
            Explore
          </p>
          <ul className="flex flex-col gap-2.5">
            {EXPLORE.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="text-sm text-[#CFC4EC] transition-colors hover:text-[#FFD700]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Account">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#FFD700]">
            Account
          </p>
          <ul className="flex flex-col gap-2.5">
            <li>
              <Link
                to="/auth?mode=signup"
                className="text-sm text-[#CFC4EC] transition-colors hover:text-[#FFD700]"
              >
                Register Jovia
              </Link>
            </li>
            <li>
              <Link
                to="/auth"
                className="text-sm text-[#CFC4EC] transition-colors hover:text-[#FFD700]"
              >
                Login
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Legal">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#FFD700]">
            Legal
          </p>
          <ul className="flex flex-col gap-2.5">
            <li>
              <Link to="/privacy" className="text-sm text-[#CFC4EC] transition-colors hover:text-[#FFD700]">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="text-sm text-[#CFC4EC] transition-colors hover:text-[#FFD700]">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-[#6B4FA1]/20">
        <div className="container flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-[#8f80b8]">
              © 2026 Jovia Network. All rights reserved. · Developed by{" "}
              <span className="font-semibold text-[#B9A6E8]">DAG Group</span>
            </p>
            <p className="flex items-center gap-1.5 text-xs text-[#8f80b8]">
              Need a platform like this? Message us on WhatsApp
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: "+234 904 862 5847", num: "2349048625847" },
              { label: "+234 802 059 0801", num: "2348020590801" },
            ].map((w) => (
              <a
                key={w.num}
                href={`https://wa.me/${w.num}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-3.5 py-2 text-xs font-semibold text-[#4ceb85] transition-colors hover:bg-[#25D366]/20"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                {w.label}
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
