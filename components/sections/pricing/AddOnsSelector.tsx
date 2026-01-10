import React, { memo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Settings2, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ADD_ONS, AddOnType } from "./types";
import { AddOnCheckbox } from "./AddOnCheckbox";

interface AddOnsSelectorProps {
  addOns: Record<string, boolean>;
  onToggleAddOn: (addOn: AddOnType) => void;
  selectedAddOnsCount: number;
  addOnsOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * AddOnsSelector Component
 *
 * Displays the add-ons selector button with a popover containing
 * all available add-on options as checkboxes.
 * Memoized to prevent re-renders when unrelated pricing state changes.
 */
export const AddOnsSelector = memo(function AddOnsSelector({
  addOns,
  onToggleAddOn,
  selectedAddOnsCount,
  addOnsOpen,
  onOpenChange,
}: AddOnsSelectorProps) {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const isRTL = locale === "he";

  return (
    <Popover open={addOnsOpen} onOpenChange={onOpenChange}>
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
          {ADD_ONS.map((addOn) => (
            <AddOnCheckbox
              key={addOn}
              addOn={addOn}
              checked={addOns[addOn]}
              onToggle={() => onToggleAddOn(addOn)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
});
