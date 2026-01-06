"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ServiceType = "customSoftware" | "businessAutomation" | "aiAgents";
type AddOnType =
  | "prioritySupport"
  | "dedicatedSlack"
  | "monthlyReporting"
  | "slaGuarantee"
  | "trainingWorkshops"
  | "codeDocumentation"
  | "multiLanguageSupport"
  | "apiIntegration"
  | "dataAnalyticsDashboard"
  | "securityAudit";

export type SelectedProduct = {
  service: ServiceType;
  product: string;
  price: number;
};

type PricingContextType = {
  selectedProducts: SelectedProduct[];
  setSelectedProducts: (products: SelectedProduct[]) => void;
  addOns: Record<AddOnType, boolean>;
  setAddOns: (addOns: Record<AddOnType, boolean>) => void;
  estimatedTotal: { oneTime: number; monthly: number };
  setEstimatedTotal: (total: { oneTime: number; monthly: number }) => void;
  clearSelections: () => void;
};

const defaultAddOns: Record<AddOnType, boolean> = {
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
};

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export function PricingProvider({ children }: { children: ReactNode }) {
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [addOns, setAddOns] = useState<Record<AddOnType, boolean>>(defaultAddOns);
  const [estimatedTotal, setEstimatedTotal] = useState({ oneTime: 0, monthly: 0 });

  const clearSelections = () => {
    setSelectedProducts([]);
    setAddOns(defaultAddOns);
    setEstimatedTotal({ oneTime: 0, monthly: 0 });
  };

  return (
    <PricingContext.Provider
      value={{
        selectedProducts,
        setSelectedProducts,
        addOns,
        setAddOns,
        estimatedTotal,
        setEstimatedTotal,
        clearSelections,
      }}
    >
      {children}
    </PricingContext.Provider>
  );
}

export function usePricing() {
  const context = useContext(PricingContext);
  if (context === undefined) {
    throw new Error("usePricing must be used within a PricingProvider");
  }
  return context;
}

// Helper to format pricing data for webhook
export function formatPricingForWebhook(
  selectedProducts: SelectedProduct[],
  addOns: Record<AddOnType, boolean>,
  estimatedTotal: { oneTime: number; monthly: number }
) {
  const selectedAddOns = Object.entries(addOns)
    .filter(([, selected]) => selected)
    .map(([name]) => name);

  return {
    products: selectedProducts.map((p) => ({
      category: p.service,
      product: p.product,
      price: p.price,
    })),
    addOns: selectedAddOns,
    estimatedTotal,
  };
}
