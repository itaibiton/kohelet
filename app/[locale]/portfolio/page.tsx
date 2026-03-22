"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";
import { EffectsWrapper } from "@/components/effects/EffectsWrapper";
import { ThreeBackgroundWrapper } from "@/components/effects/ThreeBackgroundWrapper";
import {
  ArrowUpRight,
  ArrowLeft,
  X,
  ExternalLink,
  Zap,
} from "lucide-react";

type Project = {
  title: string;
  description: string;
  longDescription: string;
  category: string;
  filterCategory: string;
  icon: string;
  image: string;
  url: string;
  tech: string[];
  metric: { value: string; label: string };
  highlights: string[];
};

export default function PortfolioPage() {
  const t = useTranslations("portfolioPage");
  const locale = useLocale();
  const isRTL = locale === "he";

  const projects = t.raw("projects") as Project[];
  const categories = t.raw("categories") as Array<{ key: string; label: string }>;

  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.filterCategory === activeFilter);

  return (
    <main className="min-h-screen relative selection:bg-blue-500/30 selection:text-white">
      <EffectsWrapper />
      <ThreeBackgroundWrapper />
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors mb-8 group/back"
          >
            <ArrowLeft className="w-3 h-3 rtl:rotate-180 group-hover/back:-translate-x-0.5 rtl:group-hover/back:translate-x-0.5 transition-transform" />
            {t("backHome")}
          </Link>

          <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-accent-blue" />
              <span className="text-xs font-mono text-accent-blue uppercase tracking-widest">
                {t("badge")}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium tracking-tight text-white mb-4">
              {t("headline")}
            </h1>
            <p className="text-white/50 text-sm md:text-base max-w-xl font-light leading-relaxed">
              {t("subtitle")}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mt-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveFilter(cat.key)}
                className={`text-xs font-medium px-4 py-2 rounded-full border transition-all duration-300 ${
                  activeFilter === cat.key
                    ? "bg-accent-blue/10 border-accent-blue/30 text-accent-blue"
                    : "bg-white/[0.02] border-white/5 text-white/40 hover:text-white/70 hover:border-white/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-6 pb-24 relative z-10">
        <div className="max-w-6xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project, index) => (
              <button
                key={index}
                onClick={() => setSelectedProject(project)}
                className="group relative rounded-xl border border-white/5 bg-[#080808] overflow-hidden transition-all duration-500 hover:-translate-y-1 text-start hover:border-white/10 group-hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={800}
                    height={400}
                    style={{ width: "100%", height: "auto", maxHeight: "200px", objectFit: "cover", objectPosition: "top" }}
                    className="group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                  {/* Hover arrow */}
                  <div className="absolute top-3 start-3 p-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowUpRight className="w-3 h-3 text-white/80 rtl:-scale-x-100" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <span className="text-[10px] font-mono text-white/25 uppercase tracking-widest">
                    {project.category}
                  </span>
                  <h3 className="text-base font-medium text-white mt-1.5 mb-2 tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-xs text-white/35 leading-relaxed font-light line-clamp-2 mb-3">
                    {project.description}
                  </p>
                  <div className={`flex flex-wrap gap-1 ${isRTL ? "justify-start" : ""}`}>
                    {project.tech.slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className="text-[9px] font-mono text-white/25 bg-white/[0.02] border border-white/5 px-1.5 py-0.5 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 3 && (
                      <span className="text-[9px] font-mono text-white/20 px-1.5 py-0.5">
                        +{project.tech.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white/30 text-sm">{t("emptyState")}</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10">
        <div className="h-24 md:h-32" />
        <div className="w-full text-center">
          <div className="w-full p-12 md:p-20 border-y border-white/5 bg-[#080808] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-transparent" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 text-xs text-accent-blue font-medium border border-accent-blue/20 bg-accent-blue/5 px-3 py-1 rounded-full mb-6">
                <Zap className="w-3 h-3" />
                {t("cta.badge")}
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight text-white mb-3">
                {t("cta.headline")}
              </h2>
              <p className="text-sm text-white/40 mb-8 max-w-md mx-auto">
                {t("cta.subtitle")}
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 text-xs font-bold bg-accent-blue hover:bg-accent-blue-hover text-white px-6 py-3 rounded-full transition-colors shadow-[0_0_20px_rgba(59,130,246,0.3)]"
              >
                {t("cta.button")}
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 end-4 z-10 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>

            {/* Header image */}
            <div className="relative overflow-hidden rounded-t-2xl">
              <Image
                src={selectedProject.image}
                alt={selectedProject.title}
                width={1200}
                height={600}
                style={{ width: "100%", height: "auto", maxHeight: "250px", objectFit: "cover", objectPosition: "top" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />
              {/* Metric overlay */}
              <div className="absolute bottom-4 end-4 text-end">
                <div className="font-mono text-2xl font-bold text-white/90">
                  {selectedProject.metric.value}
                </div>
                <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider">
                  {selectedProject.metric.label}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                {selectedProject.category}
              </span>
              <h2 className="text-2xl font-display font-medium tracking-tight text-white mt-2 mb-4">
                {selectedProject.title}
              </h2>
              <p className="text-sm text-white/50 leading-relaxed mb-6">
                {selectedProject.longDescription}
              </p>

              {/* Highlights */}
              <div className="mb-6">
                <h4 className="text-xs font-medium text-white/60 uppercase tracking-wide mb-3">
                  {t("modal.highlights")}
                </h4>
                <ul className="space-y-2">
                  {selectedProject.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/40">
                      <div className="w-1 h-1 rounded-full bg-accent-blue mt-2 shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech stack */}
              <div>
                <h4 className="text-xs font-medium text-white/60 uppercase tracking-wide mb-3">
                  {t("modal.techStack")}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tech.map((tech, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-mono text-white/40 bg-white/[0.03] border border-white/5 px-3 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-3">
                <a
                  href={selectedProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-full transition-colors"
                >
                  Visit Site
                  <ExternalLink className="w-3 h-3" />
                </a>
                <Link
                  href="/#contact"
                  onClick={() => setSelectedProject(null)}
                  className="inline-flex items-center gap-2 text-xs font-bold bg-accent-blue hover:bg-accent-blue-hover text-white px-5 py-2.5 rounded-full transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                >
                  {t("modal.cta")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
