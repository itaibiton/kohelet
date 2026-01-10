"use client";

import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/effects/NoiseOverlay";
import { ThreeBackground } from "@/components/effects/ThreeBackground";
import MouseGlow from "@/components/effects/MouseGlow";
import AboutHero from "@/components/sections/about/AboutHero";
import CompanyStory from "@/components/sections/about/CompanyStory";
import Stats from "@/components/sections/about/Stats";
import Values from "@/components/sections/about/Values";
import Team from "@/components/sections/about/Team";
import AboutCTA from "@/components/sections/about/AboutCTA";

export default function AboutPage() {
  return (
    <main className="min-h-screen relative selection:bg-blue-500/30 selection:text-white">
      <NoiseOverlay />
      <ThreeBackground />
      <MouseGlow />
      <Navigation />
      <AboutHero />
      <CompanyStory />
      {/* <Stats /> */}
      <Values />
      {/* <Team /> */}
      <AboutCTA />
      <Footer />
    </main>
  );
}
