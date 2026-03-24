import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, ArrowLeft, TrendingUp, DollarSign, Calendar, User } from 'lucide-react';
import { useTradingSession } from '../../context/tradingContext';
import { userService } from '../../services/user';

interface AccountData {
  balance: number;
  currency: string;
  loginid: string;
  email: string;
  landing_company: string;
}

interface Transaction {
  transaction_id: string;
  transaction_time: number;
  action_type: string;
  amount: number;
  balance_after: number;
  currency: string;
}

const DerivViewer = () => {
  const navigate = useNavigate();
  const { session, clearSession } = useTradingSession();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'statement'>('overview');

  useEffect(() => {
    if (!session) {
      setError('No trading session found. Please go back and try again.');
      setLoading(false);
      return;
    }

    if (!session.token) {
      setError('Invalid session: missing token');
      setLoading(false);
      return;
    }

    fetchAccountData();
  }, [session]);

  const fetchAccountData = async () => {
    if (!session?.token) return;

    try {
      setLoading(true);
      setError(null);

      // Call backend proxy through service
      const response = await userService.getDerivAccountData(session.token, 10);

      if (response.success && response.data) {
        setAccountData({
          balance: response.data.account.balance,
          currency: response.data.account.currency,
          loginid: response.data.account.loginid,
          email: response.data.account.email,
          landing_company: response.data.account.landing_company
        });
        setTransactions(response.data.transactions);
      } else {
        throw new Error(response.error || 'Failed to fetch account data');
      }

    } catch (err: any) {
      console.error('Failed to fetch Deriv data:', err);
      setError(err.message || 'Failed to load trading account data. The token may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return `${currency} ${amount.toLocaleString()}`;
  };

  const getActionIcon = (action: string) => {
    if (action.includes('BUY')) return '📈';
    if (action.includes('SELL')) return '📉';
    if (action.includes('DEPOSIT')) return '💰';
    if (action.includes('WITHDRAWAL')) return '💸';
    return '🔄';
  };

  const handleGoBack = () => {
    clearSession();
    navigate('/user/monitor');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <Loader2 className="w-12 h-12 text-[#ff444f] animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Trading Account...
          </h2>
          <p className="text-gray-600">
            Fetching your account details from Deriv
          </p>
          {session?.investmentReference && (
            <div className="mt-4 text-sm text-gray-500">
              Investment: {session.investmentReference}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={fetchAccountData}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#ff444f] text-white px-6 py-2 rounded-lg hover:bg-[#d43b44] transition-colors"
            >
              <Loader2 size={16} className="animate-spin" />
              Retry
            </button>
            <button
              onClick={handleGoBack}
              className="w-full inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Trading Monitor
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleGoBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Back to Monitor"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Deriv Trading Account</h1>
                <p className="text-sm text-gray-500">{session?.investmentReference}</p>
              </div>
            </div>
            <button
              onClick={fetchAccountData}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <Loader2 size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Account Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={18} className="text-green-600" />
              <span className="text-sm text-gray-600">Balance</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(accountData?.balance || 0, accountData?.currency)}
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <User size={18} className="text-blue-600" />
              <span className="text-sm text-gray-600">Account ID</span>
            </div>
            <p className="text-lg font-mono text-gray-900">{accountData?.loginid}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={18} className="text-purple-600" />
              <span className="text-sm text-gray-600">Landing Company</span>
            </div>
            <p className="text-lg font-medium text-gray-900">{accountData?.landing_company}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={18} className="text-orange-600" />
              <span className="text-sm text-gray-600">Pool</span>
            </div>
            <p className="text-lg font-medium text-gray-900">{session?.poolName}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'border-b-2 border-[#ff444f] text-[#ff444f]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('statement')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'statement'
                  ? 'border-b-2 border-[#ff444f] text-[#ff444f]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Recent Transactions
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Investment Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Investment Reference:</span>
                      <p className="font-mono text-gray-900">{session?.investmentReference}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Pool Name:</span>
                      <p className="text-gray-900">{session?.poolName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Investment Amount:</span>
                      <p className="text-gray-900">KES {session?.investmentAmount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Token Status:</span>
                      <p className="text-green-600">Active</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> This is a read-only view of your trading account. 
                    You can see your balance and recent activity.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'statement' && (
              <div className="overflow-x-auto">
                {transactions.length > 0 ? (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Balance After</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {transactions.map((item) => (
                        <tr key={item.transaction_id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {formatDate(item.transaction_time)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="flex items-center gap-1">
                              <span>{getActionIcon(item.action_type)}</span>
                              <span className="text-gray-700">{item.action_type}</span>
                            </span>
                          </td>
                          <td className={`px-4 py-3 text-sm text-right font-medium ${
                            item.amount >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {item.amount >= 0 ? '+' : ''}{formatCurrency(Math.abs(item.amount), item.currency)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-gray-700">
                            {formatCurrency(item.balance_after, item.currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No recent transactions found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DerivViewer;