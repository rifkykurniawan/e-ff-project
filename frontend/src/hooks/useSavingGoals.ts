import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { savingGoalsService } from "../services/savingGoalsService";
import type { SavingGoalInput } from "../types/savingGoals";

export const SAVING_GOALS_QUERY_KEY = ["saving_goals"];

export function useSavingGoals() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: SAVING_GOALS_QUERY_KEY,
    queryFn: savingGoalsService.getSavingGoals,
  });

  const createMutation = useMutation({
    mutationFn: (input: SavingGoalInput) => savingGoalsService.createSavingGoal(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SAVING_GOALS_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<SavingGoalInput> }) => 
      savingGoalsService.updateSavingGoal(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SAVING_GOALS_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => savingGoalsService.deleteSavingGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SAVING_GOALS_QUERY_KEY });
    },
  });

  return {
    savingGoals: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    createSavingGoal: createMutation.mutateAsync,
    updateSavingGoal: updateMutation.mutateAsync,
    deleteSavingGoal: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
