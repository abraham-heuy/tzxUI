import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Eye, 
  Trash2,
  CheckCircle,
  XCircle,
  TrendingUp,
  MessageCircle,
  UserCheck,
  AlertCircle,
  X
} from 'lucide-react';
import type { User as UserType } from '../../../services/users';

interface UserCardProps {
  user: UserType;
  onView: (user: UserType) => void;
  onDelete: (user: UserType) => void;
  onApprove?: (userId: string, adminNotes?: string) => Promise<void>;
  isApproving?: boolean;
}

const UserCard = ({ user, onView, onDelete, onApprove, isApproving }: UserCardProps) => {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [error, setError] = useState('');
  const [localApproving, setLocalApproving] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  const handleApprove = async () => {
    if (confirmText !== user.fullName) {
      setError(`Please type "${user.fullName}" to confirm approval`);
      return;
    }

    setError('');
    setLocalApproving(true);
    
    try {
      if (onApprove) {
        await onApprove(user.id, adminNotes || undefined);
        setShowApproveModal(false);
        setConfirmText('');
        setAdminNotes('');
      }
    } catch (error) {
      console.error('Failed to approve user:', error);
    } finally {
      setLocalApproving(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
      >
        <div className="p-5">
          {/* Header with Role Badge */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#ff444f]/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-[#ff444f]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{user.fullName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadge(user.role.name)}`}>
                    {user.role.name === 'bossy' ? 'Admin' : 'Investor'}
                  </span>
                  {user.isApproved ? (
                    <span className="text-xs flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      <CheckCircle size={12} />
                      Approved
                    </span>
                  ) : (
                    <span className="text-xs flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      <XCircle size={12} />
                      Pending
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {/* Approve Button - Only show for pending users */}
              {!user.isApproved && onApprove && (
                <button
                  onClick={() => setShowApproveModal(true)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Approve User"
                >
                  <UserCheck size={18} />
                </button>
              )}
              <button
                onClick={() => onView(user)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="View Details"
              >
                <Eye size={18} />
              </button>
              <button
                onClick={() => onDelete(user)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete User"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2 text-sm">
              <Mail size={14} className="text-gray-400" />
              <span className="text-gray-600 truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone size={14} className="text-gray-400" />
              <span className="text-gray-600">{user.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={14} className="text-gray-400" />
              <span className="text-gray-600">Joined {formatDate(user.createdAt)}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                <TrendingUp size={12} />
                <span>Invested</span>
              </div>
              <p className="font-semibold text-gray-900">
                KES {(user.totalInvested || 0).toLocaleString()}
              </p>
            </div>
            <div className="text-center border-x border-gray-100">
              <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                <TrendingUp size={12} />
                <span>Investments</span>
              </div>
              <p className="font-semibold text-gray-900">{user.totalInvestments || 0}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                <MessageCircle size={12} />
                <span>Tickets</span>
              </div>
              <p className="font-semibold text-gray-900">{user.totalTickets || 0}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Approve Modal - Inline in the same component */}
      <AnimatePresence>
        {showApproveModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowApproveModal(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Approve User Account</h3>
                    </div>
                    <button
                      onClick={() => setShowApproveModal(false)}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X size={20} className="text-gray-600" />
                    </button>
                  </div>

                  {/* Warning */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-700">
                      Approving this account will allow the user to log in and access their dashboard.
                    </p>
                  </div>

                  {/* User Details */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium text-gray-900">{user.fullName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium text-gray-900">{user.email}</span>
                    </div>
                  </div>

                  {/* Confirmation */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type user's full name to confirm <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={confirmText}
                      onChange={(e) => {
                        setConfirmText(e.target.value);
                        setError('');
                      }}
                      placeholder={user.fullName}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent outline-none"
                      autoFocus
                    />
                    {error && (
                      <p className="text-red-500 text-xs mt-1">{error}</p>
                    )}
                  </div>

                  {/* Admin Notes (Optional) */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Admin Notes (Optional)
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={3}
                      placeholder="Add any notes about this approval..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent outline-none resize-none"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowApproveModal(false)}
                      disabled={localApproving || isApproving}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleApprove}
                      disabled={localApproving || isApproving || !confirmText}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {localApproving || isApproving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={16} />
                          Approve Account
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default UserCard;