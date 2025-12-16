import Navigation from "@/components/sections/Navigation";
import Hero from "@/components/sections/Hero";
import PainPoints from "@/components/sections/PainPoints";
import Solutions from "@/components/sections/Solutions";
import CaseStudies from "@/components/sections/CaseStudies";
import ProcessProtocol from "@/components/sections/ProcessProtocol";
import Pricing from "@/components/sections/Pricing";
import About from "@/components/sections/About";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import CTA from "@/components/sections/CTA";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
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
      <PainPoints />
      <Solutions />
      <CaseStudies />
      <ProcessProtocol />
      <Pricing />
      <About />
      <Testimonials />
      <FAQ />
      <CTA />
      <Contact />
      <Footer />
    </main>
  );
}
