"use client";

import { useTranslations } from "next-intl";
import { ActivityIcon, ZapIcon, CpuIcon, SearchIcon } from "@/components/icons";

export default function About() {
  const t = useTranslations("about");

  const icons = [
    <ActivityIcon key="1" size={24} className="text-blue-400" />,
    <ZapIcon key="2" size={24} className="text-blue-400" />,
    <CpuIcon key="3" size={24} className="text-blue-400" />,
    <SearchIcon key="4" size={24} className="text-blue-400" />,
  ];

  return (
    <section id="about" className="py-32 relative z-10 ">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-widest text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              {t("section_title")}
            </div>

            <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white mb-6">
              {t("headline")}
            </h2>

            <p className="text-neutral-400 leading-relaxed font-light mb-12">
              {t("description")}
            </p>

            <div className="grid sm:grid-cols-2 gap-8">
              {[0, 1, 2, 3].map((idx) => (
                <div key={idx} className="space-y-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-sm bg-blue-900/10 border border-blue-500/20">
                    {icons[idx]}
                  </div>
                  <h3 className="text-white font-medium">
                    {t(`values.${idx}.title`)}
                  </h3>
                  <p className="text-sm text-neutral-500 font-light leading-relaxed">
                    {t(`values.${idx}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual/Image placeholder - could be a team photo or abstract graphic */}
          <div className="relative h-full min-h-[400px] rounded-sm border border-white/10 bg-white/5 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-50"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border border-white/10 rounded-full flex items-center justify-center animate-pulse-slow">
                <div className="w-24 h-24 border border-white/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,1)]"></div>
                </div>
              </div>
            </div>
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
