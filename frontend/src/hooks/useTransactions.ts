import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsService, type TransactionFilters } from "../services/transactionsService";
import type { TransactionInput } from "../types/transactions";
import { ACCOUNTS_QUERY_KEY } from "./useAccounts";

export const TRANSACTIONS_QUERY_KEY = ["transactions"];

export function useTransactions(filters?: TransactionFilters) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [TRANSACTIONS_QUERY_KEY[0], filters],
    queryFn: () => transactionsService.getTransactions(filters),
  });

  const createMutation = useMutation({
    mutationFn: (input: TransactionInput) => transactionsService.createTransaction(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => transactionsService.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
  });

  return {
    transactions: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createTransaction: createMutation.mutateAsync,
    deleteTransaction: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
