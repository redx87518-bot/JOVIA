import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useStore } from "@/lib/store-context";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { user } = useStore();

  if (user === null) {
    const returnTo = `${location.pathname}${location.search}`;
    return <Navigate to={`/auth?returnTo=${encodeURIComponent(returnTo)}`} replace />;
  }

  return <>{children}</>;
}
