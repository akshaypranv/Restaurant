import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export default function useMenuData(vegFilter) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch full categorized menu.
      const url = `${API_BASE_URL}/api/v1/menu${vegFilter ? '?veg=true' : ''}`;
      const response = await axios.get(url);
      if (response.data && response.data.status === 'success') {
        setData(response.data.data);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch menu');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching menu data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [vegFilter]);

  return { data, loading, error, refetch: fetchData };
}
