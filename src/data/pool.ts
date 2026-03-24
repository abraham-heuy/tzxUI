import { Shield, TrendingUp, Users, Crown } from 'lucide-react';

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
}

export const pools: Pool[] = [
  {
    id: 'starter',
    name: 'Starter Pool',
    usdAmount: 20,
    target: 1000,
    slotsRemaining: 10,
    totalSlots: 10,
    profit: 55,
    returnPeriod: '7 days',
    returnPeriodDisplay: '7 days',
    description: '10 slots available. Target: $1,000 with 55% profit.',
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
    slotsRemaining: 6,
    totalSlots: 6,
    profit: 55,
    returnPeriod: '7 days',
    returnPeriodDisplay: '7 days',
    description: '6 slots available. Target: $2,500 with 55% profit.',
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
    slotsRemaining: 1,
    totalSlots: 1,
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
    slotsRemaining: 0,
    totalSlots: 0,
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
    slotsRemaining: 0,
    totalSlots: 0,
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