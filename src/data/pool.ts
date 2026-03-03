import { Shield, TrendingUp, Users } from 'lucide-react';

export const pools = [
  {
    id: 'stable',
    name: 'Stable Income Pool',
    minAmount: 5000,
    maxAmount: 299999, // Updated to M-Pesa limit
    risk: 'Low',
    returns: '5-8%',
    icon: Shield,
    color: 'green',
    description: 'Conservative strategy, ideal for beginners',
    fee: 0.025 // 2.5% fee
  },
  {
    id: 'balanced',
    name: 'Balanced Growth Pool',
    minAmount: 20000,
    maxAmount: 299999, // Updated to M-Pesa limit
    risk: 'Medium',
    returns: '10-15%',
    icon: TrendingUp,
    color: 'blue',
    description: 'Mixed strategy for balanced returns',
    fee: 0.03 // 3% fee
  },
  {
    id: 'high',
    name: 'High Yield Pool',
    minAmount: 100000,
    maxAmount: 299999, 
    risk: 'High',
    returns: '20-30%',
    icon: Users,
    color: 'purple',
    description: 'Aggressive strategy for maximum returns',
    fee: 0.04 // 4% fee
  }
];