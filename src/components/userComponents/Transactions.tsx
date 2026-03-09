import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, PlusCircle, RefreshCw, AlertCircle } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import { userService, type TransactionListItem, type Transaction } from '../../services/user';
import { useNavigate } from 'react-router-dom';
import TransactionDetailsModal from './resuableComponents.tsx/TransactionDetailsModal';

const UserTransactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<TransactionListItem[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTransactions();
  }, [currentPage]);

  useEffect(() => {
    if (!transactions.length) return;

    const filtered = transactions.filter(t => 
      t.investmentReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.mpesaTransactionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.poolName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredTransactions(filtered);
  }, [searchTerm, transactions]);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await userService.getMyTransactions({
        page: currentPage,
        limit: itemsPerPage,
        sortBy: 'createdAt',
        sortOrder: 'DESC'
      });

      setTransactions(response.data);
      setFilteredTransactions(response.data);
      setTotalPages(response.pagination.pages);
      setTotalItems(response.pagination.total);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setError('Failed to load transactions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async (transaction: TransactionListItem) => {
    try {
      setLoadingDetails(true);
      // Fetch full transaction details
      const response = await userService.getTransactionDetails(transaction.id);
      setSelectedTransaction(response.data);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Failed to fetch transaction details:', error);
      alert('Failed to load transaction details. Please try again.');
    } finally {
      setLoadingDetails(false);
    }
  };

  const formatCurrency = (amount: number) => `KES ${amount.toLocaleString()}`;

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
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              My <span className="text-[#ff444f]">Transactions</span>
            </h1>
            <p className="text-gray-600 mt-1">View your investment history</p>
          </div>
          <button
            onClick={fetchTransactions}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} className="text-gray-600" />
          </button>
        </div>
        
        {/* New Investment Button - Full width on mobile, aligned left */}
        <button
          onClick={() => navigate('/investments/new')}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-[#ff444f] text-white rounded-lg hover:bg-[#d43b44] transition-colors sm:ml-0"
        >
          <PlusCircle size={18} />
          <span>New Investment</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchTransactions}
            className="mt-2 text-sm text-[#ff444f] hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by reference, pool, or M-Pesa code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {filteredTransactions.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredTransactions.map((tx) => (
              <div 
                key={tx.id} 
                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${loadingDetails ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={() => handleViewDetails(tx)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{tx.investmentReference}</span>
                  <StatusBadge status={tx.status} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Amount</p>
                    <p className="font-medium text-gray-900">{formatCurrency(tx.investmentAmount)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Pool</p>
                    <p className="text-gray-700">{tx.poolName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date</p>
                    <p className="text-gray-700">{formatDate(tx.createdAt)}</p>
                  </div>
                  <div className="flex items-center justify-end">
                    {loadingDetails ? (
                      <div className="w-4 h-4 border-2 border-[#ff444f] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Eye size={18} className="text-[#ff444f]" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No transactions found</p>
            <button
              onClick={() => navigate('/investments/new')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff444f] text-white rounded-lg hover:bg-[#d43b44] transition-colors"
            >
              <PlusCircle size={18} />
              Start Investing
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl shadow-lg p-4 border border-gray-100">
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

export default UserTransactions;