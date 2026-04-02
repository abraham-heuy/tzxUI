// src/pages/admin/TransactionDetail.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  User,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Phone,
  Copy,
  Check,
  FileText,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { adminService } from '../../../services/admin';

interface TransactionDetail {
  id: string;
  investmentReference: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  investmentAmount: number;
  fee: number;
  totalAmount: number;
  poolName: string;
  mpesaTransactionCode: string;
  mpesaPhoneNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string;
  adminNotes?: string;
  digitalSignature?: string;
  agreementSignedAt?: string;
}

const TransactionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<TransactionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchTransactionDetails();
  }, [id]);

  const fetchTransactionDetails = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getTransactionDetails(id!);
      setTransaction(response.data);
    } catch (err) {
      console.error('Failed to fetch transaction details:', err);
      setError('Failed to load transaction details');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#ff444f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading transaction details...</p>
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-lg mx-auto mt-10">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Transaction</h3>
        <p className="text-red-600 mb-4">{error || 'Transaction not found'}</p>
        <button
          onClick={() => navigate('/admin/transactions')}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Back to Transactions
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
          onClick={() => navigate('/admin/transactions')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Transaction {transaction.investmentReference}
          </h1>
          <p className="text-gray-500 mt-1">View and manage investment details</p>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`rounded-xl p-4 ${
        transaction.status === 'approved' ? 'bg-green-50 border border-green-200' :
        transaction.status === 'rejected' ? 'bg-red-50 border border-red-200' :
        'bg-amber-50 border border-amber-200'
      }`}>
        <div className="flex items-center gap-3">
          {transaction.status === 'approved' && <CheckCircle size={24} className="text-green-600" />}
          {transaction.status === 'rejected' && <XCircle size={24} className="text-red-600" />}
          {transaction.status === 'pending' && <Clock size={24} className="text-amber-600" />}
          <div>
            <p className="font-semibold text-gray-900">Status: {transaction.status.toUpperCase()}</p>
            {transaction.approvedAt && (
              <p className="text-sm text-gray-600">Approved on {formatDate(transaction.approvedAt)}</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Investment Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Investment Info */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign size={18} className="text-[#ff444f]" />
              Investment Details
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Reference Number</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm font-semibold text-gray-900">{transaction.investmentReference}</p>
                    <button
                      onClick={() => copyToClipboard(transaction.investmentReference)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-400" />}
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Pool Name</p>
                  <p className="text-sm font-medium text-gray-900">{transaction.poolName}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Investment Amount</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(transaction.investmentAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Management Fee</p>
                  <p className="text-sm text-gray-700">{formatCurrency(transaction.fee)}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(transaction.totalAmount)}</p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-[#ff444f]" />
              Payment Details
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">M-Pesa Phone Number</p>
                  <p className="text-sm font-medium text-gray-900">{transaction.mpesaPhoneNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Transaction Code</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm text-gray-900">{transaction.mpesaTransactionCode}</p>
                    <button
                      onClick={() => copyToClipboard(transaction.mpesaTransactionCode)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Copy size={14} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Payment Date</p>
                <p className="text-sm text-gray-700">{formatDate(transaction.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Signature */}
          {transaction.digitalSignature && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={18} className="text-[#ff444f]" />
                Digital Signature
              </h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-700 font-mono">{transaction.digitalSignature}</p>
                {transaction.agreementSignedAt && (
                  <p className="text-xs text-gray-500">Signed on {formatDate(transaction.agreementSignedAt)}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - User Info & Admin Notes */}
        <div className="space-y-6">
          {/* User Information */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User size={18} className="text-[#ff444f]" />
              Investor
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/admin/users/${transaction.user.id}`)}
                className="w-full text-left hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <p className="font-semibold text-gray-900">{transaction.user.fullName}</p>
                <p className="text-sm text-gray-500">{transaction.user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Phone size={12} className="text-gray-400" />
                  <p className="text-xs text-gray-500">{transaction.user.phone}</p>
                </div>
              </button>
            </div>
          </div>

          {/* Admin Notes */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText size={18} className="text-[#ff444f]" />
              Admin Notes
            </h2>
            {transaction.adminNotes ? (
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{transaction.adminNotes}</p>
            ) : (
              <p className="text-sm text-gray-400 italic">No admin notes</p>
            )}
          </div>

          {/* Actions */}
          {transaction.status === 'pending' && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-[#ff444f]" />
                Actions
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/admin/transactions/${transaction.id}/approve`)}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Approve Transaction
                </button>
                <button
                  onClick={() => navigate(`/admin/transactions/${transaction.id}/reject`)}
                  className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Reject Transaction
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionDetail;