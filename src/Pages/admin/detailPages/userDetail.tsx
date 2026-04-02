// src/pages/admin/UserDetail.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  AlertCircle,
  User,
  Building2,
  Shield,
  FileText,
  MessageCircle,
  ChevronRight
} from 'lucide-react';
import { userService, type UserDetails } from '../../../services/users';
import StatusBadge from '../../../components/common/StatusBadge';

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getUserDetails(id!);
      setUser(response.data);
    } catch (err) {
      console.error('Failed to fetch user details:', err);
      setError('Failed to load user details');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `KES ${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `KES ${(amount / 1000).toFixed(1)}K`;
    return `KES ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#ff444f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-lg mx-auto mt-10">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading User</h3>
        <p className="text-red-600 mb-4">{error || 'User not found'}</p>
        <button
          onClick={() => navigate('/admin/users')}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/users')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{user.fullName}</h1>
          <p className="text-gray-500 mt-1">User ID: {user.id}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={18} className="text-green-600" />
            <span className="text-xs text-gray-500">Total Invested</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(user.summary.totalInvested)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={18} className="text-blue-600" />
            <span className="text-xs text-gray-500">Investments</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{user.summary.totalInvestments}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle size={18} className="text-purple-600" />
            <span className="text-xs text-gray-500">Support Tickets</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{user.summary.totalTickets}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={18} className="text-amber-600" />
            <span className="text-xs text-gray-500">Member Since</span>
          </div>
          <p className="text-sm font-medium text-gray-900">{formatDate(user.createdAt).split(',')[0]}</p>
        </div>
      </div>

      {/* User Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User size={18} className="text-[#ff444f]" />
            Personal Information
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-gray-400" />
              <span className="text-gray-700">{user.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-gray-400" />
              <span className="text-gray-700">{user.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Building2 size={16} className="text-gray-400" />
              <span className="text-gray-700">ID: {user.idNumber}</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield size={16} className="text-gray-400" />
              <span className="text-gray-700">Role: {user.role?.name || 'Investor'}</span>
            </div>
            <div className="flex items-center gap-3">
              {user.isApproved ? (
                <CheckCircle size={16} className="text-green-500" />
              ) : (
                <XCircle size={16} className="text-amber-500" />
              )}
              <span className={`font-medium ${user.isApproved ? 'text-green-600' : 'text-amber-600'}`}>
                {user.isApproved ? 'Approved' : 'Pending Approval'}
              </span>
            </div>
          </div>
        </div>

        {/* Investment Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-[#ff444f]" />
            Investment Summary
          </h2>
          <div className="space-y-3">
            {user.summary.investmentSummary.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {item.status === 'approved' && <CheckCircle size={14} className="text-green-500" />}
                  {item.status === 'pending' && <Clock size={14} className="text-amber-500" />}
                  {item.status === 'rejected' && <XCircle size={14} className="text-red-500" />}
                  <span className="capitalize text-gray-600">{item.status}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{item.count} investments</p>
                  <p className="text-xs text-gray-500">{formatCurrency(Number(item.total))}</p>
                </div>
              </div>
            ))}
            {user.summary.investmentSummary.length === 0 && (
              <p className="text-gray-500 text-center py-4">No investments yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Investments */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileText size={18} className="text-[#ff444f]" />
            Recent Investments
          </h2>
          <button
            onClick={() => navigate(`/admin/transactions?userId=${user.id}`)}
            className="text-sm text-[#ff444f] hover:underline flex items-center gap-1"
          >
            View All <ChevronRight size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Reference</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Pool</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Amount</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {user.recentInvestments.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/admin/transactions/${inv.id}`)}
                >
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">{inv.investmentReference}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{inv.poolName}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                    {formatCurrency(inv.investmentAmount)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(inv.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {user.recentInvestments.length === 0 && (
            <p className="text-gray-500 text-center py-6">No investments found</p>
          )}
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <MessageCircle size={18} className="text-[#ff444f]" />
            Recent Support Tickets
          </h2>
          <button
            onClick={() => navigate(`/admin/tickets?userId=${user.id}`)}
            className="text-sm text-[#ff444f] hover:underline flex items-center gap-1"
          >
            View All <ChevronRight size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Ticket #</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Subject</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {user.recentTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
                >
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">{ticket.ticketNumber}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{ticket.subject}</td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(ticket.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {user.recentTickets.length === 0 && (
            <p className="text-gray-500 text-center py-6">No support tickets found</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default UserDetail;