import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  EyeOff,
  Key, 
  ExternalLink, 
  Calendar,
  DollarSign,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  Clock,
  ChevronRight,
  CheckCircle
} from 'lucide-react';
import { userService } from '../../services/user';
import { useUser } from '../../hooks/useUser';

interface DerivToken {
  id: string;
  investmentReference: string;
  derivToken: string;
  tokenAssignedAt: string;
  tokenNotes: string | null;
  poolName: string;
  investmentAmount: number;
  status: string;
}

const TradingMonitor = () => {
  useUser();
  const [tokens, setTokens] = useState<DerivToken[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<DerivToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [visibleTokens, setVisibleTokens] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchUserTokens();
  }, []);

  useEffect(() => {
    if (!tokens.length) return;

    let filtered = tokens;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.investmentReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.poolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.tokenNotes?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    setFilteredTokens(filtered);
  }, [searchTerm, statusFilter, tokens]);

  const fetchUserTokens = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userService.getMyTokens();
      setTokens(response.data);
      setFilteredTokens(response.data);
      // Initialize visibility state (all hidden by default)
      const visibility: Record<string, boolean> = {};
      response.data.forEach(token => {
        visibility[token.id] = false;
      });
      setVisibleTokens(visibility);
    } catch (err) {
      console.error('Failed to fetch tokens:', err);
      setError('Failed to load your trading tokens. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTokenVisibility = (tokenId: string) => {
    setVisibleTokens(prev => ({
      ...prev,
      [tokenId]: !prev[tokenId]
    }));
  };

  const handleViewAccount = (token: string, reference: string) => {
    // Encode the token for URL safety
    const encodedToken = encodeURIComponent(token);
    const encodedReference = encodeURIComponent(reference);
    // Redirect to Deriv viewer with encoded parameters
    window.open(`/view-trading?token=${encodedToken}&ref=${encodedReference}`, '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => `KES ${amount.toLocaleString()}`;

  const getStatusBadge = (status: string) => {
    if (status === 'approved') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
          <CheckCircle size={12} />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
        <Clock size={12} />
        Pending
      </span>
    );
  };

  const stats = {
    total: tokens.length,
    active: tokens.filter(t => t.status === 'approved').length,
    totalInvested: tokens.reduce((sum, t) => sum + t.investmentAmount, 0)
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#ff444f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your trading accounts...</p>
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
            Trading <span className="text-[#ff444f]">Monitor</span>
          </h1>
          <p className="text-gray-600 mt-1">View and access your trading accounts</p>
        </div>
        <button
          onClick={fetchUserTokens}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RefreshCw size={18} />
          <span className="text-sm font-medium">Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      {tokens.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Key size={18} className="text-purple-600" />
              <span className="text-sm text-gray-600">Total Tokens</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={18} className="text-green-600" />
              <span className="text-sm text-gray-600">Active Accounts</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={18} className="text-blue-600" />
              <span className="text-sm text-gray-600">Total Invested</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalInvested)}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by reference, pool, or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent outline-none"
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center gap-2 min-w-[140px]">
            <Filter size={18} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent outline-none"
            >
              <option value="all">All Status</option>
              <option value="approved">Active</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchUserTokens}
            className="mt-2 text-sm text-[#ff444f] hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty State */}
      {tokens.length === 0 && !error && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Eye className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Trading Tokens</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            You don't have any trading tokens assigned yet. Once an admin assigns a Deriv token,
            it will appear here.
          </p>
        </div>
      )}

      {/* Tokens Grid */}
      {filteredTokens.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTokens.map((token) => (
            <motion.div
              key={token.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Header */}
              <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">{token.investmentReference}</h3>
                  </div>
                  {getStatusBadge(token.status)}
                </div>
                <p className="text-sm text-gray-500">{token.poolName}</p>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                {/* Amount */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Investment Amount</span>
                  <span className="font-bold text-gray-900">{formatCurrency(token.investmentAmount)}</span>
                </div>

                {/* Token Display with Eye Toggle */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-500">Deriv Token</p>
                    <button
                      onClick={() => toggleTokenVisibility(token.id)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      title={visibleTokens[token.id] ? "Hide token" : "Show token"}
                    >
                      {visibleTokens[token.id] ? (
                        <EyeOff size={16} className="text-gray-500" />
                      ) : (
                        <Eye size={16} className="text-gray-500" />
                      )}
                    </button>
                  </div>
                  <div className="font-mono text-sm break-all">
                    {visibleTokens[token.id] ? (
                      <span className="text-gray-800">{token.derivToken}</span>
                    ) : (
                      <span className="text-gray-400 select-none">
                        ••••••••••••••••••••••••••••••
                      </span>
                    )}
                  </div>
                </div>

                {/* Admin Notes */}
                {token.tokenNotes && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-600 font-medium mb-1">Admin Note</p>
                    <p className="text-xs text-blue-700">{token.tokenNotes}</p>
                  </div>
                )}

                {/* Assigned Date */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar size={12} />
                  <span>Assigned: {formatDate(token.tokenAssignedAt)}</span>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleViewAccount(token.derivToken, token.investmentReference)}
                  className="w-full flex items-center justify-center gap-2 bg-[#ff444f] text-white py-3 rounded-xl hover:bg-[#d43b44] transition-colors font-medium"
                >
                  <ExternalLink size={16} />
                  View Trading Account
                  <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* No Results */}
      {tokens.length > 0 && filteredTokens.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No matching tokens</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </motion.div>
  );
};

export default TradingMonitor;