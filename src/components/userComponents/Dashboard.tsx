import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MessageCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  PlusCircle,
  HelpCircle,
  FileText,
  ArrowRight,
  Users
} from 'lucide-react';
import { useUser } from '../../hooks/useUser';
import { userService, type TransactionListItem, type Ticket } from '../../services/user';
import WhatsAppGroupModal from './resuableComponents.tsx/whatsappLinkModal';

// Display types for the UI (subset of full types)
interface DisplayTransaction {
  id: string;
  investmentReference: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  poolName: string;
}

interface DisplayTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
}

interface DashboardStats {
  totalInvested: number;
  pendingInvestments: number;
  approvedInvestments: number;
  totalTickets: number;
  openTickets: number;
  recentTransactions: DisplayTransaction[];
  recentTickets: DisplayTicket[];
}

// Quick Action Chip Component
const ActionChip = ({ icon: Icon, label, onClick, color = 'bg-gray-100' }: { 
  icon: React.ElementType; 
  label: string; 
  onClick: () => void;
  color?: string;
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 ${color} rounded-full text-sm font-medium hover:shadow-md transition-all`}
  >
    <Icon size={16} />
    <span>{label}</span>
  </motion.button>
);

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch user's transactions - returns TransactionListItem[]
      const transactionsResponse = await userService.getMyTransactions({
        limit: 5,
        sortBy: 'createdAt',
        sortOrder: 'DESC'
      });

      // Fetch user's tickets
      const ticketsResponse = await userService.getMyTickets({ 
        limit: 5,
        sortBy: 'createdAt',
        sortOrder: 'DESC'
      });

      const transactions: TransactionListItem[] = transactionsResponse.data;
      const tickets: Ticket[] = ticketsResponse.data;
      
      // Calculate stats from real data
      const totalInvested = transactions.reduce((sum: number, tx: TransactionListItem) => sum + tx.investmentAmount, 0);
      const pendingInvestments = transactions.filter((tx: TransactionListItem) => tx.status === 'pending').length;
      const approvedInvestments = transactions.filter((tx: TransactionListItem) => tx.status === 'approved').length;
      const openTickets = tickets.filter((t: Ticket) => t.status === 'open' || t.status === 'in_progress').length;

      // Map to display types
      const displayTransactions: DisplayTransaction[] = transactions.slice(0, 5).map((tx: TransactionListItem) => ({
        id: tx.id,
        investmentReference: tx.investmentReference,
        amount: tx.investmentAmount,
        status: tx.status,
        createdAt: tx.createdAt,
        poolName: tx.poolName
      }));

      const displayTickets: DisplayTicket[] = tickets.slice(0, 5).map((t: Ticket) => ({
        id: t.id,
        ticketNumber: t.ticketNumber,
        subject: t.subject,
        status: t.status,
        createdAt: t.createdAt
      }));

      setStats({
        totalInvested,
        pendingInvestments,
        approvedInvestments,
        totalTickets: tickets.length,
        openTickets,
        recentTransactions: displayTransactions,
        recentTickets: displayTickets
      });

    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => `KES ${amount.toLocaleString()}`;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Quick actions configuration
  const quickActions = [
    {
      icon: PlusCircle,
      label: 'New Investment',
      onClick: () => navigate('/investments/new'),
      color: 'bg-green-100 text-green-700 hover:bg-green-200'
    },
    {
      icon: MessageCircle,
      label: 'New Ticket',
      onClick: () => navigate('/dashboard/tickets?new=true'),
      color: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
    },
    {
      icon: FileText,
      label: 'View Transactions',
      onClick: () => navigate('/dashboard/transactions'),
      color: 'bg-purple-100 text-purple-700 hover:bg-purple-200'
    },
    {
      icon: HelpCircle,
      label: 'FAQs',
      onClick: () => navigate('/faqs'),
      color: 'bg-amber-100 text-amber-700 hover:bg-amber-200'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#ff444f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-lg mx-auto mt-10">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchUserData}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 relative"
    >
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Welcome back, <span className="text-[#ff444f]">{user?.fullName?.split(' ')[0] || 'Investor'}</span>
        </h1>
        <p className="text-gray-600 mt-1">Track your investments and support tickets</p>
      </div>

      {/* Quick Actions Chips */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, index) => (
            <ActionChip
              key={index}
              icon={action.icon}
              label={action.label}
              onClick={action.onClick}
              color={action.color}
            />
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-[#ff444f]" />
            <span className="text-sm text-gray-600">Total Invested</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.totalInvested || 0)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={20} className="text-amber-500" />
            <span className="text-sm text-gray-600">Pending</span>
          </div>
          <p className="text-2xl font-bold text-amber-600">{stats?.pendingInvestments || 0}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={20} className="text-green-500" />
            <span className="text-sm text-gray-600">Approved</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats?.approvedInvestments || 0}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle size={20} className="text-blue-500" />
            <span className="text-sm text-gray-600">Open Tickets</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats?.openTickets || 0}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            <button 
              onClick={() => navigate('/dashboard/transactions')}
              className="text-sm text-[#ff444f] hover:underline flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </button>
          </div>
          {stats?.recentTransactions && stats.recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {stats.recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                     onClick={() => navigate(`/dashboard/transactions?id=${tx.id}`)}>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{tx.investmentReference}</p>
                    <p className="text-xs text-gray-500">{tx.poolName || 'Investment'} • {formatDate(tx.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(tx.amount)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      tx.status === 'approved' ? 'bg-green-100 text-green-700' : 
                      tx.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-3">No transactions yet</p>
              <ActionChip
                icon={PlusCircle}
                label="Start Investing"
                onClick={() => navigate('/investments/new')}
                color="bg-[#ff444f] text-white hover:bg-[#d43b44]"
              />
            </div>
          )}
        </div>

        {/* Recent Tickets */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Support Tickets</h2>
            <button 
              onClick={() => navigate('/dashboard/tickets')}
              className="text-sm text-[#ff444f] hover:underline flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </button>
          </div>
          {stats?.recentTickets && stats.recentTickets.length > 0 ? (
            <div className="space-y-3">
              {stats.recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                     onClick={() => navigate(`/dashboard/tickets?id=${ticket.id}`)}>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{ticket.ticketNumber}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{ticket.subject}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    ticket.status === 'open' ? 'bg-blue-100 text-blue-700' : 
                    ticket.status === 'in_progress' ? 'bg-purple-100 text-purple-700' :
                    ticket.status === 'resolved' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-3">No support tickets</p>
              <ActionChip
                icon={MessageCircle}
                label="Create Ticket"
                onClick={() => navigate('/dashboard/tickets?new=true')}
                color="bg-blue-100 text-blue-700 hover:bg-blue-200"
              />
            </div>
          )}
        </div>
      </div>

      {/* Floating Join Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowWhatsAppModal(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 font-semibold"
      >
        <Users size={20} />
        <span>Join</span>
      </motion.button>

      {/* WhatsApp Group Modal */}
      <WhatsAppGroupModal 
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
      />
    </motion.div>
  );
};

export default UserDashboard;