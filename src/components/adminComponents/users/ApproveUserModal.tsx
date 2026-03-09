import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertCircle, CheckCircle, UserCheck } from 'lucide-react';

interface UserData {
  id: string;
  fullName: string;
  email: string;
}

interface ApproveUserModalProps {
  isOpen: boolean;
  user: UserData | null;
  onClose: () => void;
  onApprove: (id: string, adminNotes?: string) => Promise<void>;
  isLoading?: boolean;
}

const ApproveUserModal = ({ isOpen, user, onClose, onApprove, isLoading }: ApproveUserModalProps) => {
  const [confirmText, setConfirmText] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !user) return null;

  const handleApprove = async () => {
    if (confirmText !== user.fullName) {
      setError(`Please type "${user.fullName}" to confirm approval`);
      return;
    }

    setError('');
    await onApprove(user.id, adminNotes || undefined);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl max-w-md w-full"
      >
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
              onClick={onClose}
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
              Make sure you've verified their details.
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
              Type the user's full name to confirm <span className="text-red-500">*</span>
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
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleApprove}
              disabled={isLoading || !confirmText}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
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
      </motion.div>
    </div>
  );
};

export default ApproveUserModal;