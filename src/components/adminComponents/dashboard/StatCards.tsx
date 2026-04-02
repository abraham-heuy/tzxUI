// src/components/adminComponents/dashboard/StatCards.tsx
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Clock,
  ArrowUp,
  ArrowDown,
  UserCheck
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { adminService } from '../../../services/admin';

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  change?: number;
  icon: React.ElementType;
  color: string;
  isLoading?: boolean;
}

const StatCard = ({ title, value, subValue, change, icon: Icon, color, isLoading }: StatCardProps) => {
  const isPositive = change && change > 0;

  if (isLoading) {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
      >
        <div className="flex flex-col items-center justify-center h-32">
          <div className="w-8 h-8 border-4 border-[#ff444f] border-t-transparent rounded-full animate-spin mb-2" />
          <p className="text-gray-400 text-sm">Loading...</p>
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
      {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
    </motion.div>
  );
};

const StatsCards = () => {
  const [stats, setStats] = useState<any>(null);
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

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `KES ${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `KES ${(amount / 1000).toFixed(1)}K`;
    }
    return `KES ${amount.toLocaleString()}`;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
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

  // Loading state - show spinner
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[1, 2, 3, 4].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex flex-col items-center justify-center h-32">
              <div className="w-8 h-8 border-4 border-[#ff444f] border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-gray-400 text-sm">Loading...</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Safe access with optional chaining and fallbacks
  const statCards = [
    {
      title: 'Total Invested',
      value: stats?.quickStats?.totalInvestedAmount ? formatCurrency(stats.quickStats.totalInvestedAmount) : 'KES 0',
      subValue: stats?.quickStats?.totalInvestments ? `${formatNumber(stats.quickStats.totalInvestments)} investments` : '',
      change: stats?.quickStats?.approvalRate,
      icon: TrendingUp,
      color: 'bg-green-500',
      isLoading: false
    },
    {
      title: 'Active Investors',
      value: stats?.quickStats?.approvedUsers ? formatNumber(stats.quickStats.approvedUsers) : '0',
      subValue: stats?.quickStats?.activeUsers ? `${stats.quickStats.activeUsers} with investments` : '',
      change: stats?.quickStats?.engagementRate,
      icon: Users,
      color: 'bg-blue-500',
      isLoading: false
    },
    {
      title: 'Pending Approvals',
      value: stats?.quickStats?.pendingUsers ? formatNumber(stats.quickStats.pendingUsers) : '0',
      subValue: stats?.quickStats?.openTickets ? `${formatNumber(stats.quickStats.openTickets)} open tickets` : '',
      change: undefined,
      icon: Clock,
      color: 'bg-yellow-500',
      isLoading: false
    },
    {
      title: 'Approval Rate',
      value: stats?.quickStats?.approvalRate ? `${stats.quickStats.approvalRate}%` : '0%',
      subValue: stats?.quickStats?.totalUsers ? `${formatNumber(stats.quickStats.totalUsers)} total users` : '',
      change: undefined,
      icon: UserCheck,
      color: 'bg-purple-500',
      isLoading: false
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