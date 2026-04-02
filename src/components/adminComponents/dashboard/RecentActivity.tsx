// src/components/adminComponents/dashboard/RecentActivity.tsx
import { motion } from 'framer-motion';
import { 
  Clock, 
  UserPlus,
  DollarSign,
  MessageCircle,
  ChevronRight
} from 'lucide-react';
import StatusBadge from '../../common/StatusBadge';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService, type ActivityItem } from '../../../services/admin';

const RecentActivity = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [displayCount, setDisplayCount] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getRecentActivity();
      setActivities(response.data);
    } catch (err) {
      console.error('Failed to fetch recent activity:', err);
      setError('Failed to load recent activity');
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'investment':
        return <DollarSign size={16} className="text-green-600" />;
      case 'ticket':
        return <MessageCircle size={16} className="text-blue-600" />;
      case 'user':
        return <UserPlus size={16} className="text-purple-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getActionUrl = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'investment':
        return `/admin/transactions/${activity.id}`;
      case 'ticket':
        return `/admin/support/${activity.id}`;
      case 'user':
        return `/admin/users/${activity.id}`;
      default:
        return '#';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  };

  const loadMore = () => {
    setDisplayCount(prev => Math.min(prev + 3, activities.length));
  };

  const displayedActivities = activities.slice(0, displayCount);
  const hasMore = displayCount < activities.length;

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center py-8">
          <p className="text-red-600 mb-2">{error}</p>
          <button 
            onClick={fetchActivities}
            className="text-sm text-[#ff444f] hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
      
      {isLoading ? (
        // Loading skeletons
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3 p-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-lg" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                </div>
                <div className="h-3 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No recent activity</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {displayedActivities.map((activity, index) => (
              <motion.div
                key={`${activity.id}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                onClick={() => navigate(getActionUrl(activity))}
              >
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  {getIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.action}
                    </p>
                    <StatusBadge status={activity.status as any} />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{activity.user}</span>
                    <span>•</span>
                    <span>{formatTime(activity.time)}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Ref: {activity.reference}</p>
                  {activity.amount && (
                    <p className="text-xs font-medium text-green-600 mt-1">
                      KES {activity.amount.toLocaleString()}
                    </p>
                  )}
                </div>
                <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
              </motion.div>
            ))}
          </div>

          {hasMore && (
            <button
              onClick={loadMore}
              className="w-full mt-4 text-center text-sm text-[#ff444f] hover:underline py-2"
            >
              Load {Math.min(3, activities.length - displayCount)} more
            </button>
          )}

          <button 
            onClick={() => navigate('/admin/activities')}
            className="w-full mt-2 text-center text-sm text-gray-500 hover:text-[#ff444f] py-2"
          >
            View All Activity
          </button>
        </>
      )}
    </div>
  );
};

export default RecentActivity;