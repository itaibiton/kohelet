"use client";

import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";
import { EffectsWrapper } from "@/components/effects/EffectsWrapper";
import { ThreeBackgroundWrapper } from "@/components/effects/ThreeBackgroundWrapper";
import AboutHero from "@/components/sections/about/AboutHero";
import CompanyStory from "@/components/sections/about/CompanyStory";
import Stats from "@/components/sections/about/Stats";
import Values from "@/components/sections/about/Values";
import Team from "@/components/sections/about/Team";
import AboutCTA from "@/components/sections/about/AboutCTA";

export default function AboutPage() {
  return (
    <main className="min-h-screen relative selection:bg-blue-500/30 selection:text-white">
      <EffectsWrapper />
      <ThreeBackgroundWrapper />
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
