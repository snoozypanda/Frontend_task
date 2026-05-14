import { useState, useEffect, useCallback, useMemo } from "react";
import { Transaction, TransactionType, PaginationState } from "../types";
import { generateId, getDateGroupLabel } from "../utils/formatting";
import { getItem, setItem, STORAGE_KEYS } from "../utils/storage";

const PAGE_SIZE = 4;

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    pageSize: PAGE_SIZE,
    totalPages: 1,
    totalItems: 0,
  });

  // Load transactions from AsyncStorage on mount
  useEffect(() => {
    const loadTransactions = async () => {
      const stored = await getItem<Transaction[]>(STORAGE_KEYS.TRANSACTIONS);
      if (stored) {
        setTransactions(stored);
        setPagination((prev) => ({
          ...prev,
          totalItems: stored.length,
          totalPages: Math.max(1, Math.ceil(stored.length / PAGE_SIZE)),
        }));
      }
      setIsLoaded(true);
    };
    loadTransactions();
  }, []);

  const logTransaction = useCallback(
    async (
      productSku: string,
      productName: string,
      type: TransactionType,
      quantity: number,
      location?: string
    ) => {
      const newTransaction: Transaction = {
        id: generateId(),
        productSku,
        productName,
        type,
        quantity: Math.abs(quantity),
        timestamp: new Date().toISOString(),
        location,
      };

      const updated = [newTransaction, ...transactions];
      setTransactions(updated);
      setPagination((prev) => ({
        ...prev,
        totalItems: updated.length,
        totalPages: Math.max(1, Math.ceil(updated.length / PAGE_SIZE)),
      }));
      await setItem(STORAGE_KEYS.TRANSACTIONS, updated);
    },
    [transactions]
  );

  // Paginated transactions
  const paginatedTransactions = useMemo(() => {
    const start = (pagination.currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return transactions.slice(start, end);
  }, [transactions, pagination.currentPage]);

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    paginatedTransactions.forEach((tx) => {
      const label = getDateGroupLabel(tx.timestamp);
      if (!groups[label]) groups[label] = [];
      groups[label].push(tx);
    });
    return groups;
  }, [paginatedTransactions]);

  // Recent transactions (last 3) for dashboard
  const recentTransactions = useMemo(
    () => transactions.slice(0, 3),
    [transactions]
  );

  // Summary stats
  const totalInbound = useMemo(
    () =>
      transactions
        .filter((t) => t.type === TransactionType.INBOUND)
        .reduce((sum, t) => sum + t.quantity, 0),
    [transactions]
  );

  const totalOutbound = useMemo(
    () =>
      transactions
        .filter((t) => t.type === TransactionType.OUTBOUND)
        .reduce((sum, t) => sum + t.quantity, 0),
    [transactions]
  );

  const totalAdjusted = useMemo(
    () =>
      transactions
        .filter((t) => t.type === TransactionType.ADJUST)
        .reduce((sum, t) => sum + t.quantity, 0),
    [transactions]
  );

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= pagination.totalPages) {
        setPagination((prev) => ({ ...prev, currentPage: page }));
      }
    },
    [pagination.totalPages]
  );

  const nextPage = useCallback(() => {
    goToPage(pagination.currentPage + 1);
  }, [pagination.currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(pagination.currentPage - 1);
  }, [pagination.currentPage, goToPage]);

  return {
    transactions,
    paginatedTransactions,
    groupedTransactions,
    recentTransactions,
    isLoaded,
    pagination,
    totalInbound,
    totalOutbound,
    totalAdjusted,
    logTransaction,
    goToPage,
    nextPage,
    prevPage,
  };
};
