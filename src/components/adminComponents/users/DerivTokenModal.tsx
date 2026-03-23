import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Copy, 
  Check, 
  AlertCircle,
  Key,
  Save
} from 'lucide-react';

interface Transaction {
  id: string;
  investmentReference: string;
  user: {
    fullName: string;
    email: string;
  };
  investmentAmount: number;
  poolName: string;
  status: string;
  createdAt: string;
}

interface DerivTokenModalProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onAssignToken: (transactionId: string, token: string, notes?: string) => Promise<void>;
  isLoading?: boolean;
}

const DerivTokenModal = ({ 
  isOpen, 
  transaction, 
  onClose, 
  onAssignToken, 
  isLoading 
}: DerivTokenModalProps) => {
  const [token, setToken] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !transaction) return null;

  const handleAssign = async () => {
    if (!token.trim()) {
      setError('Please paste the Deriv token');
      return;
    }
    
    setError('');
    await onAssignToken(transaction.id, token, adminNotes || undefined);
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (amount: number) => `KES ${amount.toLocaleString()}`;
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Key className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Assign Deriv Token</h2>
                <p className="text-sm text-gray-500">Paste the token from Deriv platform</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-800 font-medium">Deriv Token Instructions</p>
                <p className="text-xs text-blue-600 mt-1">
                  Go to your Deriv account, generate a token for the user's trading account,
                  then paste it below to grant them access.
                </p>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Transaction Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Investor:</span>
                <span className="font-medium text-gray-900">{transaction.user.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <a href={`mailto:${transaction.user.email}`} className="text-blue-600 hover:underline">
                  {transaction.user.email}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reference:</span>
                <span className="font-mono text-gray-600">{transaction.investmentReference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-gray-900">{formatCurrency(transaction.investmentAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pool:</span>
                <span className="text-gray-700">{transaction.poolName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="text-gray-600">{formatDate(transaction.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Token Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deriv Token <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                value={token}
                onChange={(e) => {
                  setToken(e.target.value);
                  setError('');
                }}
                placeholder="Paste the token from Deriv here..."
                className={`w-full pl-10 pr-24 py-3 border rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent outline-none ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {token && (
                <button
                  onClick={handleCopyToken}
                  className="absolute right-2 top-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1"
                >
                  {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                  <span className="text-xs">{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              )}
            </div>
            {error && (
              <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              The token should look like: <span className="font-mono">deriv-abc123xyz-456</span>
            </p>
          </div>

          {/* Admin Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin Notes (Optional)
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={3}
              placeholder="Add notes about this token (e.g., which trading account, special instructions)..."
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
              onClick={handleAssign}
              disabled={isLoading || !token.trim()}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Assign Token
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DerivTokenModal;