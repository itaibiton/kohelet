import { ThreeBackground } from "@/components/effects/ThreeBackground";
import Navigation from "@/components/sections/Navigation";
import Hero from "@/components/sections/Hero";
import Solutions from "@/components/sections/Solutions";
import Capabilities from "@/components/sections/Capabilities";
import Pricing from "@/components/sections/Pricing";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="min-h-screen relative selection:bg-brand/30 selection:text-white">
      <ThreeBackground />
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
