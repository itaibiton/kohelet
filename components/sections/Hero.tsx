"use client";

import HolographicNetwork from "@/components/effects/HolographicNetwork";
import { StatItem } from "@/components/ui/StatItem";
import { Button } from "@/components/ui/Button";
import {
  TerminalIcon,
  ChevronRightIcon,
  ActivityIcon,
} from "@/components/icons";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Column - Content */}
        <div className="space-y-10 relative">
          {/* Decorative line */}
          <div className="absolute -left-12 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent hidden xl:block"></div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-3 px-3 py-1 bg-white/5 border border-white/5 rounded-full backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-blue-400 text-[10px] font-mono uppercase tracking-widest">
              Systems Operational
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl lg:text-7xl font-medium leading-[0.95] tracking-tighter-custom text-white">
            DIGITAL <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 to-neutral-600">
              ARCHITECTS
            </span>{" "}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-blue-200 text-glow">
              REDEFINED
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-neutral-400 text-lg max-w-md leading-relaxed font-light border-l border-white/10 pl-6">
            We engineer high-performance software ecosystems. From neural AI
            integration to organic search dominance, Kohelet builds the
            infrastructure of your future.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 pt-4">
            <Button variant="primary" icon={<TerminalIcon size={14} />}>
              Deploy Solution
            </Button>
            <Button variant="ghost">
              Explore Stack{" "}
              <ChevronRightIcon
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Button>
          </div>

          {/* Stats */}
          <div className="flex gap-10 border-t border-white/5 pt-8 mt-6">
            <StatItem value="98" unit="%" label="Code Efficiency" />
            <StatItem
              value="24"
              unit="/7"
              label="Deployment"
              color="text-blue-400"
            />
            <StatItem value="100" unit="+" label="Enterprise Nodes" />
          </div>
        </div>

        {/* Right Column - 3D Visual */}
        <div className="relative h-[600px] flex items-center justify-center">
          <HolographicNetwork />

          {/* Floating Card 1 - Compile Success */}
          <div className="absolute left-0 top-1/3 p-5 bg-black/60 backdrop-blur-md border border-white/10 rounded-sm w-56 animate-pulse-slow border-l-2 border-l-blue-500 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[9px] text-blue-400 font-mono tracking-widest">
                COMPILE SUCCESS
              </span>
              <ActivityIcon size={12} className="text-blue-500" />
            </div>
            <div className="space-y-2">
              <div className="h-0.5 w-full bg-white/10 overflow-hidden">
                <div className="h-full bg-blue-500 w-[85%]"></div>
              </div>
              <div className="flex justify-between text-[8px] font-mono text-neutral-500">
                <span>MODULE: CORE_AI</span>
                <span>85ms</span>
              </div>
            </div>
          </div>

          {/* Floating Card 2 - SEO Traffic */}
          <div className="absolute right-0 bottom-1/3 p-5 bg-black/60 backdrop-blur-md border border-white/10 rounded-sm w-56 animate-pulse-slow border-r-2 border-r-emerald-500 shadow-2xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] text-emerald-400 font-mono tracking-widest">
                SEO TRAFFIC
              </span>
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
            <div className="text-xl font-mono text-white mb-1">+428%</div>
            <div className="text-[9px] text-neutral-500 font-mono">
              Organic acquisition vector scaling exponentially.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
