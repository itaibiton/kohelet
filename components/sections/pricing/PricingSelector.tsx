import React, { memo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Code2, Bot, Workflow, Check, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ServiceType, SERVICE_PRODUCTS, PRICING } from "./types";
import { ProductCard } from "./ProductCard";

const SERVICE_ICONS: Record<ServiceType, React.ReactNode> = {
  customSoftware: <Code2 className="w-5 h-5" />,
  businessAutomation: <Workflow className="w-5 h-5" />,
  aiAgents: <Bot className="w-5 h-5" />,
};

const SERVICES: ServiceType[] = ["customSoftware", "businessAutomation", "aiAgents"];

interface PricingSelectorProps {
  openService: ServiceType | null;
  onOpenChange: (service: ServiceType | null) => void;
  selectedProducts: Array<{ service: ServiceType; product: string; price: number }>;
  onSelectProduct: (service: ServiceType, product: string) => void;
  isProductSelected: (service: ServiceType, product: string) => boolean;
  getServiceSelectedCount: (service: ServiceType) => number;
}

/**
 * PricingSelector Component
 *
 * Displays service selection cards with popovers containing product options.
 * Each service category (Custom Software, Business Automation, AI Agents)
 * has its own card that opens a popover with selectable products.
 */
export const PricingSelector = memo(function PricingSelector({
  openService,
  onOpenChange,
  selectedProducts,
  onSelectProduct,
  isProductSelected,
  getServiceSelectedCount,
}: PricingSelectorProps) {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const isRTL = locale === "he";

  return (
    <div className="space-y-3">
      {SERVICES.map((service) => {
        const selectedCount = getServiceSelectedCount(service);

        return (
          <Popover
            key={service}
            open={openService === service}
            onOpenChange={(open) => onOpenChange(open ? service : null)}
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
                    <ProductCard
                      key={product}
                      service={service}
                      product={product}
                      price={price}
                      isSelected={isSelected}
                      onSelect={() => onSelectProduct(service, product)}
                    />
                  );
                })}
              </div>

              {/* Get Custom Quote Button */}
              <a
                href="#contact"
                onClick={() => onOpenChange(null)}
                className="mt-4 w-full py-2.5 rounded-lg border border-white/10 bg-white/[0.02] hover:border-white/20 text-white/70 hover:text-white text-sm flex items-center justify-center gap-2 transition-all"
              >
                <span className="lucide lucide-message-square">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </span>
                {t("get_custom_quote")}
              </a>
            </PopoverContent>
          </Popover>
        );
      })}
    </div>
  );
});
