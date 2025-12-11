import Navigation from "@/components/sections/Navigation";
import Hero from "@/components/sections/Hero";
import Solutions from "@/components/sections/Solutions";
import ProcessProtocol from "@/components/sections/ProcessProtocol";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import About from "@/components/sections/About";
import Testimonials from "@/components/sections/Testimonials";
import Clients from "@/components/sections/Clients";
import Contact from "@/components/sections/Contact";
import Starfield from "@/components/effects/Starfield";
import MouseGlow from "@/components/effects/MouseGlow";
import NoiseOverlay from "@/components/effects/NoiseOverlay";

export default function Home() {
  return (
    <main className="min-h-screen relative selection:bg-blue-500/30 selection:text-white">
      <NoiseOverlay />
      <Starfield />
      <MouseGlow />
      <Navigation />
      <Hero />
      <Solutions />
      <ProcessProtocol />
      <About />
      <Testimonials />
      <Clients />
      <CTA />
      <Contact />
      <Footer />
    </main>
  );
}
