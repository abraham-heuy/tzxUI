import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CreditCard, 
  Ticket, 
  Settings,
  Users,
  LogOut,
  ChevronRight,
  X,
  Mail,
  Eye
} from 'lucide-react';
import { useUser } from '../../../hooks/useUser';

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Transactions', icon: CreditCard, path: '/admin/transactions' },
    { name: 'Support Tickets', icon: Ticket, path: '/admin/tickets' },
    { name: 'Contacts', icon: Mail, path: '/admin/contact' }, 
     { name: 'Deriv Tokens', icon: Eye, path: '/admin/deriv-tokens' },
    { name: 'Users', icon: Users, path: '/admin/users' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // For large screens, always show sidebar
  const isLargeScreen = window.innerWidth >= 1024;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Get user initials

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && !isLargeScreen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
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
            onClick={() => navigate('/admin/dashboard')}
          >
            <div className="w-8 h-8 bg-[#ff444f] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="font-bold text-xl text-gray-900">TZX<span className="text-[#ff444f]">Admin</span></span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
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

          {/* Divider */}
          <div className="my-4 border-t border-gray-200" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all"
          >
            <LogOut size={20} />
            <span className="flex-1 text-left font-medium">Logout</span>
          </button>
        </nav>

        {/* Footer - Real User Data */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500">Logged in as</p>
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.fullName || 'Loading...'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || ''}
            </p>
            <div className="mt-2 flex items-center gap-1">
              <span className="text-xs px-2 py-0.5 bg-[#ff444f]/10 text-[#ff444f] rounded-full capitalize">
                {user?.role.name || 'user'}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;