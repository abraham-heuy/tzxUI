// src/hooks/usePoolData.ts

import { useState, useEffect } from 'react';
import { type Pool, getPools, getPoolById, getPoolByName, getAvailablePools, refreshPools } from '../data/pool';

export const usePoolData = () => {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPools = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPools();
      setPools(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch pools');
    } finally {
      setLoading(false);
    }
  };

  const fetchPoolById = async (id: string) => {
    try {
      return await getPoolById(id);
    } catch (err) {
      console.error('Error fetching pool:', err);
      return null;
    }
  };

  const fetchPoolByName = async (name: string) => {
    try {
      return await getPoolByName(name);
    } catch (err) {
      console.error('Error fetching pool:', err);
      return null;
    }
  };

  const fetchAvailablePools = async () => {
    try {
      return await getAvailablePools();
    } catch (err) {
      console.error('Error fetching available pools:', err);
      return [];
    }
  };

  const forceRefresh = async () => {
    const data = await refreshPools();
    setPools(data);
    return data;
  };

  useEffect(() => {
    fetchPools();
  }, []);

  return {
    pools,
    loading,
    error,
    fetchPools,
    fetchPoolById,
    fetchPoolByName,
    fetchAvailablePools,
    refreshPools: forceRefresh
  };
};