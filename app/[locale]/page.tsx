import Navigation from "@/components/sections/Navigation";
import Hero from "@/components/sections/Hero";
import Solutions from "@/components/sections/Solutions";
import Capabilities from "@/components/sections/Capabilities";
import Pricing from "@/components/sections/Pricing";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import { ThreeBackground } from "@/components/effects/ThreeBackground";
import MouseGlow from "@/components/effects/MouseGlow";
import NoiseOverlay from "@/components/effects/NoiseOverlay";

export default function Home() {
  return (
    <main className="min-h-screen relative selection:bg-blue-500/30 selection:text-white">
      <NoiseOverlay />
      <ThreeBackground />
      <MouseGlow />
      <Navigation />
      <Hero />
      <Solutions />
      <Capabilities />
      <Pricing />
      <Contact />
      <Footer />
    </main>
  );
}
