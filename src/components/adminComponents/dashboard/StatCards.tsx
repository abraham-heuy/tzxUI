import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  Clock,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { adminService, type DashboardStats } from '../../../services/admin';

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon: React.ElementType;
  color: string;
  isLoading?: boolean;
}

const StatCard = ({ title, value, change, icon: Icon, color, isLoading }: StatCardProps) => {
  const isPositive = change && change > 0;

  if (isLoading) {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
      >
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${color} rounded-xl opacity-50`} />
            <div className="w-16 h-6 bg-gray-200 rounded-full" />
          </div>
          <div className="h-8 w-24 bg-gray-200 rounded mb-1" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
    </motion.div>
  );
};

const StatsCards = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getDashboardStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
      setError('Failed to load statistics');
    } finally {
      setIsLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `KES ${(amount / 1000000).toFixed(1)}M`;
  };

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  // Calculate percentage change (you can modify this based on your data)
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchStats}
          className="mt-2 text-sm text-[#ff444f] hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Investments',
      value: stats ? formatCurrency(stats.investments.total) : 'KES 0',
      change: stats ? calculateChange(stats.investments.monthly, stats.investments.total * 0.1) : undefined,
      icon: TrendingUp,
      color: 'bg-green-500',
      isLoading
    },
    {
      title: 'Active Investors',
      value: stats ? formatNumber(stats.users.total) : '0',
      change: stats ? calculateChange(stats.users.newThisMonth, stats.users.total * 0.1) : undefined,
      icon: Users,
      color: 'bg-blue-500',
      isLoading
    },
    {
      title: 'Pending Approvals',
      value: stats ? formatNumber(stats.investments.count.pending) : '0',
      change: stats ? -5 : undefined, // You can calculate this from historical data
      icon: Clock,
      color: 'bg-yellow-500',
      isLoading
    },
    {
      title: 'Total Transactions',
      value: stats ? formatNumber(stats.investments.count.total) : '0',
      change: stats ? calculateChange(stats.investments.count.total, stats.investments.count.total * 0.9) : undefined,
      icon: CreditCard,
      color: 'bg-purple-500',
      isLoading
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {statCards.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsCards;