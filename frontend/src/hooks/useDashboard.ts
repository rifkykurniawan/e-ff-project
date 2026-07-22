import { useQuery } from "@tanstack/react-query";
import { reportsService } from "../services/reports";

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await reportsService.getDashboardData();
      return response.data;
    },
  });
};
