import apiClient from "./apiClient";
import type { EnvelopeResponse } from "../types/auth";
import type { DashboardData } from "../types/reports";

export const reportsService = {
  getDashboardData: async (): Promise<EnvelopeResponse<DashboardData>> => {
    const response = await apiClient.get<EnvelopeResponse<DashboardData>>("/reports/dashboard");
    return response.data;
  }
};
