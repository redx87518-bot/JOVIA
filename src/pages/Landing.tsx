import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Stats } from "@/components/landing/Stats";
import { VideoShowcase } from "@/components/landing/VideoShowcase";
import { Features } from "@/components/landing/Features";
import { About } from "@/components/landing/About";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Pricing } from "@/components/landing/Pricing";
import { Faq } from "@/components/landing/Faq";
import { Credibility } from "@/components/landing/Credibility";
import { Footer } from "@/components/landing/Footer";

export default function Landing() {
  const seedIfEmpty = useMutation(api.activities.seedIfEmpty);

  useEffect(() => {
    seedIfEmpty({}).catch(() => {
      // Seeding is best-effort; the landing page works without it.
    });
  }, [seedIfEmpty]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <VideoShowcase />
        <Features />
        <About />
        <HowItWorks />
        <Pricing />
        <Faq />
        <Credibility />
      </main>
      <Footer />
    </div>
  );
}
