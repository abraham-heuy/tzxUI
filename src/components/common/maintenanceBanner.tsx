import { useState, useEffect, useRef } from 'react';
import { CheckCircle, MessageCircle, X } from 'lucide-react';

// Fixed priority fix period
// Start: 3:05 AM
// End: 4:00 PM (same day)
const getMaintenancePeriod = () => {
  const now = new Date();
  
  // Set start time to today at 03:05 (3:05 AM)
  const startTime = new Date(now);
  startTime.setHours(3, 5, 0, 0);
  
  // Set end time to today at 16:00 (4:00 PM)
  const endTime = new Date(now);
  endTime.setHours(16, 0, 0, 0);
  
  // If current time is after end time, maintenance is over
  if (now > endTime) {
    return { isActive: false };
  }
  
  // If current time is before start time, maintenance hasn't started yet
  if (now < startTime) {
    return { isActive: false };
  }
  
  return { isActive: true };
};

const MaintenanceBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const bannerRef = useRef<HTMLDivElement>(null);
  const [hasDismissed, setHasDismissed] = useState(false);

  useEffect(() => {
    const { isActive } = getMaintenancePeriod();
    
    // Check if user has dismissed this banner session
    const dismissed = sessionStorage.getItem('maintenance_banner_dismissed');
    if (dismissed === 'true') {
      setHasDismissed(true);
    }
    
    if (!isActive) {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('maintenance_banner_dismissed', 'true');
  };

  if (!isVisible || hasDismissed) return null;

  return (
    <div 
      ref={bannerRef} 
      className="bg-blue-50 border-b border-blue-200 text-blue-800 py-3 px-4 text-center sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <div className="flex items-start gap-3 flex-1">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-left">
            <p className="font-semibold text-blue-900">Priority Features Patched</p>
            <p className="text-sm text-blue-700">
              We apologize for the disruptions. You can now transact normally and view your account.
              If you have more queries/encounter some problems, feel free to consult with us.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <a 
            href="/contact" 
            className="flex items-center gap-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1.5 rounded-full transition-colors"
          >
            <MessageCircle size={14} />
            Contact Support
          </a>
          <button
            onClick={handleDismiss}
            className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1.5 rounded-full transition-colors"
            title="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceBanner;