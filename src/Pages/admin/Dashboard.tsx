import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import RecentActivity from '../../components/adminComponents/dashboard/RecentActivity';
import QuickActions from '../../components/adminComponents/dashboard/QuickActions';
import StatsCards from '../../components/adminComponents/dashboard/StatCards';
import { useUser } from '../../hooks/useUser';

const Dashboard = () => {
  const { user, loading: userLoading } = useUser();
  const [greeting, setGreeting] = useState('Good day');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {greeting}, <span className="text-[#ff444f]">
            {userLoading ? '...' : user?.fullName?.split(' ')[0] || 'Admin'}
          </span>
        </h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your platform today.</p>
      </div>

      {/* Stats Cards - Now with real data */}
      <StatsCards />

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <QuickActions />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;