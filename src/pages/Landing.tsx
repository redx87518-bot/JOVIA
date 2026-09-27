import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HeroBanners } from "@/components/landing/HeroBanners";
import { HomeVideo } from "@/components/landing/HomeVideo";
import { Stats } from "@/components/landing/Stats";
import { VideoShowcase } from "@/components/landing/VideoShowcase";
import { Features } from "@/components/landing/Features";
import { About } from "@/components/landing/About";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Pricing } from "@/components/landing/Pricing";
import { Faq } from "@/components/landing/Faq";
import { Credibility } from "@/components/landing/Credibility";
import { Footer } from "@/components/landing/Footer";
import { useStore } from "@/lib/store-context";

const BANNERS = [
  {
    title: "Jovia Is Registered and Recognized",
    body: "JOVIA is officially registered with the Corporate Affairs Commission (CAC), establishing our business as a legally registered entity.",
    cta: "Join us now",
    href: "/auth?mode=signup",
    from: "#2D1B4E",
    to: "#16032f",
    accent: "#FFD700",
    emoji: "🛡️",
    tag: "CAC Registered",
  },
  {
    title: "Listen to Music & Earn Rewards",
    body: "Jovia partners with singers, artists, producers and music creators — earn up to ₦2,300 for every 60-second listening session.",
    cta: "Join us now",
    href: "/auth?mode=signup",
    from: "#3b2364",
    to: "#1c0b38",
    accent: "#1DB954",
    emoji: "🎧",
    tag: "Spotify · Audiomack · Boomplay",
  },
  {
    title: "Meta Activities",
    body: "Earn on WhatsApp, Facebook & Instagram — share posts, like content and link accounts to earn extra.",
    cta: "Join us now",
    href: "/auth?mode=signup",
    from: "#1c0b38",
    to: "#16032f",
    accent: "#2EFF00",
    emoji: "🌐",
    tag: "Social earning",
  },
];

export default function Landing() {
  const { stats } = useStore();
  const [bannerIndex, setBannerIndex] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setBannerIndex((i) => (i + 1) % BANNERS.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const banner = BANNERS[bannerIndex];

  return (
    <div className="min-h-screen overflow-x-clip">
      <Navbar />
      <main className="overflow-x-clip">
        <Hero />

        {/* Rotating hero banners */}
        <HeroBanners
          banner={banner}
          index={bannerIndex}
          count={BANNERS.length}
          onSelect={setBannerIndex}
        />

        {/* Home page video */}
        <HomeVideo
          open={videoOpen}
          onOpen={() => setVideoOpen(true)}
          onClose={() => setVideoOpen(false)}
        />

        <Stats
          registeredUsers={stats.registeredUsers}
          rewarded={stats.rewarded}
          paidOutKobo={stats.paidOutKobo}
        />
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

export { BANNERS };
