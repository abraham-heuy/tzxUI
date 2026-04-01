import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

// Fixed global maintenance period
// Start: Today at 12:25 AM
// End: Today at 2:25 AM (2 hours later)
const getMaintenancePeriod = () => {
  const now = new Date();
  
  // Set start time to today at 00:25 (12:25 AM)
  const startTime = new Date(now);
  startTime.setHours(0, 25, 0, 0);
  
  // Set end time to today at 02:25 (2:25 AM)
  const endTime = new Date(now);
  endTime.setHours(2, 25, 0, 0);
  
  // If end time is before start time (shouldn't happen with 2-hour window)
  if (endTime <= startTime) {
    endTime.setDate(endTime.getDate() + 1);
  }
  
  // If current time is after end time, maintenance is over
  if (now > endTime) {
    return { isActive: false, endTime: null };
  }
  
  // If current time is before start time, maintenance hasn't started yet
  if (now < startTime) {
    return { isActive: false, endTime: null };
  }
  
  return { isActive: true, endTime: endTime.getTime() };
};

const MaintenanceBanner = () => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { isActive, endTime } = getMaintenancePeriod();
    
    if (!isActive) {
      setIsVisible(false);
      return;
    }

    const interval = setInterval(() => {
      const remaining = endTime! - Date.now();
      if (remaining <= 0) {
        clearInterval(interval);
        setIsVisible(false);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  if (timeLeft === null) {
    return (
      <div 
        ref={bannerRef} 
        className="bg-red-600 text-white py-2 px-4 text-center sticky top-0 z-50 shadow-md"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-sm sm:text-base">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>⚠️ Site under brief maintenance (12:25 AM - 2:25 AM). Please do not complete any transactions.</span>
          <div className="flex items-center gap-1 bg-red-700 px-2 py-1 rounded-md">
            <Clock className="w-4 h-4" />
            <span className="font-mono font-bold">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  const hours = Math.floor(timeLeft / 3600000);
  const minutes = Math.floor((timeLeft % 3600000) / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div 
      ref={bannerRef} 
      className="bg-red-600 text-white py-2 px-4 text-center sticky top-0 z-50 shadow-md"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-sm sm:text-base">
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        <span>⚠️ Site under brief maintenance (12:25 AM - 2:25 AM). Please do not complete any transactions until maintenance ends.</span>
        <div className="flex items-center gap-1 bg-red-700 px-2 py-1 rounded-md">
          <Clock className="w-4 h-4" />
          <span className="font-mono font-bold">{formattedTime}</span>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceBanner;