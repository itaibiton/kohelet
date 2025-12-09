import { FeatureCard } from "@/components/ui/Card";
import { CodeIcon, SmartphoneIcon, CpuIcon, SearchIcon, ShareIcon, ZapIcon } from "@/components/icons";

export default function Solutions() {
  const features = [
    {
      icon: <CodeIcon size={18} strokeWidth={1.5} />,
      title: "Custom Architecture",
      description: "Bespoke software solutions engineered for scalability, security, and high-frequency performance.",
      tag: "DEV"
    },
    {
      icon: <SmartphoneIcon size={18} strokeWidth={1.5} />,
      title: "Mobile Ecosystems",
      description: "Native iOS and Android applications providing seamless, intuitive user experiences across devices.",
      tag: "MOBILE"
    },
    {
      icon: <CpuIcon size={18} strokeWidth={1.5} />,
      title: "AI Integration",
      description: "Neural network implementation and machine learning algorithms to automate complex decision trees.",
      tag: "INTELLIGENCE"
    },
    {
      icon: <SearchIcon size={18} strokeWidth={1.5} />,
      title: "SEO Dominance",
      description: "Algorithmic optimization strategies to secure top-tier visibility in organic search vectors.",
      tag: "GROWTH"
    },
    {
      icon: <ShareIcon size={18} strokeWidth={1.5} />,
      title: "Signal Amplification",
      description: "Social media management and content distribution networks designed to maximize brand resonance.",
      tag: "SOCIAL"
    },
    {
      icon: <ZapIcon size={18} strokeWidth={1.5} />,
      title: "Rapid Prototyping",
      description: "Accelerated development cycles taking concepts from wireframe to production deployment in record time.",
      tag: "SPEED"
    }
  ];

  return (
    <section id="solutions" className="py-32 relative z-10 border-t border-white/5 bg-[#030305]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6 pb-8 border-b border-white/5">
          <div>
            <h2 className="text-3xl font-medium tracking-tight text-white mb-4">Core Capabilities</h2>
            <p className="text-neutral-400 text-sm font-light max-w-md">End-to-end digital mastery. We don&apos;t just build software; we engineer dominance.</p>
          </div>
          <div className="font-mono text-[10px] text-neutral-500 text-right flex flex-col gap-1">
            <span className="text-blue-500">SYSTEM: ONLINE</span>
            <span>V.4.0.2 STABLE</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              tag={feature.tag}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
