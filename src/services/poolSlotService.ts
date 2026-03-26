// src/services/poolSlotService.ts

import api from './api';

export interface PoolSlot {
  poolName: string;
  totalSlots: number | string;
  availableSlots: number | string;
  filledCount: number;
  targetAmount: number;
  status: string;
  progress: number;
}

export interface CreatePoolData {
  poolName: string;
  totalSlots: number;
  targetAmount?: number;
}

export interface AddSlotsData {
  poolName: string;
  additionalSlots: number;
}

export interface EditSlotsData {
  poolName: string;
  totalSlots: number;
}

export interface PoolAvailability {
  exists: boolean;
  available: boolean;
  availableSlots: number;
  totalSlots: number;
  filledCount: number;
  targetAmount: number;
}

class PoolSlotService {
  private baseUrl = '/admin';

  /**
   * Get all pool slot statuses
   */
  async getPoolStatuses(): Promise<PoolSlot[]> {
    try {
      const response = await api.get(`${this.baseUrl}/status`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching pool statuses:', error);
      throw error;
    }
  }

  /**
   * Get availability for a specific pool
   */
  async getPoolAvailability(poolName: string): Promise<PoolAvailability> {
    try {
      const response = await api.get(`${this.baseUrl}/availability/${encodeURIComponent(poolName)}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching availability for ${poolName}:`, error);
      throw error;
    }
  }

  /**
   * Create a new pool (admin only)
   */
  async createPool(data: CreatePoolData): Promise<PoolSlot> {
    try {
      const response = await api.post(`${this.baseUrl}/create`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating pool:', error);
      throw error;
    }
  }

  /**
   * Add slots to an existing pool (admin only)
   */
  async addSlots(data: AddSlotsData): Promise<PoolSlot> {
    try {
      const response = await api.post(`${this.baseUrl}/add-slots`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error adding slots:', error);
      throw error;
    }
  }

  /**
   * Edit slots - set exact number of total slots (admin only)
   */
  async editSlots(data: EditSlotsData): Promise<PoolSlot> {
    try {
      const response = await api.put(`${this.baseUrl}/edit-slots`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error editing slots:', error);
      throw error;
    }
  }

  /**
   * Reset pool slots (admin only)
   */
  async resetSlots(poolName: string): Promise<PoolSlot> {
    try {
      const response = await api.post(`${this.baseUrl}/reset-slots`, { poolName });
      return response.data.data;
    } catch (error) {
      console.error('Error resetting slots:', error);
      throw error;
    }
  }

  /**
   * Check if pool has available slots (for frontend validation)
   */
  async checkAvailability(poolName: string): Promise<boolean> {
    try {
      const availability = await this.getPoolAvailability(poolName);
      return availability.available;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get formatted pool status for display
   */
  async getFormattedPoolStatuses(): Promise<any[]> {
    const pools = await this.getPoolStatuses();
    return pools.map(pool => ({
      ...pool,
      progressPercentage: typeof pool.progress === 'number' ? pool.progress : 0,
      statusBadge: this.getStatusBadge(pool.status),
      displaySlots: typeof pool.totalSlots === 'number' 
        ? `${pool.availableSlots}/${pool.totalSlots}`
        : pool.totalSlots,
      isUnlimited: pool.totalSlots === 'Unlimited'
    }));
  }

  private getStatusBadge(status: string): { color: string; text: string } {
    switch (status) {
      case 'active':
        return { color: 'bg-green-100 text-green-800', text: 'Active' };
      case 'full':
        return { color: 'bg-red-100 text-red-800', text: 'Full' };
      case 'closed':
        return { color: 'bg-gray-100 text-gray-800', text: 'Closed' };
      default:
        return { color: 'bg-gray-100 text-gray-800', text: status };
    }
  }
}

export default new PoolSlotService();