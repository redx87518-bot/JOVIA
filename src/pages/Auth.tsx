import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Loader2, Lock, Mail, User } from "lucide-react";
import { api } from "../convex/_generated/api";
import { JoviaLogo } from "@/components/JoviaLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Mode = "signin" | "signup";
type Plan = "silver" | "gold";

function returnTarget(params: URLSearchParams): string {
  const target = params.get("returnTo");
  if (target && target.startsWith("/app")) return target;
  return "/app";
}

export default function Auth() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { signIn } = useAuthActions();
  const trackSignup = useMutation(api.activities.trackSignup);

  const viewer = useQuery(api.users.me, {});

  const initialMode: Mode = params.get("mode") === "signup" ? "signup" : "signin";
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [plan, setPlan] = useState<Plan | null>(
    (params.get("plan") as Plan | null) ?? null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Already signed in? Go straight to the app.
  useEffect(() => {
    if (viewer !== undefined && viewer !== null) {
      navigate(returnTarget(params), { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewer]);

  const isSignup = mode === "signup";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn("password", {
        flow: isSignup ? "signUp" : "signIn",
        ...(isSignup ? { name } : {}),
        email,
        password,
      });
      if (isSignup) {
        await trackSignup({}).catch(() => undefined);
      }
      toast.success(
        isSignup
          ? `Welcome to Jovia${name ? `, ${name.split(" ")[0]}` : ""}!`
          : "Welcome back!"
      );
      navigate(returnTarget(params), { replace: true });
    } catch (err) {
      const raw = err instanceof Error ? err.message : "";
      setError(
        raw.toLowerCase().includes("invalid") || raw.toLowerCase().includes("account")
          ? "Invalid email or password."
          : raw || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-[480px] w-[760px] -translate-x-1/2 rounded-full bg-[#6B4FA1]/25 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(185,166,232,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(185,166,232,0.4) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-6 flex justify-center">
          <Link to="/" aria-label="Jovia Network home">
            <JoviaLogo />
          </Link>
        </div>

        <div className="jovia-card p-7 sm:p-8">
          <h1 className="text-center font-display text-2xl font-bold text-white">
            {isSignup ? "Create your Jovia account" : "Login to your account"}
          </h1>
          <p className="mt-1.5 text-center text-sm text-[#B9A6E8]">
            {isSignup
              ? "Join the network — watch, play, connect and earn."
              : "Welcome back. Continue earning where you left off."}
          </p>

          {isSignup && (
            <div className="mt-5 flex justify-center gap-2">
              {(["silver", "gold"] as Plan[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlan(p)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-xs font-bold transition-all",
                    plan === p
                      ? "border-[#FFD700] bg-[#FFD700]/15 text-[#FFD700]"
                      : "border-[#6B4FA1]/40 text-[#B9A6E8] hover:border-[#FFD700]/40"
                  )}
                >
                  {p === "silver" ? "Silver · ₦9,000" : "Gold · ₦15,000"}
                </button>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.22 }}
            >
              <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4" noValidate>
                {isSignup && (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="name">Full name</Label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f80b8]" />
                      <Input
                        id="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Abdulgafar Adeyemi"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f80b8]" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f80b8]" />
                    <Input
                      id="password"
                      type="password"
                      autoComplete={isSignup ? "new-password" : "current-password"}
                      required
                      minLength={8}
                      placeholder={isSignup ? "At least 8 characters" : "Your password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {error && (
                  <p
                    role="alert"
                    className="rounded-xl border border-[#FF5C5C]/40 bg-[#FF5C5C]/10 px-4 py-2.5 text-xs font-medium text-[#FF8A8A]"
                  >
                    {error}
                  </p>
                )}

                <Button type="submit" size="lg" className="mt-1 w-full gap-2" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {isSignup ? "Creating account…" : "Signing in…"}
                    </>
                  ) : (
                    <>
                      {isSignup ? "Create account" : "Login to account"}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 text-center text-sm text-[#B9A6E8]">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="font-semibold text-[#FFD700] hover:underline"
                >
                  Login to account
                </button>
              </>
            ) : (
              <>
                New to Jovia?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="font-semibold text-[#FFD700] hover:underline"
                >
                  Create your account
                </button>
              </>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#8f80b8]">
          Silver ₦9,000 · Gold ₦15,000 · Registered with Nigeria's CAC
        </p>
      </motion.div>
    </div>
  );
}
