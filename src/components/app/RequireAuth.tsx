import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation();
  const viewer = useQuery(api.users.me, {});

  if (viewer === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-[#6B4FA1]/40 border-t-[#FFD700]" />
          <p className="text-sm text-[#B9A6E8]">Loading your Jovia account…</p>
        </div>
      </div>
    );
  }

  if (viewer === null) {
    const returnTo = `${location.pathname}${location.search}`;
    return <Navigate to={`/auth?returnTo=${encodeURIComponent(returnTo)}`} replace />;
  }

  return <>{children}</>;
}
