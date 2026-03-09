import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertCircle, XCircle } from 'lucide-react';

interface Transaction {
  id: string;
  reference: string;
}

interface RejectModalProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onReject: (id: string, adminNotes?: string) => Promise<void>;
  isLoading?: boolean;
}

const RejectModal = ({ isOpen, transaction, onClose, onReject, isLoading }: RejectModalProps) => {
  const [adminNotes, setAdminNotes] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !transaction) return null;

  const handleReject = async () => {
    if (confirmText !== 'REJECT') {
      setError('Please type REJECT to confirm');
      return;
    }

    setError('');
    await onReject(transaction.id, adminNotes || undefined);
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
            <h3 className="text-lg font-bold text-gray-900">Reject Transaction</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-red-700">
              You are about to reject transaction <span className="font-mono font-bold">{transaction.reference}</span>. 
              This action cannot be undone.
            </p>
          </div>

          {/* Reason for Rejection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Rejection (Optional)
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={3}
              placeholder="Explain why this transaction is being rejected..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Confirmation */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type <span className="font-mono font-bold">REJECT</span> to confirm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => {
                setConfirmText(e.target.value);
                setError('');
              }}
              placeholder="REJECT"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent outline-none"
            />
            {error && (
              <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
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
              onClick={handleReject}
              disabled={isLoading || confirmText !== 'REJECT'}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <XCircle size={16} />
                  Confirm Rejection
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RejectModal;