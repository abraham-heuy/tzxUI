// src/hooks/usePoolSlots.ts

import { useState, useEffect, useCallback } from 'react';
import poolSlotService, { type PoolSlot, type CreatePoolData, type AddSlotsData, type EditSlotsData } from '../services/poolSlotService';

export const usePoolSlots = () => {
  const [pools, setPools] = useState<PoolSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPools = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await poolSlotService.getPoolStatuses();
      setPools(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch pool slots');
    } finally {
      setLoading(false);
    }
  }, []);

  const createPool = useCallback(async (data: CreatePoolData) => {
    setLoading(true);
    setError(null);
    try {
      const newPool = await poolSlotService.createPool(data);
      await fetchPools(); // Refresh list
      return newPool;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create pool');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPools]);

  const addSlots = useCallback(async (data: AddSlotsData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPool = await poolSlotService.addSlots(data);
      await fetchPools(); // Refresh list
      return updatedPool;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add slots');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPools]);

  const editSlots = useCallback(async (data: EditSlotsData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPool = await poolSlotService.editSlots(data);
      await fetchPools(); // Refresh list
      return updatedPool;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to edit slots');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPools]);

  const resetSlots = useCallback(async (poolName: string) => {
    setLoading(true);
    setError(null);
    try {
      const resetPool = await poolSlotService.resetSlots(poolName);
      await fetchPools(); // Refresh list
      return resetPool;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset slots');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPools]);

  const checkAvailability = useCallback(async (poolName: string): Promise<boolean> => {
    try {
      return await poolSlotService.checkAvailability(poolName);
    } catch (err) {
      return false;
    }
  }, []);

  useEffect(() => {
    fetchPools();
  }, [fetchPools]);

  return {
    pools,
    loading,
    error,
    fetchPools,
    createPool,
    addSlots,
    editSlots,
    resetSlots,
    checkAvailability
  };
};