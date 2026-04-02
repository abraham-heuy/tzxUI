// src/components/adminComponents/dashboard/TopInvestors.tsx
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Trophy, Medal, Star, TrendingUp } from 'lucide-react';
import { adminService } from '../../../services/admin';

const formatAmount = (amount: number) => {
  if (amount >= 1000000) return `KES ${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `KES ${(amount / 1000).toFixed(1)}K`;
  return `KES ${amount.toLocaleString()}`;
};

const TopInvestors = () => {
  const [investors, setInvestors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopInvestors();
  }, []);

  const fetchTopInvestors = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getDashboardStats();
      setInvestors(response.data.topInvestors || []);
    } catch (err) {
      console.error('Failed to fetch top investors:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy size={16} className="text-yellow-500" />;
      case 1: return <Medal size={16} className="text-gray-400" />;
      case 2: return <Star size={16} className="text-amber-500" />;
      default: return <span className="text-xs font-medium text-gray-400">#{index + 1}</span>;
    }
  };

  const getRankBg = (index: number) => {
    switch (index) {
      case 0: return 'bg-gradient-to-br from-yellow-100 to-yellow-50';
      case 1: return 'bg-gradient-to-br from-gray-100 to-gray-50';
      case 2: return 'bg-gradient-to-br from-amber-100 to-amber-50';
      default: return 'bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
        <div className="flex justify-center items-center h-48">
          <div className="w-8 h-8 border-4 border-[#ff444f] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (investors.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Top Investors</h2>
        <p className="text-gray-500 text-center py-6 text-sm">No investors yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Top Investors</h2>
          <p className="text-xs text-gray-500">Highest invested amounts</p>
        </div>
        <TrendingUp size={18} className="text-green-500" />
      </div>
      
      <div className="space-y-2">
        {investors.slice(0, 5).map((investor, index) => (
          <motion.div
            key={investor.userId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${getRankBg(index)} hover:shadow-md`}
            onClick={() => navigate(`/admin/users/${investor.userId}`)}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm flex-shrink-0">
                {getRankIcon(index)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900 text-sm truncate">
                  {investor.user?.fullName || 'Unknown User'}
                </p>
                <p className="text-xs text-gray-500">{investor.investmentCount} investment{investor.investmentCount !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="text-right ml-2">
              <p className="font-bold text-green-600 text-sm">{formatAmount(investor.totalInvested)}</p>
              <ChevronRight size={14} className="text-gray-400 inline-block mt-1" />
            </div>
          </motion.div>
        ))}
      </div>

      <button 
        onClick={() => navigate('/admin/users')}
        className="w-full mt-4 text-center text-sm text-[#ff444f] font-medium hover:underline py-2"
      >
        View All Investors →
      </button>
    </div>
  );
};

export default TopInvestors;