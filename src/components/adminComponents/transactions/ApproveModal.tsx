import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertCircle, CheckCircle } from 'lucide-react';

interface TransactionData {
  id: string;
  reference: string;
  user: string;
  amount: number;
  pool: string;
  mpesaCode: string;
}

interface ApproveModalProps {
  isOpen: boolean;
  transaction: TransactionData | null;
  onClose: () => void;
  onApprove: (id: string, adminNotes?: string) => Promise<void>;
  isLoading?: boolean;
}

const ApproveModal = ({ isOpen, transaction, onClose, onApprove, isLoading }: ApproveModalProps) => {
  const [referenceInput, setReferenceInput] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !transaction) return null;

  const handleApprove = async () => {
    if (referenceInput !== transaction.reference) {
      setError('Transaction reference does not match');
      return;
    }

    setError('');
    await onApprove(transaction.id, adminNotes || undefined);
  };

  const formatAmount = (amount: number) => `KES ${amount.toLocaleString()}`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Approve Transaction</h3>
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
              This action cannot be undone. Make sure you've verified all details before approving.
            </p>
          </div>

          {/* Transaction Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Reference:</span>
              <span className="font-mono font-bold text-gray-900">{transaction.reference}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">User:</span>
              <span className="font-medium text-gray-900">{transaction.user}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium text-green-600">{formatAmount(transaction.amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Pool:</span>
              <span className="text-gray-900">{transaction.pool}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">M-Pesa Code:</span>
              <span className="font-mono text-gray-600">{transaction.mpesaCode}</span>
            </div>
          </div>

          {/* Reference Confirmation */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type the transaction reference to confirm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={referenceInput}
              onChange={(e) => {
                setReferenceInput(e.target.value);
                setError('');
              }}
              placeholder={transaction.reference}
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
              disabled={isLoading || !referenceInput}
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
                  Confirm Approval
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ApproveModal;