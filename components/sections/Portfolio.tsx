"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";

export function Portfolio() {
  const t = useTranslations("portfolio");
  const locale = useLocale();
  const isRTL = locale === "he";

  const projects = t.raw("featured") as Array<{
    title: string;
    description: string;
    category: string;
    image: string;
    tech: string[];
    url: string;
  }>;

  return (
    <section
      id="portfolio"
      className="w-full max-w-6xl mx-auto px-6 py-24 relative z-10"
    >
      {/* Header */}
      <div className="flex w-full flex-col md:flex-row justify-between items-end gap-8 mb-16 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px w-8 bg-accent-blue" />
            <span className="text-xs font-mono text-accent-blue uppercase tracking-widest">
              {t("badge")}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-medium tracking-tight text-white mb-3">
            {t("section_title")}
          </h2>
          <p className="text-white/50 text-sm max-w-md font-light">
            {t("section_subtitle")}
          </p>
        </div>
        <Link
          href="/portfolio"
          className="hidden md:flex items-center gap-2 text-xs font-medium text-white/60 hover:text-white transition-colors group/link"
        >
          {t("view_all")}
          <ArrowRight className="w-3 h-3 rtl:rotate-180 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project, index) => (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            key={index}
            className={`group relative rounded-xl border border-white/5 bg-[#080808] overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-white/10 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] ${
              index === 0 ? "md:col-span-2" : ""
            }`}
          >
            {/* Image */}
            <div className="relative overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                width={1200}
                height={600}
                style={{ width: "100%", height: "auto", maxHeight: "280px", objectFit: "cover", objectPosition: "top" }}
                className="group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="absolute top-4 start-4 p-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowUpRight className="w-3 h-3 text-white/80 rtl:-scale-x-100" />
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                {project.category}
              </span>
              <h3 className="text-lg font-medium text-white mt-2 mb-2 tracking-tight group-hover:text-white/90 transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-white/40 leading-relaxed mb-4 font-light line-clamp-2">
                {project.description}
              </p>
              <div className={`flex flex-wrap gap-1.5 ${isRTL ? "justify-start" : ""}`}>
                {project.tech.map((tech, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono text-white/30 bg-white/[0.03] border border-white/5 px-2 py-0.5 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Mobile CTA */}
      <div className="flex md:hidden justify-center mt-10">
        <Link
          href="/portfolio"
          className="flex items-center gap-2 text-xs font-bold bg-gradient-to-r from-accent-blue to-accent-blue-hover text-white px-6 py-3 rounded-full hover:brightness-110 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]"
        >
          {t("view_all")}
          <ArrowRight className="w-3 h-3 rtl:rotate-180" />
        </Link>
      </div>
    </section>
  );
}

export default Portfolio;
