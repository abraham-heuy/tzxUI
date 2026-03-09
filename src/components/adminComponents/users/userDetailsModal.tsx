import { motion } from 'framer-motion';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Shield,
  TrendingUp,
  MessageCircle,
  CheckCircle,
  XCircle,
  Tag,
  DollarSign
} from 'lucide-react';
import type { UserDetails } from '../../../services/users';
import StatusBadge from '../../common/StatusBadge';

interface UserDetailsModalProps {
  isOpen: boolean;
  user: UserDetails | null;
  onClose: () => void;
}

const UserDetailsModal = ({ isOpen, user, onClose }: UserDetailsModalProps) => {
  if (!isOpen || !user) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-KE', {
      dateStyle: 'full',
      timeStyle: 'short'
    });
  };

  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  const getRoleBadge = (roleName: string) => {
    switch (roleName) {
      case 'bossy':
        return 'bg-purple-100 text-purple-700';
      case 'investor':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#ff444f]/10 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-[#ff444f]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{user.fullName}</h2>
                <p className="text-sm text-gray-500">Member since {formatDate(user.createdAt).split(',')[0]}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getRoleBadge(user.role.name)}`}>
              <Shield size={12} />
              {user.role.name === 'bossy' ? 'Administrator' : 'Investor'}
            </span>
            {user.isApproved ? (
              <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                <CheckCircle size={12} />
                Account Approved
              </span>
            ) : (
              <span className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                <XCircle size={12} />
                Pending Approval
              </span>
            )}
            {user.emailVerified && (
              <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                <Mail size={12} />
                Email Verified
              </span>
            )}
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-gray-400" />
                  <a href={`mailto:${user.email}`} className="text-gray-600 hover:text-[#ff444f]">
                    {user.email}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-gray-400" />
                  <a href={`tel:${user.phone}`} className="text-gray-600 hover:text-[#ff444f]">
                    {user.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Tag size={16} className="text-gray-400" />
                  <span className="text-gray-600">ID: {user.idNumber}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Account Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Login</span>
                  <span className="text-sm font-medium text-gray-900">
                    {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Account Age</span>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-4 border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={18} className="text-green-600" />
                <span className="text-sm font-medium text-gray-600">Total Invested</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(user.summary.totalInvested)}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={18} className="text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Investments</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{user.summary.totalInvestments}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle size={18} className="text-purple-600" />
                <span className="text-sm font-medium text-gray-600">Support Tickets</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{user.summary.totalTickets}</p>
            </div>
          </div>

          {/* Investment Summary */}
          {user.summary.investmentSummary.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Investment Status</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {user.summary.investmentSummary.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <StatusBadge status={item.status as any} />
                    <p className="text-lg font-bold text-gray-900 mt-2">{item.count}</p>
                    <p className="text-xs text-gray-500">Total: {formatCurrency(Number(item.total))}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Investments */}
            {user.recentInvestments.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Recent Investments</h3>
                <div className="space-y-2">
                  {user.recentInvestments.map((inv) => (
                    <div key={inv.id} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{inv.investmentReference}</p>
                        <p className="text-xs text-gray-500">{formatDate(inv.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-600">{formatCurrency(inv.investmentAmount)}</p>
                        <StatusBadge status={inv.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Tickets */}
            {user.recentTickets.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Recent Support Tickets</h3>
                <div className="space-y-2">
                  {user.recentTickets.map((ticket) => (
                    <div key={ticket.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900">{ticket.ticketNumber}</p>
                        <StatusBadge status={ticket.status} />
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-1">{ticket.subject}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(ticket.createdAt)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserDetailsModal;