import { useState, useEffect } from 'react';
import axios from 'axios';
import useDebounce from './useDebounce';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export default function useSearch(query) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 2) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const performSearch = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/search?q=${encodeURIComponent(debouncedQuery)}`,
          { cancelToken: source.token }
        );
        if (response.data && response.data.status === 'success') {
          setResults(response.data.data);
        } else {
          throw new Error(response.data?.message || 'Search failed');
        }
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError(err.message || 'An error occurred during search');
        }
      } finally {
        setLoading(false);
      }
    };

    performSearch();

    return () => {
      // Cancel the request on unmount or before running the next search
      source.cancel('Operation canceled by the user.');
    };
  }, [debouncedQuery]);

  return { results, loading, error };
}
