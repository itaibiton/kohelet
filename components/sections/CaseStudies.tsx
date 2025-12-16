"use client";

import { useTranslations } from "next-intl";
import { ArrowUpRightIcon } from "@/components/icons";

export default function CaseStudies() {
  const t = useTranslations("case_studies");

  const cases = [
    {
      industry: t("items.0.industry"),
      client: t("items.0.client"),
      challenge: t("items.0.challenge"),
      solution: t("items.0.solution"),
      results: [
        { metric: t("items.0.results.0.metric"), label: t("items.0.results.0.label") },
        { metric: t("items.0.results.1.metric"), label: t("items.0.results.1.label") },
      ],
    },
    {
      industry: t("items.1.industry"),
      client: t("items.1.client"),
      challenge: t("items.1.challenge"),
      solution: t("items.1.solution"),
      results: [
        { metric: t("items.1.results.0.metric"), label: t("items.1.results.0.label") },
        { metric: t("items.1.results.1.metric"), label: t("items.1.results.1.label") },
      ],
    },
    {
      industry: t("items.2.industry"),
      client: t("items.2.client"),
      challenge: t("items.2.challenge"),
      solution: t("items.2.solution"),
      results: [
        { metric: t("items.2.results.0.metric"), label: t("items.2.results.0.label") },
        { metric: t("items.2.results.1.metric"), label: t("items.2.results.1.label") },
      ],
    },
  ];

  return (
    <section id="case-studies" className="py-32 relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter-custom text-white mb-4">
              {t("section_title")}
            </h2>
            <p className="text-neutral-400 text-sm font-light max-w-md">
              {t("section_subtitle")}
            </p>
          </div>
        </div>

        {/* Case Studies Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {cases.map((caseStudy, index) => (
            <div
              key={index}
              className="group relative p-6 bg-white/[0.02] border border-white/5 rounded-sm hover:border-blue-500/30 transition-all duration-300 overflow-hidden"
            >
              {/* Industry Tag */}
              <div className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-mono uppercase tracking-wider rounded-full mb-4">
                {caseStudy.industry}
              </div>

              {/* Client & Challenge */}
              <h3 className="text-white font-medium text-lg mb-2">{caseStudy.client}</h3>
              <p className="text-neutral-500 text-sm mb-4">{caseStudy.challenge}</p>

              {/* Solution */}
              <div className="border-t border-white/5 pt-4 mb-6">
                <span className="text-[10px] text-neutral-600 font-mono uppercase tracking-wider block mb-2">
                  Solution
                </span>
                <p className="text-neutral-400 text-sm">{caseStudy.solution}</p>
              </div>

              {/* Results */}
              <div className="grid grid-cols-2 gap-4">
                {caseStudy.results.map((result, resultIndex) => (
                  <div key={resultIndex} className="text-center p-3 bg-white/[0.02] rounded-sm">
                    <div className="text-2xl font-bold text-blue-400 mb-1">
                      {result.metric}
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">
                      {result.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Hover Arrow */}
              <div className="absolute top-6 end-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRightIcon size={20} className="text-blue-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
