"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Check, ArrowRight, Code2, Bot, Workflow, Plus, Settings2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Pricing constants in NIS
const PRICING = {
  services: {
    customSoftware: { basic: 15000, standard: 35000, advanced: 75000 },
    businessAutomation: { basic: 8000, standard: 20000, advanced: 45000 },
    aiAgents: { basic: 12000, standard: 30000, advanced: 60000 },
  },
  addOns: {
    prioritySupport: 2000,
    dedicatedSlack: 1500,
    monthlyReporting: 1000,
    slaGuarantee: 3000,
    trainingWorkshops: 5000,
    codeDocumentation: 4000,
    multiLanguageSupport: 6000,
    apiIntegration: 8000,
    dataAnalyticsDashboard: 10000,
    securityAudit: 7000,
  },
} as const;

type ServiceType = keyof typeof PRICING.services;
type ComplexityLevel = "basic" | "standard" | "advanced";
type AddOnType = keyof typeof PRICING.addOns;

const SERVICE_ICONS: Record<ServiceType, React.ReactNode> = {
  customSoftware: <Code2 className="w-5 h-5" />,
  businessAutomation: <Workflow className="w-5 h-5" />,
  aiAgents: <Bot className="w-5 h-5" />,
};

const SERVICES: ServiceType[] = ["customSoftware", "businessAutomation", "aiAgents"];
const ADD_ONS: AddOnType[] = [
  "prioritySupport",
  "dedicatedSlack",
  "monthlyReporting",
  "slaGuarantee",
  "trainingWorkshops",
  "codeDocumentation",
  "multiLanguageSupport",
  "apiIntegration",
  "dataAnalyticsDashboard",
  "securityAudit",
];

