import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, Eye, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import ApproveModal from '../../components/adminComponents/transactions/ApproveModal';
import RejectModal from '../../components/adminComponents/transactions/RejectModal';

import { adminService } from '../../services/admin';
import TransactionDetailsModal from '../../components/adminComponents/transactions/TransactionsDetails';

interface Transaction {
  id: string;
  investmentReference: string;
  user: {
    fullName: string;
    email: string;
  };
  investmentAmount: number;
  poolName: string;
  mpesaTransactionCode: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  mpesaPhoneNumber: string;
  totalAmount: number;
  fee?: number;
  adminNotes?: string;
  approvedAt?: string;
  approvedByUserId?: string;
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Modals
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, statusFilter]);

  useEffect(() => {
    // Apply search filter locally
    if (!transactions.length) return;

    const filtered = transactions.filter(t => {
      const matchesSearch = 
        t.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.investmentReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.mpesaTransactionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.mpesaPhoneNumber.includes(searchTerm);
      
      return matchesSearch;
    });

    setFilteredTransactions(filtered);
  }, [searchTerm, transactions]);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await adminService.getTransactions({
        page: currentPage,
        limit: itemsPerPage,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        sortBy: 'createdAt',
        sortOrder: 'DESC'
      });

      setTransactions(response.data);
      setFilteredTransactions(response.data);
      setTotalPages(response.pagination.pages);
      setTotalItems(response.pagination.total);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      setError('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string, adminNotes?: string) => {
    try {
      setActionLoading(true);
      await adminService.approveTransaction(id, adminNotes);
      await fetchTransactions(); // Refresh the list
      setShowApproveModal(false);
      setSelectedTransaction(null);
    } catch (err) {
      console.error('Failed to approve transaction:', err);
      alert('Failed to approve transaction. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id: string, adminNotes?: string) => {
    try {
      setActionLoading(true);
      await adminService.rejectTransaction(id, adminNotes);
      await fetchTransactions(); // Refresh the list
      setShowRejectModal(false);
      setSelectedTransaction(null);
    } catch (err) {
      console.error('Failed to reject transaction:', err);
      alert('Failed to reject transaction. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsModal(true);
  };

  const formatAmount = (amount: number) => `KES ${amount.toLocaleString()}`;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#ff444f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Transactions
          </h1>
          <p className="text-gray-600 mt-1">Manage and approve investment transactions</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchTransactions}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw size={18} />
            <span className="text-sm font-medium">Refresh</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <Download size={18} />
            <span className="text-sm font-medium">Export</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by user, reference, or M-Pesa code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent outline-none"
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchTransactions}
            className="mt-2 text-sm text-[#ff444f] hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Reference</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Pool</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">M-Pesa Code</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {transaction.investmentReference}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div>
                      <p className="font-medium">{transaction.user.fullName}</p>
                      <p className="text-xs text-gray-500">{transaction.user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {formatAmount(transaction.investmentAmount)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{transaction.poolName}</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">
                    {transaction.mpesaTransactionCode}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(transaction.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={transaction.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setShowApproveModal(true);
                        }}
                        disabled={transaction.status !== 'pending' || actionLoading}
                        className={`p-1 rounded ${
                          transaction.status === 'pending'
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-gray-300 cursor-not-allowed'
                        }`}
                        title="Approve"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setShowRejectModal(true);
                        }}
                        disabled={transaction.status !== 'pending' || actionLoading}
                        className={`p-1 rounded ${
                          transaction.status === 'pending'
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-gray-300 cursor-not-allowed'
                        }`}
                        title="Reject"
                      >
                        <XCircle size={18} />
                      </button>
                      <button
                        onClick={() => handleViewDetails(transaction)}
                        className="p-1 rounded text-blue-600 hover:bg-blue-50"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredTransactions.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No transactions found</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} transactions
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Approve Modal */}
      <ApproveModal
        isOpen={showApproveModal}
        transaction={selectedTransaction ? {
          id: selectedTransaction.id,
          reference: selectedTransaction.investmentReference,
          user: selectedTransaction.user.fullName,
          amount: selectedTransaction.investmentAmount,
          pool: selectedTransaction.poolName,
          mpesaCode: selectedTransaction.mpesaTransactionCode
        } : null}
        onClose={() => {
          setShowApproveModal(false);
          setSelectedTransaction(null);
        }}
        onApprove={handleApprove}
        isLoading={actionLoading}
      />

      {/* Reject Modal */}
      <RejectModal
        isOpen={showRejectModal}
        transaction={selectedTransaction ? {
          id: selectedTransaction.id,
          reference: selectedTransaction.investmentReference
        } : null}
        onClose={() => {
          setShowRejectModal(false);
          setSelectedTransaction(null);
        }}
        onReject={handleReject}
        isLoading={actionLoading}
      />

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        isOpen={showDetailsModal}
        transaction={selectedTransaction}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedTransaction(null);
        }}
      />
    </motion.div>
  );
};

export default Transactions;