import type { EnvelopeResponse } from "../types/auth";
import type { DashboardData } from "../types/reports";

export const reportsService = {
  getDashboardData: async (): Promise<EnvelopeResponse<DashboardData>> => {
    // Mock data for Milestone 1. 
    // In future milestones, this will be replaced with direct Supabase queries.
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Dashboard data loaded (Mock)",
          data: {
            total_balance: 0,
            income_this_month: 0,
            expense_this_month: 0,
            net_balance: 0,
            recent_transactions: [],
            saving_goals: [],
            budget_summary: []
          }
        });
      }, 500);
    });
  }
};
