import { Route, Routes } from "react-router-dom";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import Legal from "@/pages/Legal";
import NotFound from "@/pages/NotFound";
import RequireAuth from "@/components/app/RequireAuth";
import AppShell from "@/components/app/AppShell";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/app/*"
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      />
      <Route path="/privacy" element={<Legal doc="privacy" />} />
      <Route path="/terms" element={<Legal doc="terms" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
