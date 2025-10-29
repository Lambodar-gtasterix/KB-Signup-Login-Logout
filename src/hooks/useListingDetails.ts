import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';

type Fetcher<T> = () => Promise<T>;

interface UseListingDetailsOptions {
  defaultErrorMessage?: string;
}

interface UseListingDetailsResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setData: Dispatch<SetStateAction<T | null>>;
}

export const useListingDetails = <T,>(
  fetchListing: Fetcher<T>,
  options: UseListingDetailsOptions = {}
): UseListingDetailsResult<T> => {
  const { defaultErrorMessage = 'Failed to load details' } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchListing();
      setData(result);
      setError(null);
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || defaultErrorMessage;
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [fetchListing, defaultErrorMessage]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const result = await fetchListing();
        if (!mounted) return;
        setData(result);
        setError(null);
      } catch (err: any) {
        if (!mounted) return;
        const message = err?.response?.data?.message || err?.message || defaultErrorMessage;
        setError(message);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [fetchListing, defaultErrorMessage]);

  const refetch = useCallback(async () => {
    await load();
  }, [load]);

  return { data, loading, error, refetch, setData };
};

export default useListingDetails;
