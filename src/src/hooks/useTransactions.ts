import { useCallback, useEffect, useState } from 'react';
import type { NewTransaction, Transaction } from '../services/api';
import { createTransaction, getTransactions, deleteTransaction } from '../services/api';

export default function useTransactions(enabled = true) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getTransactions();
      setTransactions(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  const addTransaction = useCallback(async (data: NewTransaction) => {
    setLoading(true);
    setError(null);
    try {
      const transaction = await createTransaction(data);
      setTransactions((current) => [transaction, ...current]);
      return transaction;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeTransaction = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteTransaction(id);
      setTransactions((current) => current.filter((t) => t.id !== id));
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      setTransactions([]);
      return;
    }
    fetchTransactions();
  }, [fetchTransactions, enabled]);

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    addTransaction
    , removeTransaction
  };
}
