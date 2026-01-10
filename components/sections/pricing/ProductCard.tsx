import React, { memo } from "react";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { ServiceType } from "./types";

interface ProductCardProps {
  service: ServiceType;
  product: string;
  price: number;
  isSelected: boolean;
  onSelect: () => void;
}

/**
 * ProductCard Component
 *
 * Displays an individual product/service option within a service category.
 * Shows product name, price, and selection state with checkbox.
 * Memoized to prevent unnecessary re-renders when other products change.
 */
export const ProductCard = memo(function ProductCard({
  service,
  product,
  price,
  isSelected,
  onSelect,
}: ProductCardProps) {
  const t = useTranslations("pricing");

  return (
    <button
      onClick={onSelect}
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
});
