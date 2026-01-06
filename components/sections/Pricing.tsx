"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Check, ArrowRight, Code2, Bot, Workflow, Plus, Settings2, MessageSquare } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { usePricing, type SelectedProduct } from "@/context/PricingContext";

// Pricing constants in NIS - all "starting from" prices
const PRICING = {
  customSoftware: {
    landingPage: 4000,
    onlineStore: 7000,
    blog: 3000,
    webApp: 9500,
  },
  businessAutomation: {
    crmIntegration: 6000,
    emailAutomation: 4500,
    workflowAutomation: 8000,
  },
  aiAgents: {
    chatbot: 5500,
    customerSupport: 8500,
    dataAnalysis: 10000,
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

type ServiceType = "customSoftware" | "businessAutomation" | "aiAgents";
type CustomSoftwareProduct = keyof typeof PRICING.customSoftware;
type BusinessAutomationProduct = keyof typeof PRICING.businessAutomation;
type AIAgentProduct = keyof typeof PRICING.aiAgents;
type AddOnType = keyof typeof PRICING.addOns;

const SERVICE_ICONS: Record<ServiceType, React.ReactNode> = {
  customSoftware: <Code2 className="w-5 h-5" />,
  businessAutomation: <Workflow className="w-5 h-5" />,
  aiAgents: <Bot className="w-5 h-5" />,
};

const SERVICES: ServiceType[] = ["customSoftware", "businessAutomation", "aiAgents"];

const SERVICE_PRODUCTS: Record<ServiceType, string[]> = {
  customSoftware: ["landingPage", "onlineStore", "blog", "webApp"],
  businessAutomation: ["crmIntegration", "emailAutomation", "workflowAutomation"],
  aiAgents: ["chatbot", "customerSupport", "dataAnalysis"],
};

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

  // Use shared pricing context for state
  const {
    selectedProducts,
    setSelectedProducts,
    addOns,
    setAddOns,
    setEstimatedTotal,
  } = usePricing();

  // Popover open states (local only)
  const [openService, setOpenService] = useState<ServiceType | null>(null);
  const [addOnsOpen, setAddOnsOpen] = useState(false);

  const toggleAddOn = (addOn: AddOnType) => {
    setAddOns({ ...addOns, [addOn]: !addOns[addOn] });
  };

  const selectProduct = (service: ServiceType, product: string) => {
    const priceMap = PRICING[service] as Record<string, number>;
    const price = priceMap[product];

    // Check if this exact product is already selected
    const existingIndex = selectedProducts.findIndex(
      (p) => p.service === service && p.product === product
    );

    if (existingIndex >= 0) {
      // Remove if already selected
      setSelectedProducts(selectedProducts.filter((_, i) => i !== existingIndex));
    } else {
      // Add new product
      setSelectedProducts([...selectedProducts, { service, product, price } as SelectedProduct]);
    }
  };

  const isProductSelected = (service: ServiceType, product: string) => {
    return selectedProducts.some((p) => p.service === service && p.product === product);
  };

  const getServiceSelectedCount = (service: ServiceType) => {
    return selectedProducts.filter((p) => p.service === service).length;
  };

  const selectedAddOnsCount = ADD_ONS.filter((a) => addOns[a]).length;

  const calculatedPrice = useMemo(() => {
    let oneTime = 0;
    let monthly = 0;

    // Sum all selected products
    selectedProducts.forEach((product) => {
      oneTime += product.price;
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
  }, [selectedProducts, addOns, t]);

  // Sync estimated total to context for use in Contact form
  useEffect(() => {
    setEstimatedTotal(calculatedPrice);
  }, [calculatedPrice, setEstimatedTotal]);

  const hasSelections = selectedProducts.length > 0;

  return (
    <section id="pricing" className="w-full max-w-5xl mx-auto px-6 py-24 relative z-10">
      {/* Header */}
      <div className="mb-12 space-y-4">
        <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-white">
          {t("section_title")}
        </h2>
        <p className="text-white/50 text-sm md:text-base font-light max-w-2xl">
          {t("section_subtitle")}
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Service Selection */}
        <div className="space-y-3">
          {/* Service Cards with Popovers */}
          {SERVICES.map((service) => {
            const selectedCount = getServiceSelectedCount(service);
            return (
              <Popover
                key={service}
                open={openService === service}
                onOpenChange={(open) => setOpenService(open ? service : null)}
              >
                <PopoverTrigger asChild>
                  <button
                    className={`w-full p-4 rounded-xl border transition-all duration-200 ${
                      selectedCount > 0
                        ? "border-accent-blue bg-accent-blue/10"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2.5 rounded-lg ${
                          selectedCount > 0 ? "bg-accent-blue/20 text-accent-blue" : "bg-white/5 text-white/60"
                        }`}
                      >
                        {SERVICE_ICONS[service]}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{t(`services.${service}.name`)}</h4>
                        {selectedCount > 0 && (
                          <p className="text-accent-blue text-xs mt-0.5">
                            {selectedCount} {t("products_selected")}
                          </p>
                        )}
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedCount > 0 ? "border-accent-blue bg-accent-blue" : "border-white/20"
                        }`}
                      >
                        {selectedCount > 0 ? (
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
                  <div className="mb-3">
                    <span className="text-xs text-white/50">{t(`services.${service}.description`)}</span>
                  </div>
                  <div className="space-y-2">
                    {SERVICE_PRODUCTS[service].map((product) => {
                      const priceMap = PRICING[service] as Record<string, number>;
                      const price = priceMap[product];
                      const isSelected = isProductSelected(service, product);

                      return (
                        <button
                          key={product}
                          onClick={() => selectProduct(service, product)}
                          className={`w-full p-3 rounded-lg border transition-all ${
                            isSelected
                              ? "border-accent-blue bg-accent-blue/10"
                              : "border-white/5 bg-white/[0.02] hover:border-white/10"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all ${
                                  isSelected ? "bg-accent-blue border-accent-blue" : "border-white/30"
                                }`}
                              >
                                {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                              </div>
                              <span className="text-white text-sm font-medium">
                                {t(`services.${service}.products.${product}.name`)}
                              </span>
                            </div>
                            <div className="text-end">
                              <span className="text-white/40 text-xs block">{t("starting_from")}</span>
                              <span className="text-accent-blue text-sm font-medium">
                                {t("currency")}{price.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Get Custom Quote Button */}
                  <a
                    href="#contact"
                    onClick={() => setOpenService(null)}
                    className="mt-4 w-full py-2.5 rounded-lg border border-white/10 bg-white/[0.02] hover:border-white/20 text-white/70 hover:text-white text-sm flex items-center justify-center gap-2 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    {t("get_custom_quote")}
                  </a>
                </PopoverContent>
              </Popover>
            );
          })}

          {/* Add-ons Button with Popover */}
          <Popover open={addOnsOpen} onOpenChange={setAddOnsOpen}>
            <PopoverTrigger asChild>
              <button
                className={`w-full p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-all ${
                  selectedAddOnsCount > 0 ? "border-accent-blue/50" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-lg bg-white/5 text-white/60">
                    <Settings2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{t("addOns.title")}</h4>
                    {selectedAddOnsCount > 0 && (
                      <p className="text-accent-blue text-xs mt-0.5">
                        {selectedAddOnsCount} {t("products_selected")}
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
              <div className="mb-3">
                <span className="text-xs text-white/50">{t("addOns.subtitle")}</span>
              </div>
              <div className="space-y-1">
                {ADD_ONS.map((addOn) => {
                  const addOnType = t(`addOns.items.${addOn}.type`);
                  return (
                    <label
                      key={addOn}
                      className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all hover:bg-white/5"
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
                      <span className="flex-1 text-sm text-white/80">
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
        <div>
          <div className="p-6 rounded-2xl border border-white/10 bg-[#050505] h-full flex flex-col">
            <h3 className="text-sm font-medium text-white/60 mb-6">
              {t("summary_title")}
            </h3>

            {hasSelections ? (
              <div className="space-y-3 flex-1">
                {selectedProducts.map((item, index) => (
                  <div
                    key={`${item.service}-${item.product}-${index}`}
                    className="flex justify-between items-center"
                  >
                    <span className="text-white/80 text-sm">
                      {t(`services.${item.service}.products.${item.product}.name`)}
                    </span>
                    <span className="text-white font-medium">
                      {t("currency")}
                      {item.price.toLocaleString()}
                    </span>
                  </div>
                ))}

                {ADD_ONS.filter((a) => addOns[a]).map((addOn) => (
                  <div
                    key={addOn}
                    className="flex justify-between items-center text-xs"
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
              <p className="text-white/40 text-sm flex-1">{t("empty_selection")}</p>
            )}

            {/* Total */}
            <div className="pt-6 border-t border-white/10 mt-6">
              <div className="flex items-baseline gap-2 items-center justify-between">
                <span className="text-xs text-white/50">{t("starting_from")}</span>
                <span className="text-2xl font-display font-medium text-white flex flex-col">
                  {t("currency")}
                  {calculatedPrice.oneTime.toLocaleString()}
                </span>
              </div>
              {calculatedPrice.monthly > 0 && (
                <p className="text-sm text-accent-blue mt-2 text-end">
                  + {t("currency")}
                  {calculatedPrice.monthly.toLocaleString()}
                  {t("per_month")}
                </p>
              )}
            </div>

            {/* CTA */}
            <a
              href="#contact"
              className="mt-6 w-full py-4 rounded-xl bg-accent-blue hover:bg-accent-blue-hover text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-glow-blue"
            >
              {t("cta_button")}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </a>
            <p className="text-xs text-white/40 mt-3">{t("cta_note")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
