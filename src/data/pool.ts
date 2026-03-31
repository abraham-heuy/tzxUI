// src/data/pool.ts

import { Shield, TrendingUp, Users, Crown, TestTube } from 'lucide-react';
import poolSlotService from '../services/poolSlotService';

export interface Pool {
  id: string;
  name: string;
  usdAmount: number;
  target: number;
  slotsRemaining: number;
  totalSlots: number;
  profit: number;
  returnPeriod: string;
  returnPeriodDisplay: string;
  description: string;
  icon: any;
  color: string;
  fee: number;
  risk: string;
  isAvailable?: boolean;
}

// Base static pool configuration (without dynamic slot data)
const basePools: Omit<Pool, 'slotsRemaining' | 'totalSlots' | 'isAvailable'>[] = [
  {
    id: 'test',
    name: 'Test Pool',
    usdAmount: 0.151, // ~1 KES at 130 KES/USD
    target: 1, // $1 target (about 130 KES)
    profit: 55,
    returnPeriod: '1 day',
    returnPeriodDisplay: '1 day',
    description: 'TEST POOL: Small amount for testing payments. 55% profit after 1 day.',
    icon: TestTube,
    color: 'gray',
    fee: 0.01,
    risk: 'Very Low'
  },
  {
    id: 'starter',
    name: 'Starter Pool',
    usdAmount: 20,
    target: 1000,
    profit: 55,
    returnPeriod: '7 days',
    returnPeriodDisplay: '7 days',
    description: 'Pool with target: $1,000. 55% profit after 7 days.',
    icon: Shield,
    color: 'green',
    fee: 0.02,
    risk: 'Low'
  },
  {
    id: 'basic',
    name: 'Basic Pool',
    usdAmount: 50,
    target: 2500,
    profit: 55,
    returnPeriod: '7 days',
    returnPeriodDisplay: '7 days',
    description: 'Pool with target: $2,500. 55% profit after 7 days.',
    icon: Shield,
    color: 'teal',
    fee: 0.025,
    risk: 'Low-Medium'
  },
  {
    id: 'growth',
    name: 'Growth Pool',
    usdAmount: 100,
    target: 800,
    profit: 55,
    returnPeriod: '3 days',
    returnPeriodDisplay: '3 days',
    description: 'EXCLUSIVE: 1 person pool. Target: $800 with 55% profit.',
    icon: Crown,
    color: 'blue',
    fee: 0.03,
    risk: 'Medium'
  },
  {
    id: 'premium',
    name: 'Premium Pool',
    usdAmount: 300,
    target: 0,
    profit: 55,
    returnPeriod: 'Any time',
    returnPeriodDisplay: 'Any time (Daily)',
    description: 'Custom target. Withdraw any profit daily. 55% profit.',
    icon: TrendingUp,
    color: 'purple',
    fee: 0.035,
    risk: 'Medium-High'
  },
  {
    id: 'elite',
    name: 'Elite Pool',
    usdAmount: 750,
    target: 0,
    profit: 55,
    returnPeriod: 'Any time',
    returnPeriodDisplay: 'Any time (Instant)',
    description: 'Custom target. Withdraw any profit instantly. 55% profit.',
    icon: Users,
    color: 'amber',
    fee: 0.04,
    risk: 'High'
  }
];

// Cache for dynamic pools data
let cachedPools: Pool[] | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 30000; // 30 seconds cache

/**
 * Fetch dynamic slot data from backend and merge with static pool config
 */
async function fetchDynamicPools(): Promise<Pool[]> {
  try {
    const slotStatuses = await poolSlotService.getPoolStatuses();
    
    return basePools.map(basePool => {
      const slotData = slotStatuses.find(s => s.poolName === basePool.name);
      
      // Handle Test Pool - 10 slots for testing (not from database)
      if (basePool.name === 'Test Pool') {
        return {
          ...basePool,
          slotsRemaining: 10,
          totalSlots: 10,
          isAvailable: true,
          description: `TEST POOL: 10 slots available. 55% profit after 1 day. Use for testing payments.`
        };
      }
      
      // Handle Premium and Elite (unlimited slots)
      if (basePool.name === 'Premium Pool' || basePool.name === 'Elite Pool') {
        return {
          ...basePool,
          slotsRemaining: -1,
          totalSlots: -1,
          isAvailable: true,
          description: `${basePool.description} Unlimited slots available.`
        };
      }
      
      // Pool has slot tracking from database
      if (slotData && slotData.totalSlots !== 'Unlimited') {
        const availableSlots = typeof slotData.availableSlots === 'number' ? slotData.availableSlots : 0;
        const totalSlots = typeof slotData.totalSlots === 'number' ? slotData.totalSlots : 0;
        
        return {
          ...basePool,
          slotsRemaining: availableSlots,
          totalSlots: totalSlots,
          isAvailable: availableSlots > 0,
          description: `${basePool.description} ${availableSlots}/${totalSlots} slots remaining.`
        };
      }
      
      // Pool not configured yet - fallback
      return {
        ...basePool,
        slotsRemaining: 0,
        totalSlots: 0,
        isAvailable: false,
        description: `${basePool.description} Currently full. Check back later for available slots.`
      };
    });
  } catch (error) {
    console.error('Error fetching dynamic pool data:', error);
    // Return fallback static data
    return getFallbackPools();
  }
}

