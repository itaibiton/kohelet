export default function ProcessProtocol() {
  const steps = [
    {
      step: '01',
      title: 'Discovery & Analysis',
      description: 'We map your digital terrain, identifying inefficiencies and opportunities for algorithmic improvement.'
    },
    {
      step: '02',
      title: 'Synthesis & Build',
      description: 'Our engineers construct the architecture, deploying clean code and robust AI models tailored to your vector.'
    },
    {
      step: '03',
      title: 'Scale & Optimize',
      description: 'Post-launch monitoring and SEO injection ensuring your platform dominates the market share of voice.'
    }
  ];

  return (
    <section id="process" className="py-32 relative z-10 overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-900/40 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-24 relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 -mt-10 w-px h-20 bg-gradient-to-b from-transparent to-blue-500"></div>
          <h2 className="text-3xl font-medium tracking-tight text-white mb-4">The Kohelet Protocol</h2>
          <p className="text-neutral-500 text-sm max-w-lg mx-auto">Three phases to digital transformation.</p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center Line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-[1px] bg-white/5 md:left-1/2 md:-ml-[0.5px]"></div>

          {steps.map((item, idx) => (
            <div
              key={idx}
              className={`relative flex gap-10 mb-20 last:mb-0 md:justify-center ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              {/* Step Number Circle */}
              <div className="relative z-10 w-10 h-10 shrink-0 bg-[#020204] border border-white/20 rounded-full flex items-center justify-center text-xs font-mono font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                {item.step}
              </div>

              {/* Content */}
              <div className={`md:w-1/3 pt-1 ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                <h3 className="text-lg font-medium text-white mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed font-light">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
