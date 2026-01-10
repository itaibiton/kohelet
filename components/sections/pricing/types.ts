// Shared types for Pricing components

// Pricing constants in NIS - all "starting from" prices
export const PRICING = {
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

export type ServiceType = "customSoftware" | "businessAutomation" | "aiAgents";
export type CustomSoftwareProduct = keyof typeof PRICING.customSoftware;
export type BusinessAutomationProduct = keyof typeof PRICING.businessAutomation;
export type AIAgentProduct = keyof typeof PRICING.aiAgents;
export type AddOnType = keyof typeof PRICING.addOns;

export const SERVICE_PRODUCTS: Record<ServiceType, string[]> = {
  customSoftware: ["landingPage", "onlineStore", "blog", "webApp"],
  businessAutomation: ["crmIntegration", "emailAutomation", "workflowAutomation"],
  aiAgents: ["chatbot", "customerSupport", "dataAnalysis"],
};

export const ADD_ONS: AddOnType[] = [
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
