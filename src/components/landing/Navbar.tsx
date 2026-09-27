import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, LogIn, Menu, UserPlus, Wallet, X, ChevronDown } from "lucide-react";
import { JoviaLogo } from "@/components/JoviaLogo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EXPLORE = [
  { label: "Videos", href: "#videos" },
  { label: "Features", href: "#features" },
  { label: "Packages", href: "#packages" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled ? "glass shadow-[0_18px_50px_-30px_rgba(0,0,0,0.9)]" : "bg-transparent"
        )}
      >
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link to="/" aria-label="Jovia Network home" className="shrink-0">
            <JoviaLogo />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Explore">
            {EXPLORE.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-[#CFC4EC] transition-colors hover:bg-[#6B4FA1]/20 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link to="/app">
              <Button variant="ghost" size="sm" className="gap-1.5 px-2.5 lg:px-4">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden lg:inline">Dashboard</span>
              </Button>
            </Link>
            <Link to="/app?tab=wallet">
              <Button variant="ghost" size="sm" className="gap-1.5 px-2.5 lg:px-4">
                <Wallet className="h-4 w-4" />
                <span className="hidden lg:inline">Activate</span>
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="secondary" size="sm" className="gap-1.5 px-2.5 lg:px-4">
                <LogIn className="h-4 w-4" />
                <span className="hidden lg:inline">Login to account</span>
              </Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button size="sm" className="gap-1.5 px-3 lg:px-4">
                <UserPlus className="h-4 w-4 lg:hidden" />
                <span className="hidden lg:inline">Create your account</span>
                <span className="lg:hidden">Sign up</span>
              </Button>
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#6B4FA1]/40 text-white md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 260 }}
              className="fixed inset-y-0 right-0 z-[70] flex w-[86%] max-w-sm flex-col gap-6 overflow-y-auto border-l border-[#6B4FA1]/30 bg-[#16032f]/95 p-6 backdrop-blur-xl"
              aria-label="Mobile navigation"
            >
              <div className="flex items-center justify-between">
                <JoviaLogo />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#6B4FA1]/40 text-white"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FFD700]">
                  Explore
                </p>
                <div className="flex flex-col">
                  {EXPLORE.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-[#E9E3F9] hover:bg-[#6B4FA1]/20"
                    >
                      {item.label}
                      <ChevronDown className="h-4 w-4 -rotate-90 text-[#8f80b8]" />
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FFD700]">
                  Account
                </p>
                <div className="flex flex-col gap-2">
                  <Link to="/app" onClick={() => setOpen(false)}>
                    <Button variant="secondary" className="w-full justify-start gap-2">
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Button>
                  </Link>
                  <Link to="/app?tab=wallet" onClick={() => setOpen(false)}>
                    <Button variant="secondary" className="w-full justify-start gap-2">
                      <Wallet className="h-4 w-4" /> Activate
                    </Button>
                  </Link>
                  <Link to="/auth" onClick={() => setOpen(false)}>
                    <Button variant="secondary" className="w-full justify-start gap-2">
                      <LogIn className="h-4 w-4" /> Login to account
                    </Button>
                  </Link>
                  <Link to="/auth?mode=signup" onClick={() => setOpen(false)}>
                    <Button className="w-full justify-start gap-2">
                      <UserPlus className="h-4 w-4" /> Create your account
                    </Button>
                  </Link>
                </div>
              </div>

              <p className="mt-auto text-xs text-[#8f80b8]">
                © 2026 Jovia Network — registered with Nigeria's CAC.
              </p>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