/**
 * Get fallback pools when API fails
 */
function getFallbackPools(): Pool[] {
  return basePools.map(basePool => {
    // Set default slots based on pool id
    let slotsRemaining = 0;
    let totalSlots = 0;
    let description = basePool.description;
    
    switch(basePool.id) {
      case 'test':
        slotsRemaining = 10;
        totalSlots = 10;
        description = 'TEST POOL: 10 slots available. 55% profit after 1 day.';
        break;
      case 'starter':
        slotsRemaining = 10;
        totalSlots = 10;
        description = `10 slots available. Target: $${basePool.target} with 55% profit.`;
        break;
      case 'basic':
        slotsRemaining = 6;
        totalSlots = 6;
        description = `6 slots available. Target: $${basePool.target} with 55% profit.`;
        break;
      case 'growth':
        slotsRemaining = 1;
        totalSlots = 1;
        description = `EXCLUSIVE: 1 person pool. Target: $${basePool.target} with 55% profit.`;
        break;
      case 'premium':
      case 'elite':
        slotsRemaining = -1;
        totalSlots = -1;
        break;
    }
    
    return {
      ...basePool,
      slotsRemaining,
      totalSlots,
      isAvailable: basePool.id !== 'premium' && basePool.id !== 'elite',
      description
    };
  });
}

/**
 * Get pools with dynamic slot data (with caching)
 */
export async function getPools(): Promise<Pool[]> {
  const now = Date.now();
  
  // Return cached data if still valid
  if (cachedPools && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedPools;
  }
  
  // Fetch fresh data
  cachedPools = await fetchDynamicPools();
  lastFetchTime = now;
  return cachedPools;
}

/**
 * Get a single pool by ID with dynamic data
 */
export async function getPoolById(id: string): Promise<Pool | null> {
  const pools = await getPools();
  return pools.find(pool => pool.id === id) || null;
}

/**
 * Get a single pool by name with dynamic data
 */
export async function getPoolByName(name: string): Promise<Pool | null> {
  const pools = await getPools();
  return pools.find(pool => pool.name === name) || null;
}

/**
 * Get available pools (with slots remaining)
 */
export async function getAvailablePools(): Promise<Pool[]> {
  const pools = await getPools();
  return pools.filter(pool => {
    // Test, Premium and Elite are always available
    if (pool.name === 'Test Pool' || pool.name === 'Premium Pool' || pool.name === 'Elite Pool') return true;
    return pool.slotsRemaining > 0;
  });
}

/**
 * Force refresh pool data (bypass cache)
 */
export async function refreshPools(): Promise<Pool[]> {
  cachedPools = await fetchDynamicPools();
  lastFetchTime = Date.now();
  return cachedPools;
}

/**
 * Sync static pool data with dynamic slots (for components that need sync access)
 * This maintains backward compatibility with existing imports
 */
export let pools: Pool[] = basePools.map(basePool => {
  let slotsRemaining = 0;
  let totalSlots = 0;
  
  switch(basePool.id) {
    case 'test':
      slotsRemaining = 10;
      totalSlots = 10;
      break;
    case 'starter':
      slotsRemaining = 10;
      totalSlots = 10;
      break;
    case 'basic':
      slotsRemaining = 6;
      totalSlots = 6;
      break;
    case 'growth':
      slotsRemaining = 1;
      totalSlots = 1;
      break;
    default:
      slotsRemaining = 0;
      totalSlots = 0;
  }
  
  return {
    ...basePool,
    slotsRemaining,
    totalSlots
  };
});

// Initialize pools with dynamic data on module load (non-blocking)
getPools().then(dynamicPools => {
  // Update the exported pools array for components that are already using it
  // This is a reference update - components using the imported `pools` array
  // will need to be updated to use the async functions instead
  Object.assign(pools, dynamicPools);
}).catch(console.error);

// Export a hook for React components
export const usePools = () => {
  return { getPools, getPoolById, getPoolByName, getAvailablePools, refreshPools };
};