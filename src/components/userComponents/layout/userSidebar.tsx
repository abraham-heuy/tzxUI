import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CreditCard, 
  MessageCircle,
  Settings,
  LogOut,
  ChevronRight,
  X} from 'lucide-react';
import { useUser } from '../../../hooks/useUser';

interface UserSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const UserSidebar = ({ sidebarOpen, setSidebarOpen }: UserSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/user/dashboard' },
    { name: 'My Transactions', icon: CreditCard, path: '/user/transactions' },
    { name: 'Support Tickets', icon: MessageCircle, path: '/user/tickets' },
    { name: 'Settings', icon: Settings, path: '/user/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const isLargeScreen = window.innerWidth >= 1024;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getUserInitials = () => {
    if (!user?.fullName) return 'U';
    return user.fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      {sidebarOpen && !isLargeScreen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl transition-transform duration-300
          ${isLargeScreen ? 'translate-x-0' : sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            <div className="w-8 h-8 bg-[#ff444f] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="font-bold text-xl text-gray-900">TZX<span className="text-[#ff444f]">User</span></span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Info Mini */}
        <div className="p-4 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#ff444f] rounded-full flex items-center justify-center text-white font-semibold">
              {getUserInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.fullName || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  active 
                    ? 'bg-[#ff444f] text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span className="flex-1 text-left font-medium">{item.name}</span>
                {active && <ChevronRight size={16} className="text-white" />}
              </button>
            );
          })}

          <div className="my-4 border-t border-gray-200" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all"
          >
            <LogOut size={20} />
            <span className="flex-1 text-left font-medium">Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
};

export default UserSidebar;