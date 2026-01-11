import Navigation from "@/components/sections/Navigation";
import Hero from "@/components/sections/Hero";
import Solutions from "@/components/sections/Solutions";
import Capabilities from "@/components/sections/Capabilities";
import Pricing from "@/components/sections/Pricing";
import { ContactWrapper } from "@/components/sections/ContactWrapper";
import Footer from "@/components/sections/Footer";
import { ThreeBackgroundWrapper } from "@/components/effects/ThreeBackgroundWrapper";
import { EffectsWrapper } from "@/components/effects/EffectsWrapper";
import { getServiceSchema, jsonLdScriptProps } from "@/lib/schema";

// Service definitions for JSON-LD structured data
const services = [
  {
    name: "Custom Software Development",
    description:
      "Bespoke web and mobile applications built for your exact workflows. Scalable, secure, and designed for rapid deployment using React, Next.js, and React Native.",
    serviceType: "Software Development",
  },
  {
    name: "Business Automation",
    description:
      "Intelligent workflows that eliminate manual work. From data processing to lead routing, automation systems that run 24/7 so your team can focus on strategic growth.",
    serviceType: "Business Process Automation",
  },
  {
    name: "AI Agents",
    description:
      "Deploy AI agents that work 24/7—handling customer inquiries, qualifying leads, processing data, and executing workflows. Reduce manual work by 60-80% within 90 days.",
    serviceType: "Artificial Intelligence Services",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen relative selection:bg-blue-500/30 selection:text-white">
      <script
        {...jsonLdScriptProps(services.map((s) => getServiceSchema(s)))}
      />
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
