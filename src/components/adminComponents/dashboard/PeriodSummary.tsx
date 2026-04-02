// src/components/adminComponents/dashboard/PeriodSummary.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Calendar, DollarSign, TrendingUp, Users } from 'lucide-react';
import { adminService } from '../../../services/admin';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Formats a number as a compact KES string.
 * Ensures no floating-point artifacts reach the screen.
 */
const fmtAmount = (n: number): string => {
  if (!Number.isFinite(n) || n <= 0) return 'KES 0';
  if (n >= 1_000_000) return `KES ${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `KES ${(n / 1_000).toFixed(1)}K`;
  return `KES ${Math.round(n).toLocaleString()}`;
};

const fmtCount = (n: number): string =>
  Number.isFinite(n) ? Math.round(n).toLocaleString() : '0';

// ─── Component ────────────────────────────────────────────────────────────────

type Period = 'week' | 'month' | 'year';

const PERIODS: { key: Period; label: string }[] = [
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year' },
];

const PERIOD_DAYS: Record<Period, number> = { week: 7, month: 30, year: 365 };

const PeriodSummary = () => {
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activePeriod, setActivePeriod] = useState<Period>('week');

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getDashboardStats();
      setSummary(response.data.periodSummary);
    } catch (err) {
      console.error('Failed to fetch period summary:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const periodData =
    summary &&
    (activePeriod === 'week'
      ? summary.thisWeek
      : activePeriod === 'month'
      ? summary.thisMonth
      : summary.thisYear);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse space-y-4">
        <div className="h-5 w-32 bg-gray-100 rounded" />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => <div key={i} className="flex-1 h-9 bg-gray-100 rounded-xl" />)}
        </div>
        {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-gray-100 rounded-xl" />)}
      </div>
    );
  }

  if (!summary) return null;

  const invested = periodData?.investedAmount ?? 0;
  const days = PERIOD_DAYS[activePeriod];
  const avgDaily = invested > 0 ? fmtAmount(invested / days) : null;

  const metrics = [
    {
      key: 'users',
      bg: 'from-blue-50 to-blue-100/60',
      iconColor: 'text-blue-600',
      icon: <Users size={14} />,
      label: 'New Users',
      value: fmtCount(periodData?.newUsers ?? 0),
      isAmount: false,
    },
    {
      key: 'investments',
      bg: 'from-green-50 to-green-100/60',
      iconColor: 'text-green-600',
      icon: <TrendingUp size={14} />,
      label: 'New Investments',
      value: fmtCount(periodData?.newInvestments ?? 0),
      isAmount: false,
    },
    {
      key: 'amount',
      bg: 'from-amber-50 to-amber-100/60',
      iconColor: 'text-amber-600',
      icon: <DollarSign size={14} />,
      label: 'Total Invested',
      value: fmtAmount(invested),
      isAmount: true,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-[#ff444f]" />
          <h2 className="text-base font-bold text-gray-900">Period Summary</h2>
        </div>
        <ArrowUpRight size={16} className="text-green-500" />
      </div>

      {/* Period Tabs */}
      <div className="flex gap-2 mb-5">
        {PERIODS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActivePeriod(key)}
            className={`flex-1 py-2 text-sm rounded-xl font-medium transition-all ${
              activePeriod === key
                ? 'bg-[#ff444f] text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Metric Cards */}
      <div className="space-y-3">
        {metrics.map(({ key, bg, iconColor, icon, label, value, isAmount }, i) => (
          <motion.div
            key={`${key}-${activePeriod}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-gradient-to-r ${bg} rounded-xl p-3`}
          >
            <div className={`flex items-center gap-1.5 ${iconColor} mb-1`}>
              {icon}
              <span className="text-xs font-medium">{label}</span>
            </div>
            {/* Use truncate + title so very large amounts never overflow */}
            <p
              className={`font-bold text-gray-900 truncate ${isAmount ? 'text-lg' : 'text-2xl'}`}
              title={value}
            >
              {value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Average Daily Footer */}
      {avgDaily && activePeriod !== 'year' && (
        <p className="text-xs text-gray-400 text-center mt-4">
          Avg daily: <span className="font-medium text-gray-600">{avgDaily}</span>
        </p>
      )}
    </div>
  );
};

export default PeriodSummary;