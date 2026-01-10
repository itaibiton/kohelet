"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePricing, type SelectedProduct } from "@/context/PricingContext";
import {
  PricingSelector,
  AddOnsSelector,
  PricingCalculator,
  ServiceType,
  AddOnType,
  PRICING,
  ADD_ONS,
} from "./pricing/index";

/**
 * Main Pricing Section Component
 *
 * Orchestrates the pricing calculator interface with:
 * - Service/product selection
 * - Add-ons selection
 * - Real-time price calculation
 * - Context sync for contact form integration
 *
 * Optimized with useMemo and useCallback to minimize re-renders.
 */
export function Pricing() {
  const t = useTranslations("pricing");

  // Use shared pricing context for state
  const {
    selectedProducts,
    setSelectedProducts,
    addOns,
    setAddOns,
    setEstimatedTotal,
  } = usePricing();

  // Local UI state - popover controls
  const [openService, setOpenService] = useState<ServiceType | null>(null);
  const [addOnsOpen, setAddOnsOpen] = useState(false);

  // Memoized callback: Toggle add-on selection
  const toggleAddOn = useCallback((addOn: AddOnType) => {
    setAddOns({ ...addOns, [addOn]: !addOns[addOn] });
  }, [addOns, setAddOns]);

  // Memoized callback: Select/deselect product
  const selectProduct = useCallback((service: ServiceType, product: string) => {
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
  }, [selectedProducts, setSelectedProducts]);

  // Memoized check: Is product selected
  const isProductSelected = useCallback((service: ServiceType, product: string) => {
    return selectedProducts.some((p) => p.service === service && p.product === product);
  }, [selectedProducts]);

  // Memoized calculation: Service selected count
  const getServiceSelectedCount = useCallback((service: ServiceType) => {
    return selectedProducts.filter((p) => p.service === service).length;
  }, [selectedProducts]);

  // Memoized calculation: Selected add-ons count
  const selectedAddOnsCount = useMemo(() => {
    return ADD_ONS.filter((a) => addOns[a]).length;
  }, [addOns]);

  // Memoized calculation: Total price (one-time + monthly)
  const calculatedPrice = useMemo(() => {
    let oneTime = 0;
    let monthly = 0;

    // Sum all selected products
    selectedProducts.forEach((product) => {
      oneTime += product.price;
    });

    // Sum all selected add-ons
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
          <PricingSelector
            openService={openService}
            onOpenChange={setOpenService}
            selectedProducts={selectedProducts}
            onSelectProduct={selectProduct}
            isProductSelected={isProductSelected}
            getServiceSelectedCount={getServiceSelectedCount}
          />

          <AddOnsSelector
            addOns={addOns}
            onToggleAddOn={toggleAddOn}
            selectedAddOnsCount={selectedAddOnsCount}
            addOnsOpen={addOnsOpen}
            onOpenChange={setAddOnsOpen}
          />
        </div>

        {/* Right: Price Summary */}
        <PricingCalculator
          selectedProducts={selectedProducts}
          addOns={addOns}
          calculatedPrice={calculatedPrice}
        />
      </div>
    </section>
  );
}

export default Pricing;
