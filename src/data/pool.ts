import { Shield, TrendingUp, Users } from 'lucide-react';

export const pools = [
  {
    id: 'starter',
    name: 'Starter Pool',
    usdAmount: 20,
    returns: '20-35%',
    returnPeriod: '7 days',
    icon: Shield,
    color: 'green',
    description: 'Perfect for beginners. Start with just $20.',
    fee: 0.02,
    features: ['7-day return period', 'Up to 35% returns']
  },
  {
    id: 'basic',
    name: 'Basic Pool',
    usdAmount: 50,
    returns: '25-40%',
    returnPeriod: '7 days',
    icon: Shield,
    color: 'teal',
    description: 'Steady growth with minimal risk.',
    fee: 0.025,
    features: ['7-day return period', 'Up to 40% returns']
  },
  {
    id: 'growth',
    name: 'Growth Pool',
    usdAmount: 100,
    returns: '35-50%',
    returnPeriod: '3 days',
    icon: TrendingUp,
    color: 'blue',
    description: 'High returns for intermediate investors.',
    fee: 0.03,
    features: ['3-day return period', 'Up to 50% returns']
  },
  {
    id: 'premium',
    name: 'Premium Pool',
    usdAmount: 300,
    returns: '45-60%',
    returnPeriod: '3 days',
    icon: TrendingUp,
    color: 'purple',
    description: 'Premium returns for serious investors.',
    fee: 0.035,
    features: ['3-day return period', 'Up to 60% returns']
  },
  {
    id: 'elite',
    name: 'Elite Pool',
    usdAmount: 750,
    returns: '55-75%',
    returnPeriod: '3 days',
    icon: Users,
    color: 'amber',
    description: 'Maximum returns for experienced investors.',
    fee: 0.04,
    features: ['3-day return period', 'Up to 75% returns']
  }
];