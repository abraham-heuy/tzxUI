import { motion } from 'framer-motion';
import {
  AlertCircle,
  BarChart3,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
} from 'lucide-react';
import { useUser } from '../../hooks/useUser';
import { adminService, type DashboardStats } from '../../services/admin';
import StatsCards from '../../components/adminComponents/dashboard/StatCards';
import QuickActions from '../../components/adminComponents/dashboard/QuickActions';
import RecentActivity from '../../components/adminComponents/dashboard/RecentActivity';
import TopInvestors from '../../components/adminComponents/dashboard/TopInvestors';
import ChartsSection from '../../components/adminComponents/dashboard/ChartSection';
import { useEffect, useState, useRef } from 'react';

// Cache dashboard data in localStorage with 5-minute expiry
const CACHE_KEY = 'admin_dashboard_cache';
const CACHE_DURATION = 3 * 60 * 1000; // 5 minutes

interface CachedData {
  data: DashboardStats;
  timestamp: number;
}

const AdminDashboard = () => {
  const { user } = useUser();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Load cached data first for instant feedback
    loadFromCache();
    
    // Then fetch fresh data in background
    fetchDashboardData();
    
    // Cleanup function to abort in-progress requests
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const loadFromCache = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed: CachedData = JSON.parse(cached);
        const isExpired = Date.now() - parsed.timestamp > CACHE_DURATION;
        
        if (!isExpired && parsed.data) {
          setStats(parsed.data);
          setLastUpdated(new Date(parsed.timestamp));
          setIsLoading(false);
          console.log('Loaded dashboard from cache');
        }
      }
    } catch (err) {
      console.error('Failed to load cache:', err);
    }
  };

  const saveToCache = (data: DashboardStats) => {
    try {
      const cacheData: CachedData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to save cache:', err);
    }
  };

  const fetchDashboardData = async (isManualRefresh = false) => {
    // Cancel any in-progress request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      
      const response = await adminService.getDashboardStats();
      setStats(response.data);
      saveToCache(response.data);
      
    } catch (err: any) {
      // Don't show error if it's an abort error (user navigated away)
      if (err.name !== 'AbortError') {
        console.error('Failed to fetch dashboard data:', err);
        // Only show error if we don't have cached data
        if (!stats) {
          setError('Failed to load dashboard data');
        }
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  const fmt = (n: number) => {
    if (n >= 1_000_000) return `KES ${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `KES ${(n / 1_000).toFixed(1)}K`;
    return `KES ${n.toLocaleString()}`;
  };

  // Show loading only on first load with no cache
  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#ff444f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-lg mx-auto mt-10">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => fetchDashboardData()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const q = stats?.quickStats;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-20"
    >
      {/* Welcome Section with Refresh Indicator */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Welcome back,{' '}
            <span className="text-[#ff444f]">{user?.fullName?.split(' ')[0] || 'Admin'}</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-500 text-sm">Here's what's happening on your platform today.</p>
            {lastUpdated && (
              <span className="text-xs text-gray-400">
                Updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
        >
          <svg
            className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <QuickActions />
      </div>

      {/* Top Investors (Left) + Recent Activity (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <TopInvestors />
        </div>
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>

      {/* Performance Highlights - Full Width */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-[#ff444f]" />
            <h2 className="text-base font-bold text-gray-900">Performance Highlights</h2>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-gray-900">{fmt(q?.totalInvestedAmount ?? 0)}</p>
            <p className="text-xs text-gray-400">Total Portfolio Value</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { bg: 'bg-green-50', icon: <CheckCircle size={16} className="text-green-600" />, value: q?.approvedUsers ?? 0, label: 'Approved Users', color: 'text-green-700' },
            { bg: 'bg-amber-50', icon: <Clock size={16} className="text-amber-600" />, value: q?.pendingUsers ?? 0, label: 'Pending Approvals', color: 'text-amber-700' },
            { bg: 'bg-blue-50', icon: <DollarSign size={16} className="text-blue-600" />, value: (q?.totalInvestments ?? 0).toLocaleString(), label: 'Total Investments', color: 'text-blue-700' },
            { bg: 'bg-purple-50', icon: <Users size={16} className="text-purple-600" />, value: (q?.activeUsers ?? 0).toLocaleString(), label: 'Active Users', color: 'text-purple-700' },
          ].map(({ bg, icon, value, label, color }) => (
            <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
              <div className="flex justify-center mb-1">{icon}</div>
              <p className={`text-lg font-bold ${color}`}>{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Approval Rate</p>
            <p className="text-base font-bold text-green-600">{q?.approvalRate ?? 0}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Engagement Rate</p>
            <p className="text-base font-bold text-blue-600">{q?.engagementRate ?? 0}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Avg Investment</p>
            <p className="text-base font-bold text-amber-600">{fmt(q?.averageInvestment ?? 0)}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <ChartsSection />
    </motion.div>
  );
};

export default AdminDashboard;