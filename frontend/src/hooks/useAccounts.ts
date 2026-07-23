import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { accountsService } from "../services/accountsService";
import type { AccountInput } from "../types/accounts";

export const ACCOUNTS_QUERY_KEY = ["accounts"];

export function useAccounts() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ACCOUNTS_QUERY_KEY,
    queryFn: accountsService.getAccounts,
  });

  const createMutation = useMutation({
    mutationFn: (input: AccountInput) => accountsService.createAccount(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: AccountInput }) => 
      accountsService.updateAccount(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => accountsService.deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
  });

  return {
    accounts: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    createAccount: createMutation.mutateAsync,
    updateAccount: updateMutation.mutateAsync,
    deleteAccount: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
