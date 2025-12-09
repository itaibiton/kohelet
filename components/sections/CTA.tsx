import { ChevronRightIcon } from "@/components/icons";

export default function CTA() {
  return (
    <section className="py-40 relative overflow-hidden border-t border-white/5">
      {/* Background effects */}
      <div className="absolute inset-0 bg-blue-900/5 mix-blend-overlay"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-transparent blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-5xl md:text-6xl font-medium tracking-tighter-custom text-white mb-8">
          BUILD THE <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500">FUTURE.</span>
        </h2>
        <p className="text-neutral-400 mb-12 max-w-xl mx-auto font-light text-base">
          The digital landscape is shifting. Secure your infrastructure with Kohelet&apos;s advanced development protocols.
        </p>
        <button className="group relative inline-flex items-center justify-center px-10 py-5 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-blue-600 hover:text-white transition-all duration-300 clip-hud overflow-hidden">
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
          <span className="flex items-center gap-3 relative z-10">
            Initialize Contact <ChevronRightIcon size={14} />
          </span>
        </button>
      </div>
    </section>
  );
}
