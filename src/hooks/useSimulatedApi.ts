import { useState, useCallback } from "react";

interface SimulatedApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to simulate API calls with a configurable delay.
 * Wraps any async function with loading/error state management.
 */
export const useSimulatedApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async <T>(
      fn: () => Promise<T>,
      delayMs: number = 600
    ): Promise<{ success: boolean; data: T | null; error: string | null }> => {
      setLoading(true);
      setError(null);

      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        const result = await fn();
        setLoading(false);
        return { success: true, data: result, error: null };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        setLoading(false);
        return { success: false, data: null, error: errorMessage };
      }
    },
    []
  );

  return { loading, error, execute, setError };
};
