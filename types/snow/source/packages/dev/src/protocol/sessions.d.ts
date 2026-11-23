export type InspectionPrivacyMode = "metadata" | "values";
export type InspectionSessionStatus = "active" | "cancelled" | "completed" | "expired" | "failed";
export interface InspectionBudgets {
    captures: number;
    handles: number;
}
export interface InspectionSessionSummary {
    id: string;
    status: InspectionSessionStatus;
    privacy: InspectionPrivacyMode;
    createdAt: number;
    lastActiveAt: number;
    expiresAt: number;
    handles: number;
    resources: number;
    budgets: InspectionBudgets;
    captures: number;
    failure?: string;
}
