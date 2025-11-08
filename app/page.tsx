import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Approach from "@/components/Approach";
import WhyKohelet from "@/components/WhyKohelet";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative w-full min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <Services />
      <Approach />
      <WhyKohelet />
      <Contact />
      <Footer />
    </main>
  );
}
