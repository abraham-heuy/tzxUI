import { motion } from 'framer-motion';
import { 
  X, 
  User, 
  Phone, 
  DollarSign,
  CreditCard,
  Clock,
  Copy
} from 'lucide-react';
import StatusBadge from '../../common/StatusBadge';
import { useState } from 'react';

interface TransactionDetails {
  id: string;
  investmentReference: string;
  investmentAmount: number;
  poolName: string;
  mpesaTransactionCode: string;
  mpesaPhoneNumber: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  totalAmount: number;
  fee: number;
  digitalSignature: string;
  agreementSignedAt: string;
  adminNotes?: string;
  approvedAt?: string;
}

interface TransactionDetailsModalProps {
  isOpen: boolean;
  transaction: TransactionDetails | null;
  onClose: () => void;
}

const TransactionDetailsModal = ({ isOpen, transaction, onClose }: TransactionDetailsModalProps) => {
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen || !transaction) return null;

  const formatAmount = (amount: number) => `KES ${amount.toLocaleString()}`;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-KE', {
      dateStyle: 'full',
      timeStyle: 'short'
    });
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#ff444f]/10 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-[#ff444f]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
                <p className="text-sm text-gray-500">Reference: {transaction.investmentReference}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Status Badge */}
          <div className="mb-6">
            <StatusBadge status={transaction.status} />
            {transaction.status === 'approved' && transaction.approvedAt && (
              <p className="text-xs text-green-600 mt-2">
                Approved on {formatDate(transaction.approvedAt)}
              </p>
            )}
          </div>

          {/* Transaction Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Investment Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <DollarSign size={16} className="text-gray-500" />
                Investment Details
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Pool</p>
                  <p className="text-sm font-medium text-gray-900">{transaction.poolName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Investment Amount</p>
                  <p className="text-sm font-bold text-green-600">{formatAmount(transaction.investmentAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Transaction Fee</p>
                  <p className="text-sm text-gray-700">{formatAmount(transaction.fee)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="text-sm font-bold text-gray-900">{formatAmount(transaction.totalAmount)}</p>
                </div>
              </div>
            </div>

            {/* M-Pesa Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Phone size={16} className="text-gray-500" />
                M-Pesa Details
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Phone Number</p>
                  <a 
                    href={`tel:${transaction.mpesaPhoneNumber}`}
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Phone size={14} />
                    {transaction.mpesaPhoneNumber}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Transaction Code</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono bg-white px-2 py-1 rounded border border-gray-200">
                      {transaction.mpesaTransactionCode}
                    </span>
                    <button
                      onClick={() => copyToClipboard(transaction.mpesaTransactionCode, 'code')}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      title="Copy code"
                    >
                      <Copy size={14} className={copied === 'code' ? 'text-green-600' : 'text-gray-500'} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Signature Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <User size={16} className="text-gray-500" />
                Digital Signature
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Signed by</p>
                  <p className="text-sm font-medium text-gray-900">{transaction.digitalSignature}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Signed on</p>
                  <p className="text-sm text-gray-700">{formatDate(transaction.agreementSignedAt)}</p>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Clock size={16} className="text-gray-500" />
                Timeline
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-sm text-gray-700">{formatDate(transaction.createdAt)}</p>
                </div>
                {transaction.approvedAt && (
                  <div>
                    <p className="text-xs text-gray-500">Approved</p>
                    <p className="text-sm text-green-600">{formatDate(transaction.approvedAt)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Admin Notes */}
          {transaction.adminNotes && (
            <div className="mt-6 bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
              <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                <span>Admin Notes</span>
              </h3>
              <p className="text-sm text-blue-700">{transaction.adminNotes}</p>
            </div>
          )}

          {/* Close Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TransactionDetailsModal;