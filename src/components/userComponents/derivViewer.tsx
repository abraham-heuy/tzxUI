import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle, ArrowLeft, TrendingUp, TrendingDown,
  DollarSign, User, RefreshCw, Activity, BarChart2,
  ArrowUpRight, ArrowDownRight, Minus, Shield, Zap,
  Clock, Hash, Wallet, ChevronRight, ChevronDown
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import { useTradingSession } from '../../context/tradingContext';
import { userService } from '../../services/user';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AccountData {
  balance: number;
  currency: string;
  loginid: string;
  email: string;
  landing_company: string;
  is_virtual: boolean;
}

interface Transaction {
  transaction_id: string;
  transaction_time: number;
  action_type: string;
  amount: number;
  balance_after: number;
  currency: string;
  shortcode?: string;
  longcode?: string;
  payout?: number;
}

type Tab = 'overview' | 'statement' | 'analytics';

const PAGE_SIZE = 10;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number, currency = 'USD') =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency, minimumFractionDigits: 2 }).format(n);

const fmtDate = (ts: number) =>
  new Date(ts * 1000).toLocaleString('en-KE', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

const fmtShortDate = (ts: number) =>
  new Date(ts * 1000).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' });

const actionStyle = (action: string) => {
  switch (action) {
    case 'buy':        return { text: 'text-blue-600',    bg: 'bg-blue-50',    icon: <ArrowUpRight   size={14} className="text-blue-500"    /> };
    case 'sell':       return { text: 'text-emerald-600', bg: 'bg-emerald-50', icon: <ArrowDownRight size={14} className="text-emerald-500" /> };
    case 'deposit':    return { text: 'text-green-600',   bg: 'bg-green-50',   icon: <ArrowUpRight   size={14} className="text-green-500"   /> };
    case 'withdrawal': return { text: 'text-red-600',     bg: 'bg-red-50',     icon: <ArrowDownRight size={14} className="text-red-500"     /> };
    default:           return { text: 'text-gray-600',    bg: 'bg-gray-50',    icon: <Minus          size={14} className="text-gray-400"    /> };
  }
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const ChartTooltip = ({ active, payload, label, currency }: any) => {
  if (!active || !payload?.length) return null;
  const v = payload[0].value;
  return (
    <div className="bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-white/40 text-xs mb-1">{label}</p>
      <p className={`font-bold text-sm ${v >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
        {v >= 0 ? '+' : ''}{fmt(v, currency)}
      </p>
    </div>
  );
};

const StatCard = ({ icon, label, value, sub, accent, delay = 0 }: {
  icon: React.ReactNode; label: string; value: string;
  sub?: string; accent: string; delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${accent}`}>
      {icon}
    </div>
    <p className="text-xs text-gray-400 uppercase tracking-widest">{label}</p>
    <p className="text-xl font-black text-gray-900 mt-0.5 leading-tight">{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </motion.div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const DerivViewer = () => {
  const navigate = useNavigate();
  const { session, clearSession } = useTradingSession();

  const [error, setError]               = useState<string | null>(null);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [accountData, setAccountData]   = useState<AccountData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab]       = useState<Tab>('overview');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    if (!session?.token) {
      setError('No trading session found. Please go back and try again.');
      setLoading(false);
      return;
    }
    fetchAccountData();
  }, [session]);

  useEffect(() => {
    if (activeTab === 'statement') setVisibleCount(PAGE_SIZE);
  }, [activeTab]);

  const fetchAccountData = async (isRefresh = false) => {
    if (!session?.token) return;
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError(null);

      const response = await userService.getDerivAccountData(session.token, 50);

      if (response.success && response.data) {
        const raw = response.data.account;
        
        // ✅ Fixed: map backend fields correctly
        setAccountData({
          balance:         raw.balance ?? 0,
          currency:        raw.currency ?? 'USD',
          loginid:         raw.loginid ?? '',
          email:           raw.email ?? '',
          landing_company: raw.landing_company_name ?? '', 
          is_virtual:      raw.is_virtual === 1, 
        });
        setTransactions(response.data.transactions || []);
        setVisibleCount(PAGE_SIZE);
      } else {
        throw new Error(response.error || 'Failed to fetch account data');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load trading account data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ── Analytics (derived) ───────────────────────────────────────────────────

  const analytics = useMemo(() => {
    if (!transactions.length) return null;

    const sells = transactions.filter(t => t.action_type === 'sell');
    const buys  = transactions.filter(t => t.action_type === 'buy');

    const wins   = sells.filter(t => t.amount > 0);
    const losses = sells.filter(t => t.amount <= 0);
    const winRate = sells.length ? Math.round((wins.length / sells.length) * 100) : 0;

    const totalPnL  = sells.reduce((s, t) => s + t.amount, 0);
    const avgWin    = wins.length   ? wins.reduce((s, t)   => s + t.amount,          0) / wins.length   : 0;
    const avgLoss   = losses.length ? losses.reduce((s, t) => s + Math.abs(t.amount), 0) / losses.length : 0;
    const profitFactor = avgLoss > 0 ? avgWin / avgLoss : 0;

    const totalDeposits    = transactions.filter(t => t.action_type === 'deposit')   .reduce((s, t) => s + t.amount,          0);
    const totalWithdrawals = transactions.filter(t => t.action_type === 'withdrawal').reduce((s, t) => s + Math.abs(t.amount), 0);

    let cum = 0;
    const pnlChart = [...sells].reverse().map(t => {
      cum += t.amount;
      return { date: fmtShortDate(t.transaction_time), value: +cum.toFixed(2) };
    });

    const actionCounts: Record<string, number> = {};
    transactions.forEach(t => { actionCounts[t.action_type] = (actionCounts[t.action_type] || 0) + 1; });
    const actionChart = Object.entries(actionCounts).map(([name, count]) => ({ name, count }));

    const healthScore = Math.min(100, Math.round(
      (winRate * 0.4) +
      (Math.min(profitFactor, 3) / 3 * 30) +
      (totalPnL > 0 ? 30 : Math.max(0, 30 + totalPnL / 10))
    ));

    return {
      wins, losses, winRate, totalPnL, avgWin, avgLoss,
      profitFactor, totalDeposits, totalWithdrawals,
      pnlChart, actionChart, healthScore,
      totalTrades: sells.length,
      buyCount: buys.length,
    };
  }, [transactions]);

  const handleGoBack = () => { clearSession(); navigate('/user/monitor'); };

  const visibleTransactions = transactions.slice(0, visibleCount);
  const hasMore = visibleCount < transactions.length;
  const loadMore = () => setVisibleCount(prev => Math.min(prev + PAGE_SIZE, transactions.length));

  // ── Loading ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500;700&display=swap');`}</style>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-6">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
            <div className="absolute inset-0 rounded-full border-4 border-t-[#ff444f] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          </div>
          <p className="font-bold text-gray-800 text-lg" style={{ fontFamily: "'Syne', sans-serif" }}>
            Fetching Account Data
          </p>
          <p className="text-gray-400 text-sm mt-1">{session?.investmentReference}</p>
        </motion.div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500;700&display=swap');`}</style>
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
            Could Not Load Account
          </h2>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <div className="space-y-3">
            <button onClick={() => fetchAccountData()}
              className="w-full flex items-center justify-center gap-2 bg-[#ff444f] text-white py-3 rounded-xl font-semibold hover:bg-[#d43b44] transition-colors">
              <RefreshCw size={16} /> Retry
            </button>
            <button onClick={handleGoBack}
              className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              <ArrowLeft size={16} /> Back to Monitor
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currency    = accountData?.currency ?? 'USD';
  const pnlPositive = (analytics?.totalPnL ?? 0) >= 0;

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview',  label: 'Overview',     icon: <Wallet size={14} />    },
    { key: 'analytics', label: 'Analytics',    icon: <BarChart2 size={14} /> },
    { key: 'statement', label: 'Transactions', icon: <Clock size={14} />     },
  ];

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500;700&family=DM+Mono:wght@400;500&display=swap');`}</style>

      {/* ── Top Bar ── */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <button onClick={handleGoBack}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-800 transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium hidden sm:block">Back</span>
          </button>

          <div className="text-center flex-1 min-w-0">
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] truncate">{session?.poolName}</p>
            <p className="text-sm font-bold text-gray-800 truncate" style={{ fontFamily: "'DM Mono', monospace" }}>
              {session?.investmentReference}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {accountData?.is_virtual && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100">
                <Zap size={10} /> Demo
              </span>
            )}
            <button onClick={() => fetchAccountData(true)} disabled={refreshing}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-40 transition-colors">
              <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── Hero Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden shadow-xl"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
        >
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #ff444f, transparent 70%)' }} />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full opacity-[0.08] pointer-events-none"
            style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }} />

          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between gap-6">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-2">Account Balance</p>
                <p className="text-4xl sm:text-5xl font-black text-white tabular-nums leading-none"
                  style={{ fontFamily: "'Syne', sans-serif" }}>
                  {fmt(accountData?.balance || 0, currency)}
                </p>
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <p className="text-white/30 text-xs" style={{ fontFamily: "'DM Mono', monospace" }}>
                    {accountData?.loginid}
                  </p>
                  <span className="text-white/10">·</span>
                  <p className="text-white/30 text-xs">{accountData?.landing_company}</p>
                </div>
                {accountData?.email && (
                  <p className="text-white/20 text-xs mt-1">{accountData.email}</p>
                )}
              </div>

              <div className="flex sm:flex-col gap-4 sm:gap-3 sm:text-right flex-wrap">
                <div>
                  <p className="text-white/30 text-[10px] uppercase tracking-widest">Invested (KES)</p>
                  <p className="text-lg font-bold text-white mt-0.5">
                    {fmt(session?.investmentAmount || 0, 'KES')}
                  </p>
                </div>
                {analytics && (
                  <>
                    <div>
                      <p className="text-white/30 text-[10px] uppercase tracking-widest">Total P&L</p>
                      <p className={`text-lg font-bold mt-0.5 ${pnlPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                        {pnlPositive ? '+' : ''}{fmt(analytics.totalPnL, currency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/30 text-[10px] uppercase tracking-widest">Win Rate</p>
                      <p className="text-lg font-bold text-sky-400 mt-0.5">{analytics.winRate}%</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {analytics && (
              <div className="mt-6 pt-5 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/40 text-xs uppercase tracking-widest flex items-center gap-1.5">
                    <Shield size={11} /> Account Health Score
                  </span>
                  <span className={`text-sm font-bold ${
                    analytics.healthScore >= 70 ? 'text-emerald-400'
                    : analytics.healthScore >= 40 ? 'text-amber-400'
                    : 'text-red-400'
                  }`}>{analytics.healthScore}/100</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${analytics.healthScore}%` }}
                    transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      analytics.healthScore >= 70 ? 'bg-emerald-400'
                      : analytics.healthScore >= 40 ? 'bg-amber-400'
                      : 'bg-red-400'
                    }`}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Stat Tiles ── */}
        {analytics && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard delay={0.05} accent="bg-violet-50"  label="Total Trades"   value={String(analytics.totalTrades)}        sub="closed positions"              icon={<Activity   size={18} className="text-violet-600" />} />
            <StatCard delay={0.10} accent="bg-emerald-50" label="Winning Trades" value={String(analytics.wins.length)}         sub={`${analytics.winRate}% win rate`} icon={<TrendingUp size={18} className="text-emerald-600"/>} />
            <StatCard delay={0.15} accent="bg-red-50"     label="Losing Trades"  value={String(analytics.losses.length)}       sub="closed at loss"                icon={<TrendingDown size={18} className="text-red-500"  />} />
            <StatCard delay={0.20} accent="bg-blue-50"    label="Profit Factor"  value={analytics.profitFactor.toFixed(2)+'x'} sub="avg win / avg loss"            icon={<BarChart2  size={18} className="text-blue-600"  />} />
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === tab.key
                    ? 'text-[#ff444f] border-b-2 border-[#ff444f] bg-red-50/30'
                    : 'text-gray-400 hover:text-gray-600'
                }`}>
                {tab.icon}
                <span className="hidden sm:block">{tab.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* ── Overview ── */}
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Login ID',       value: accountData?.loginid,                                    icon: <Hash       size={15} className="text-gray-400" />, mono: true  },
                    { label: 'Account Type',   value: accountData?.is_virtual ? 'Virtual / Demo' : 'Real',     icon: <Shield     size={15} className="text-gray-400" />, mono: false },
                    { label: 'Currency',       value: accountData?.currency,                                   icon: <DollarSign size={15} className="text-gray-400" />, mono: false },
                    { label: 'Landing Co.',    value: accountData?.landing_company,                            icon: <User       size={15} className="text-gray-400" />, mono: false },
                    { label: 'Investment Ref', value: session?.investmentReference,                            icon: <Hash       size={15} className="text-gray-400" />, mono: true  },
                    { label: 'Pool',           value: session?.poolName,                                       icon: <Activity   size={15} className="text-gray-400" />, mono: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0">
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">{item.label}</p>
                        <p className={`font-semibold text-gray-800 text-sm truncate mt-0.5 ${item.mono ? "font-['DM_Mono',monospace]" : ''}`}>
                          {item.value || '—'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {analytics && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: 'Total Deposits',    value: fmt(analytics.totalDeposits, currency),    color: 'text-green-600',   bg: 'bg-green-50'   },
                      { label: 'Withdrawals',       value: fmt(analytics.totalWithdrawals, currency),  color: 'text-red-500',     bg: 'bg-red-50'     },
                      { label: 'Net P&L',           value: `${pnlPositive?'+':''}${fmt(analytics.totalPnL,currency)}`, color: pnlPositive?'text-emerald-600':'text-red-500', bg: pnlPositive?'bg-emerald-50':'bg-red-50' },
                      { label: 'Avg Win',           value: fmt(analytics.avgWin, currency),           color: 'text-emerald-600', bg: 'bg-emerald-50' },
                      { label: 'Avg Loss',          value: fmt(analytics.avgLoss, currency),          color: 'text-red-500',     bg: 'bg-red-50'     },
                      { label: 'Profit Factor',     value: analytics.profitFactor.toFixed(2)+'x',     color: 'text-blue-600',    bg: 'bg-blue-50'    },
                    ].map((s, i) => (
                      <div key={i} className={`rounded-xl p-4 ${s.bg}`}>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">{s.label}</p>
                        <p className={`text-base font-black mt-1 tabular-nums ${s.color}`}>{s.value}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-blue-50 rounded-xl p-4 flex gap-3">
                  <Shield size={16} className="text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-700">
                    <strong>Read-only view</strong> of the trader's account assigned to your investment.
                    You cannot place or modify trades from here.
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── Analytics ── */}
            {activeTab === 'analytics' && (
              <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="p-6 space-y-6">
                {!analytics || analytics.pnlChart.length === 0 ? (
                  <div className="py-16 text-center text-gray-400">
                    <BarChart2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No trade data to analyse yet</p>
                  </div>
                ) : (
                  <>
                    {/* P&L Chart */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-widest">Cumulative P&L</p>
                          <p className={`text-2xl font-black tabular-nums mt-0.5 ${pnlPositive ? 'text-emerald-600' : 'text-red-500'}`}
                            style={{ fontFamily: "'Syne', sans-serif" }}>
                            {pnlPositive ? '+' : ''}{fmt(analytics.totalPnL, currency)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400 uppercase tracking-widest">Trades</p>
                          <p className="text-2xl font-black text-gray-800 mt-0.5" style={{ fontFamily: "'Syne', sans-serif" }}>
                            {analytics.totalTrades}
                          </p>
                        </div>
                      </div>
                      <div className="h-52">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={analytics.pnlChart} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                            <defs>
                              <linearGradient id="pnlFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor={pnlPositive ? '#10b981' : '#ef4444'} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={pnlPositive ? '#10b981' : '#ef4444'} stopOpacity={0}   />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                            <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} width={52} tickFormatter={v => v.toFixed(1)} />
                            <Tooltip content={<ChartTooltip currency={currency} />} />
                            <Area type="monotone" dataKey="value"
                              stroke={pnlPositive ? '#10b981' : '#ef4444'} strokeWidth={2.5}
                              fill="url(#pnlFill)" dot={false}
                              activeDot={{ r: 5, fill: pnlPositive ? '#10b981' : '#ef4444', strokeWidth: 0 }} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Win/Loss + Activity */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="bg-gray-50 rounded-2xl p-5">
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Win vs Loss</p>
                        <div className="h-40">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={[{ name: 'Wins', value: analytics.wins.length }, { name: 'Losses', value: analytics.losses.length }]}
                              margin={{ top: 0, right: 0, bottom: 0, left: -20 }}
                            >
                              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} content={({ active, payload }) => {
                                if (!active || !payload?.length) return null;
                                return (
                                  <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-lg text-sm font-semibold text-gray-800">
                                    {payload[0].payload.name}: {payload[0].value}
                                  </div>
                                );
                              }} />
                              <Bar dataKey="value" radius={[6,6,0,0]}>
                                <Cell fill="#10b981" />
                                <Cell fill="#ef4444" />
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-sm">
                          <span className="text-gray-400">Win Rate</span>
                          <span className={`font-black ${analytics.winRate >= 50 ? 'text-emerald-600' : 'text-red-500'}`}>
                            {analytics.winRate}%
                          </span>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-2xl p-5">
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Activity Breakdown</p>
                        <div className="space-y-3">
                          {analytics.actionChart.map((item, i) => {
                            const max = Math.max(...analytics.actionChart.map(a => a.count));
                            const pct = max > 0 ? (item.count / max) * 100 : 0;
                            const colors = ['bg-blue-400','bg-emerald-400','bg-amber-400','bg-violet-400','bg-red-400'];
                            return (
                              <div key={item.name}>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-500 capitalize">{item.name}</span>
                                  <span className="font-bold text-gray-700">{item.count}</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{ delay: i * 0.1, duration: 0.6, ease: 'easeOut' }}
                                    className={`h-full rounded-full ${colors[i % colors.length]}`}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Key metrics */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Avg Win',     value: fmt(analytics.avgWin, currency),           color: 'text-emerald-600' },
                        { label: 'Avg Loss',    value: fmt(analytics.avgLoss, currency),          color: 'text-red-500'     },
                        { label: 'P. Factor',   value: analytics.profitFactor.toFixed(2) + 'x',  color: 'text-blue-600'    },
                      ].map(m => (
                        <div key={m.label} className="bg-gray-50 rounded-xl p-4 text-center">
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest">{m.label}</p>
                          <p className={`text-base font-black mt-1 tabular-nums ${m.color}`}>{m.value}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* ── Transactions ── */}
            {activeTab === 'statement' && (
              <motion.div key="statement" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {transactions.length === 0 ? (
                  <div className="py-16 text-center text-gray-400">
                    <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No transactions found</p>
                  </div>
                ) : (
                  <>
                    <div className="px-5 py-3 border-b border-gray-50 flex items-center justify-between bg-gray-50/60">
                      <p className="text-xs text-gray-400 uppercase tracking-widest">
                        Showing <span className="font-bold text-gray-600">{visibleTransactions.length}</span> of{' '}
                        <span className="font-bold text-gray-600">{transactions.length}</span> transactions
                      </p>
                    </div>

                    <div className="divide-y divide-gray-50">
                      <AnimatePresence initial={false}>
                        {visibleTransactions.map((item, i) => {
                          const style = actionStyle(item.action_type);
                          return (
                            <motion.div
                              key={item.transaction_id}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i < PAGE_SIZE ? i * 0.02 : 0 }}
                              className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50/80 transition-colors"
                            >
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${style.bg}`}>
                                {style.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className={`text-xs font-bold uppercase ${style.text}`}>
                                  {item.action_type}
                                </span>
                                <p className="text-xs text-gray-400 mt-0.5">{fmtDate(item.transaction_time)}</p>
                                {item.longcode && (
                                  <p className="text-xs text-gray-400 truncate mt-0.5 max-w-xs">{item.longcode}</p>
                                )}
                              </div>
                              <div className="text-right shrink-0">
                                <p className={`text-sm font-bold tabular-nums ${item.amount >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                  {item.amount >= 0 ? '+' : ''}{fmt(Math.abs(item.amount), item.currency || currency)}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  Bal: {fmt(item.balance_after, item.currency || currency)}
                                </p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>

                    {hasMore && (
                      <div className="px-5 py-4 border-t border-gray-50">
                        <button
                          onClick={loadMore}
                          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all"
                        >
                          <ChevronDown size={16} />
                          Load {Math.min(PAGE_SIZE, transactions.length - visibleCount)} more
                          <span className="text-gray-400 font-normal">
                            ({transactions.length - visibleCount} remaining)
                          </span>
                        </button>
                      </div>
                    )}

                    {!hasMore && transactions.length > PAGE_SIZE && (
                      <div className="px-5 py-4 border-t border-gray-50 text-center">
                        <p className="text-xs text-gray-400">
                          All {transactions.length} transactions loaded
                        </p>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-300 text-xs pb-4 flex items-center justify-center gap-1.5">
          <Shield size={10} />
          Read-only · Deriv API · {accountData?.is_virtual ? 'Demo Account' : 'Live Account'}
          <ChevronRight size={10} />
          {accountData?.loginid}
        </p>
      </div>
    </div>
  );
};

export default DerivViewer;