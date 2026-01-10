import Navigation from "@/components/sections/Navigation";
import Hero from "@/components/sections/Hero";
import Solutions from "@/components/sections/Solutions";
import Capabilities from "@/components/sections/Capabilities";
import Pricing from "@/components/sections/Pricing";
import { ContactWrapper } from "@/components/sections/ContactWrapper";
import Footer from "@/components/sections/Footer";
import { ThreeBackgroundWrapper } from "@/components/effects/ThreeBackgroundWrapper";
import { EffectsWrapper } from "@/components/effects/EffectsWrapper";

export default function Home() {
  return (
    <main className="min-h-screen relative selection:bg-blue-500/30 selection:text-white">
      <EffectsWrapper />
      <ThreeBackgroundWrapper />
      <Navigation />
      <Hero />
      <Solutions />
      <Capabilities />
      <Pricing />
      <ContactWrapper />
      <Footer />
    </main>
  );
}