export function Pricing() {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const isRTL = locale === "he";

  const [selectedServices, setSelectedServices] = useState<Record<ServiceType, boolean>>({
    customSoftware: false,
    businessAutomation: false,
    aiAgents: false,
  });

  const [complexity, setComplexity] = useState<Record<ServiceType, ComplexityLevel>>({
    customSoftware: "standard",
    businessAutomation: "standard",
    aiAgents: "standard",
  });

  const [addOns, setAddOns] = useState<Record<AddOnType, boolean>>({
    prioritySupport: false,
    dedicatedSlack: false,
    monthlyReporting: false,
    slaGuarantee: false,
    trainingWorkshops: false,
    codeDocumentation: false,
    multiLanguageSupport: false,
    apiIntegration: false,
    dataAnalyticsDashboard: false,
    securityAudit: false,
  });

  // Popover open states
  const [openService, setOpenService] = useState<ServiceType | null>(null);
  const [addOnsOpen, setAddOnsOpen] = useState(false);

  const toggleAddOn = (addOn: AddOnType) => {
    setAddOns((prev) => ({ ...prev, [addOn]: !prev[addOn] }));
  };

  const selectedAddOnsCount = ADD_ONS.filter((a) => addOns[a]).length;

  const calculatedPrice = useMemo(() => {
    let oneTime = 0;
    let monthly = 0;

    SERVICES.forEach((service) => {
      if (selectedServices[service]) {
        oneTime += PRICING.services[service][complexity[service]];
      }
    });

    ADD_ONS.forEach((addOn) => {
      if (addOns[addOn]) {
        const addOnType = t(`addOns.items.${addOn}.type`);
        if (addOnType === "monthly") {
          monthly += PRICING.addOns[addOn];
        } else {
          oneTime += PRICING.addOns[addOn];
        }
      }
    });

    return { oneTime, monthly };
  }, [selectedServices, complexity, addOns, t]);

  const hasSelections = SERVICES.some((s) => selectedServices[s]);

  return (
    <section id="pricing" className="w-full max-w-5xl mx-auto px-6 py-24 relative z-10">
      {/* Header */}
      <div className={`mb-12 space-y-4 ${isRTL ? "text-right" : "text-center"}`}>
        <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-white">
          {t("section_title")}
        </h2>
        <p className="text-white/50 text-sm md:text-base font-light max-w-2xl mx-auto">
          {t("section_subtitle")}
        </p>
      </div>

      {/* Main Grid */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8`}>
        {/* Left: Service Selection */}
        <div className={`space-y-3 ${isRTL ? "lg:order-2" : "lg:order-1"}`}>
          <h3 className={`text-sm font-medium text-white/60 uppercase tracking-wide mb-4 ${isRTL ? "text-right" : ""}`}>
            {t("services.title")}
          </h3>

          {/* Service Cards with Popovers */}
          {SERVICES.map((service) => (
            <Popover
              key={service}
              open={openService === service}
              onOpenChange={(open) => setOpenService(open ? service : null)}
            >
              <PopoverTrigger asChild>
                <button
                  className={`w-full p-4 rounded-xl border transition-all duration-200 ${
                    selectedServices[service]
                      ? "border-accent-blue bg-accent-blue/10"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div
                      className={`p-2.5 rounded-lg ${
                        selectedServices[service] ? "bg-accent-blue/20 text-accent-blue" : "bg-white/5 text-white/60"
                      }`}
                    >
                      {SERVICE_ICONS[service]}
                    </div>
                    <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
                      <h4 className="text-white font-medium">{t(`services.${service}.name`)}</h4>
                      {selectedServices[service] && (
                        <p className="text-accent-blue text-xs mt-0.5">
                          {t(`services.${service}.tiers.${complexity[service]}.name`)} · {t("currency")}
                          {PRICING.services[service][complexity[service]].toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedServices[service] ? "border-accent-blue bg-accent-blue" : "border-white/20"
                      }`}
                    >
                      {selectedServices[service] ? (
                        <Check className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 text-white/40" />
                      )}
                    </div>
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent
                side="bottom"
                align={isRTL ? "end" : "start"}
                sideOffset={8}
                className="w-[var(--radix-popover-trigger-width)] bg-[#0a0a0a] border-white/10 p-4 shadow-2xl"
              >
                <div className={`mb-3 ${isRTL ? "text-right" : ""}`}>
                  <span className="text-xs text-white/50">{t("complexity.title")}</span>
                </div>
                <div className="space-y-2">
                  {(["basic", "standard", "advanced"] as ComplexityLevel[]).map((level) => (
                    <button
                      key={level}
                      onClick={() => {
                        setSelectedServices((prev) => ({ ...prev, [service]: true }));
                        setComplexity((prev) => ({ ...prev, [service]: level }));
                        setOpenService(null);
                      }}
                      className={`w-full p-3 rounded-lg border transition-all ${isRTL ? "text-right" : "text-left"} ${
                        selectedServices[service] && complexity[service] === level
                          ? "border-accent-blue bg-accent-blue/10"
                          : "border-white/5 bg-white/[0.02] hover:border-white/10"
                      }`}
                    >
                      <div className={`flex justify-between items-center ${isRTL ? "flex-row-reverse" : ""}`}>
                        <div>
                          <span className="text-white text-sm font-medium">
                            {t(`services.${service}.tiers.${level}.name`)}
                          </span>
                          <span className="text-white/40 text-xs block">
                            {t(`services.${service}.tiers.${level}.timeline`)}
                          </span>
                        </div>
                        <span className="text-accent-blue text-sm font-medium">
                          {t("currency")}
                          {PRICING.services[service][level].toLocaleString()}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                {selectedServices[service] && (
                  <button
                    onClick={() => {
                      setSelectedServices((prev) => ({ ...prev, [service]: false }));
                      setOpenService(null);
                    }}
                    className="mt-3 w-full py-2 text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    {isRTL ? "הסר" : "Remove"}
                  </button>
                )}
              </PopoverContent>
            </Popover>
          ))}

          {/* Add-ons Button with Popover */}
          <Popover open={addOnsOpen} onOpenChange={setAddOnsOpen}>
            <PopoverTrigger asChild>
              <button
                className={`w-full p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-all ${
                  selectedAddOnsCount > 0 ? "border-accent-blue/50" : ""
                }`}
              >
                <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className="p-2.5 rounded-lg bg-white/5 text-white/60">
                    <Settings2 className="w-5 h-5" />
                  </div>
                  <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
                    <h4 className="text-white font-medium">{t("addOns.title")}</h4>
                    {selectedAddOnsCount > 0 && (
                      <p className="text-accent-blue text-xs mt-0.5">
                        {selectedAddOnsCount} {isRTL ? "נבחרו" : "selected"}
                      </p>
                    )}
                  </div>
                  <Plus className="w-5 h-5 text-white/40" />
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align={isRTL ? "end" : "start"}
              sideOffset={8}
              className="w-[var(--radix-popover-trigger-width)] bg-[#0a0a0a] border-white/10 p-4 shadow-2xl max-h-80 overflow-y-auto"
            >
              <div className={`mb-3 ${isRTL ? "text-right" : ""}`}>
                <span className="text-xs text-white/50">{t("addOns.subtitle")}</span>
              </div>
              <div className="space-y-1">
                {ADD_ONS.map((addOn) => {
                  const addOnType = t(`addOns.items.${addOn}.type`);
                  return (
                    <label
                      key={addOn}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all hover:bg-white/5 ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={addOns[addOn]}
                        onChange={() => toggleAddOn(addOn)}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all ${
                          addOns[addOn] ? "bg-accent-blue border-accent-blue" : "border-white/30"
                        }`}
                      >
                        {addOns[addOn] && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className={`flex-1 text-sm text-white/80 ${isRTL ? "text-right" : ""}`}>
                        {t(`addOns.items.${addOn}.name`)}
                      </span>
                      <span className="text-xs text-accent-blue">
                        {t("currency")}
                        {PRICING.addOns[addOn].toLocaleString()}
                        {addOnType === "monthly" && t("per_month")}
                      </span>
                    </label>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Right: Price Summary */}
        <div className={`${isRTL ? "lg:order-1" : "lg:order-2"}`}>
          <div className="p-6 rounded-2xl border border-white/10 bg-[#050505] h-full flex flex-col">
            <h3 className={`text-sm font-medium text-white/60 mb-6 ${isRTL ? "text-right" : ""}`}>
              {t("summary_title")}
            </h3>

            {hasSelections ? (
              <div className="space-y-3 flex-1">
                {SERVICES.filter((s) => selectedServices[s]).map((service) => (
                  <div
                    key={service}
                    className={`flex justify-between items-center ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <span className="text-white/80 text-sm">{t(`services.${service}.name`)}</span>
                    <span className="text-white font-medium">
                      {t("currency")}
                      {PRICING.services[service][complexity[service]].toLocaleString()}
                    </span>
                  </div>
                ))}

                {ADD_ONS.filter((a) => addOns[a]).map((addOn) => (
                  <div
                    key={addOn}
                    className={`flex justify-between items-center text-xs ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <span className="text-white/50">+ {t(`addOns.items.${addOn}.name`)}</span>
                    <span className="text-white/70">
                      {t("currency")}
                      {PRICING.addOns[addOn].toLocaleString()}
                      {t(`addOns.items.${addOn}.type`) === "monthly" && t("per_month")}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-white/40 text-sm flex-1 ${isRTL ? "text-right" : ""}`}>{t("empty_selection")}</p>
            )}

            {/* Total */}
            <div className={`pt-6 border-t border-white/10 mt-6 ${isRTL ? "text-right" : ""}`}>
              <p className="text-xs text-white/50 mb-2">{t("total_label")}</p>
              <div className={`flex items-baseline gap-2 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                <span className="text-xs text-white/50">{t("starting_from")}</span>
                <span className="text-4xl font-display font-medium text-white">
                  {t("currency")}
                  {calculatedPrice.oneTime.toLocaleString()}
                </span>
              </div>
              {calculatedPrice.monthly > 0 && (
                <p className="text-sm text-accent-blue mt-2">
                  + {t("currency")}
                  {calculatedPrice.monthly.toLocaleString()}
                  {t("per_month")}
                </p>
              )}
            </div>

            {/* CTA */}
            <a
              href="#contact"
              className={`mt-6 w-full py-4 rounded-xl bg-accent-blue hover:bg-accent-blue-hover text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-glow-blue ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              {t("cta_button")}
              <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
            </a>
            <p className={`text-xs text-white/40 mt-3 ${isRTL ? "text-right" : "text-center"}`}>{t("cta_note")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
