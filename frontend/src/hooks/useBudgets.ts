import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { budgetsService } from "../services/budgetsService";
import type { BudgetInput } from "../types/budgets";

export const BUDGETS_QUERY_KEY = ["budgets"];

export function useBudgets(year: number, month: number) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [...BUDGETS_QUERY_KEY, year, month],
    queryFn: () => budgetsService.getBudgets(year, month),
  });

  const createMutation = useMutation({
    mutationFn: (input: BudgetInput) => budgetsService.createBudget(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGETS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<BudgetInput> }) => 
      budgetsService.updateBudget(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGETS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => budgetsService.deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGETS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  return {
    budgets: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    createBudget: createMutation.mutateAsync,
    updateBudget: updateMutation.mutateAsync,
    deleteBudget: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
