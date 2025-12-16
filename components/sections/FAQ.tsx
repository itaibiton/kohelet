"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDownIcon } from "@/components/icons";

export default function FAQ() {
  const t = useTranslations("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const items = [
    { question: t("items.0.question"), answer: t("items.0.answer") },
    { question: t("items.1.question"), answer: t("items.1.answer") },
    { question: t("items.2.question"), answer: t("items.2.answer") },
    { question: t("items.3.question"), answer: t("items.3.answer") },
    { question: t("items.4.question"), answer: t("items.4.answer") },
    { question: t("items.5.question"), answer: t("items.5.answer") },
  ];

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-32 relative z-10 border-t border-white/5">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tighter-custom text-white mb-4">
            {t("section_title")}
          </h2>
          <p className="text-neutral-400 text-sm font-light max-w-md mx-auto">
            {t("section_subtitle")}
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="border border-white/5 rounded-sm overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center justify-between p-5 text-start bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <span className="text-white font-medium pe-4">{item.question}</span>
                <ChevronDownIcon
                  size={20}
                  className={`text-neutral-400 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="p-5 pt-0 text-neutral-400 text-sm leading-relaxed">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
