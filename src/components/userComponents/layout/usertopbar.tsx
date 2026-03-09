import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../hooks/useUser';

interface UserTopbarProps {
  setSidebarOpen: (open: boolean) => void;
}

const UserTopbar = ({ setSidebarOpen }: UserTopbarProps) => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const getUserInitials = () => {
    if (!user?.fullName) return 'U';
    return user.fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={20} />
          </button>
          <h2 className="text-lg font-semibold text-gray-800 hidden sm:block">
            Welcome back, {user?.fullName?.split(' ')[0] || 'User'}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
            >
              <div className="w-8 h-8 bg-[#ff444f] rounded-full flex items-center justify-center text-white font-semibold">
                {getUserInitials()}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.fullName || 'User'}</p>
                <p className="text-xs text-gray-500">Investor</p>
              </div>
              <ChevronDown size={16} className="text-gray-500 hidden md:block" />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
                >
                  <div className="p-3 border-b border-gray-200 md:hidden">
                    <p className="text-sm font-medium text-gray-900">{user?.fullName || 'User'}</p>
                    <p className="text-xs text-gray-500">Investor</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate('/dashboard/settings');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <Settings size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-700">Settings</span>
                  </button>
                  
                  <div className="border-t border-gray-200 my-1" />
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors text-red-600"
                  >
                    <LogOut size={16} />
                    <span className="text-sm">Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserTopbar;