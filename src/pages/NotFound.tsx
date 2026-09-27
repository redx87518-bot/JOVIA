import { Link } from "react-router-dom";
import { Home, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JoviaLogo } from "@/components/JoviaLogo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <JoviaLogo />
      <p className="font-display text-7xl font-extrabold text-gradient-gold">404</p>
      <h1 className="font-display text-xl font-bold text-white">Page not found</h1>
      <p className="max-w-sm text-sm text-[#B9A6E8]">
        The page you're looking for doesn't exist or has moved. Head back to the Jovia
        Network homepage to continue.
      </p>
      <div className="flex gap-3">
        <Link to="/">
          <Button variant="secondary" className="gap-2">
            <Home className="h-4 w-4" /> Home
          </Button>
        </Link>
        <Link to="/auth">
          <Button className="gap-2">
            <LogIn className="h-4 w-4" /> Login
          </Button>
        </Link>
      </div>
    </div>
  );
}
