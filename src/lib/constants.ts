export const APP_NAME = "Tresuru";
export const APP_DESCRIPTION =
  "Enterprise-grade corporate treasury management powered by Tempo Network";

// Privy App ID - for demo, use a placeholder; replace with real one for production
export const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "clxxxxxxxxxxxxxxxxxxxxxxxxx";

// Demo mode: simulates blockchain interactions when no wallet connected
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

// Role definitions for multi-sig treasury
export const ROLES = {
  ADMIN: "admin",
  TREASURER: "treasurer",
  APPROVER: "approver",
  VIEWER: "viewer",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// Approval thresholds
export const APPROVAL_THRESHOLDS = {
  LOW: { max: 10_000, requiredApprovals: 1, label: "Low Value" },
  MEDIUM: { max: 100_000, requiredApprovals: 2, label: "Medium Value" },
  HIGH: { max: 1_000_000, requiredApprovals: 3, label: "High Value" },
  CRITICAL: { max: Infinity, requiredApprovals: 4, label: "Critical Value" },
} as const;

export const TRANSACTION_CATEGORIES = [
  "Payroll",
  "Vendor Payment",
  "Investment",
  "Operating Expense",
  "Tax Payment",
  "Intercompany Transfer",
  "Dividend",
  "Debt Service",
  "Capital Expenditure",
  "Other",
] as const;

export type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[number];
