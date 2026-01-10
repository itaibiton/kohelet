import React, { memo } from "react";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { AddOnType, PRICING } from "./types";

interface AddOnCheckboxProps {
  addOn: AddOnType;
  checked: boolean;
  onToggle: () => void;
}

/**
 * AddOnCheckbox Component
 *
 * Displays a single add-on checkbox option with name and price.
 * Shows monthly/one-time pricing label based on add-on type.
 * Memoized to prevent unnecessary re-renders when other add-ons change.
 */
export const AddOnCheckbox = memo(function AddOnCheckbox({
  addOn,
  checked,
  onToggle,
}: AddOnCheckboxProps) {
  const t = useTranslations("pricing");
  const addOnType = t(`addOns.items.${addOn}.type`);

  return (
    <label className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all hover:bg-white/5">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="sr-only"
      />
      <div
        className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all ${
          checked ? "bg-accent-blue border-accent-blue" : "border-white/30"
        }`}
      >
        {checked && <Check className="w-2.5 h-2.5 text-white" />}
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
});
