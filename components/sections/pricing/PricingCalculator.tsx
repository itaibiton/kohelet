import React, { memo } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { ADD_ONS, PRICING } from "./types";

interface PricingCalculatorProps {
  selectedProducts: Array<{ service: string; product: string; price: number }>;
  addOns: Record<string, boolean>;
  calculatedPrice: { oneTime: number; monthly: number };
}

/**
 * PricingCalculator Component
 *
 * Displays the price summary panel showing:
 * - List of selected products with prices
 * - List of selected add-ons with prices
 * - Total one-time and monthly costs
 * - CTA button to contact form
 *
 * Memoized to prevent re-renders when unrelated state changes.
 */
export const PricingCalculator = memo(function PricingCalculator({
  selectedProducts,
  addOns,
  calculatedPrice,
}: PricingCalculatorProps) {
  const t = useTranslations("pricing");
  const hasSelections = selectedProducts.length > 0;

  return (
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
  );
});
