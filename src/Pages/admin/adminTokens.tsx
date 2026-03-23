import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, CheckCircle, Clock, Users } from 'lucide-react';
import { adminService } from '../../services/admin';
import DerivTokenModal from '../../components/adminComponents/users/DerivTokenModal';

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
  derivToken?: string;
  tokenAssignedAt?: string;
  tokenAssignedBy?: string;
}

const DerivTokens = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchApprovedTransactions();
  }, []);

  const fetchApprovedTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getTransactions({
        status: 'approved',
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'DESC'
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignToken = async (transactionId: string, token: string, notes?: string) => {
    setAssigning(true);
    try {
      // This will call your backend API to save the token
      await adminService.assignDerivToken(transactionId, token, notes);
      
      // Update local state
      setTransactions(prev => prev.map(tx => 
        tx.id === transactionId 
          ? { 
              ...tx, 
              derivToken: token, 
              tokenAssignedAt: new Date().toISOString(),
              tokenAssignedBy: 'Admin'
            }
          : tx
      ));
      
      setIsModalOpen(false);
      setSelectedTransaction(null);
    } catch (error) {
      console.error('Failed to assign token:', error);
      alert('Failed to assign token. Please try again.');
    } finally {
      setAssigning(false);
    }
  };

  const openAssignModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const formatCurrency = (amount: number) => `KES ${amount.toLocaleString()}`;
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Deriv <span className="text-[#ff444f]">Tokens</span>
          </h1>
          <p className="text-gray-600 mt-1">Assign Deriv tokens to users to view their trading accounts</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Users size={18} className="text-blue-600" />
            <span className="text-sm text-gray-600">Total Approved</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={18} className="text-green-600" />
            <span className="text-sm text-gray-600">Tokens Assigned</span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {transactions.filter(t => t.derivToken).length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={18} className="text-yellow-600" />
            <span className="text-sm text-gray-600">Pending Assignment</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600">
            {transactions.filter(t => !t.derivToken).length}
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Investor</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Reference</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Pool</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Token Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{tx.user.fullName}</p>
                      <p className="text-xs text-gray-500">{tx.user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">
                    {tx.investmentReference}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {formatCurrency(tx.investmentAmount)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{tx.poolName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(tx.createdAt)}</td>
                  <td className="px-6 py-4">
                    {tx.derivToken ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        <CheckCircle size={12} />
                        Assigned
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                        <Clock size={12} />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openAssignModal(tx)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                    >
                      <Key size={14} />
                      {tx.derivToken ? 'Update Token' : 'Assign Token'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {transactions.length === 0 && (
          <div className="text-center py-12">
            <Key className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-500">No approved transactions available for token assignment.</p>
          </div>
        )}
      </div>

      {/* Assign Token Modal */}
      <DerivTokenModal
        isOpen={isModalOpen}
        transaction={selectedTransaction}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTransaction(null);
        }}
        onAssignToken={handleAssignToken}
        isLoading={assigning}
      />
    </motion.div>
  );
};

export default DerivTokens;