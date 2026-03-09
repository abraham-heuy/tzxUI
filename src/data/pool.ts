import { Shield, TrendingUp, Users, Crown, FlaskRound as Flask } from 'lucide-react';

export const pools = [
  {
    id: 'test',
    name: 'Test Pool',
    amount: 1, // Fixed at KES 1 for testing
    risk: 'Test',
    returns: 'Test',
    icon: Flask,
    color: 'gray',
    description: 'Test the platform with just KES 1',
    fee: 0, // No fee for test pool
    returnPeriod: 'Instant'
  },
  {
    id: 'starter',
    name: 'Starter Pool',
    amount: 2700, // Fixed at $20 equivalent
    risk: 'Low',
    returns: '5-8%',
    icon: Shield,
    color: 'green',
    description: 'Perfect for beginners',
    fee: 0.025, // 2.5% fee
    returnPeriod: '3 days'
  },
  {
    id: 'basic',
    name: 'Basic Pool',
    amount: 6500, // Fixed at $50 equivalent
    risk: 'Low-Medium',
    returns: '8-12%',
    icon: Shield,
    color: 'teal',
    description: 'Steady growth with minimal risk',
    fee: 0.025, // 2.5% fee
    returnPeriod: '3 days'
  },
  {
    id: 'standard',
    name: 'Standard Pool',
    amount: 13300, // Fixed at $100 equivalent
    risk: 'Medium',
    returns: '12-18%',
    icon: TrendingUp,
    color: 'blue',
    description: 'Balanced returns for intermediate investors',
    fee: 0.03, // 3% fee
    returnPeriod: '3 days'
  },
  {
    id: 'personal',
    name: 'Personal Pool',
    amount: 40000, // Fixed at $300 equivalent
    risk: 'Medium-High',
    returns: '18-25%',
    icon: Crown,
    color: 'purple',
    description: 'Exclusive pool for serious investors',
    fee: 0.035, // 3.5% fee
    returnPeriod: '3 days'
  },
  {
    id: 'premium',
    name: 'Premium Pool',
    amount: 100000, // Fixed at higher tier
    risk: 'High',
    returns: '25-35%',
    icon: Users,
    color: 'amber',
    description: 'Maximum returns for experienced investors',
    fee: 0.04, // 4% fee
    returnPeriod: '3 days'
  }
];