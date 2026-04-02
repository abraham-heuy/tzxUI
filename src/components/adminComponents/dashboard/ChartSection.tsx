// src/components/adminComponents/dashboard/ChartsSection.tsx
import { useEffect, useState } from 'react';
import { adminService } from '../../../services/admin';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Users, PieChart as PieIcon } from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TABS = [
  { key: 'users', label: 'New Users', icon: <Users size={14} /> },
  { key: 'roles', label: 'Role Split', icon: <PieIcon size={14} /> },
] as const;

type TabKey = (typeof TABS)[number]['key'];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const ChartTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const raw = payload[0].value;
  const safeRaw = isNaN(raw) || raw === undefined ? 0 : raw;
  const display = safeRaw.toLocaleString();
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 text-sm">
      <p className="text-gray-500 text-xs mb-0.5">{label}</p>
      <p className="font-semibold text-gray-900">{display}</p>
    </div>
  );
};

// ─── Donut Label ──────────────────────────────────────────────────────────────

const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + r * Math.cos((-midAngle * Math.PI) / 180);
  const y = cy + r * Math.sin((-midAngle * Math.PI) / 180);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// ─── Color Palette ────────────────────────────────────────────────────────────

const ROLE_COLORS = ['#ff444f', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = ({ label }: { label: string }) => (
  <div className="h-64 flex flex-col items-center justify-center gap-2 text-gray-300">
    <Users size={32} />
    <p className="text-sm">{label}</p>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const ChartsSection = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('users');

  useEffect(() => {
    (async () => {
      try {
        const res = await adminService.getDashboardStats();
        setData(res.data);
      } catch (e) {
        console.error('Chart fetch error:', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex justify-center items-center h-72">
          <div className="w-8 h-8 border-4 border-[#ff444f] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const usersData: any[] = data.charts?.dailyNewUsers ?? [];

  // Safe data processing with fallbacks
  const totalUsers = usersData.reduce((s: number, d: any) => s + (Number(d?.count) || 0), 0);
  const peakUsers = usersData.length ? Math.max(...usersData.map((d: any) => Number(d?.count) || 0)) : 0;

  const roleData = [
    { name: 'Investors', value: data.roleDistribution?.investors ?? 0 },
    { name: 'Admins', value: data.roleDistribution?.admins ?? 0 },
    { name: 'Others', value: data.roleDistribution?.other ?? 0 },
  ].filter((d) => d.value > 0);

  const roleTotal = roleData.reduce((s, d) => s + d.value, 0);

  const axisStyle = { fontSize: 11, fill: '#9ca3af' };
  const gridColor = '#f3f4f6';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h2 className="text-base font-bold text-gray-900">Analytics</h2>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {TABS.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                activeTab === key
                  ? 'bg-[#ff444f] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── New Users ── */}
      {activeTab === 'users' && (
        <>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-0.5">Total (period)</p>
              <p className="text-lg font-bold text-gray-900">{totalUsers.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-0.5">Peak day</p>
              <p className="text-lg font-bold text-[#ff444f]">{peakUsers.toLocaleString()}</p>
            </div>
          </div>

          {usersData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={usersData} margin={{ top: 4, right: 12, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff444f" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#ff444f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke={gridColor} vertical={false} />
                <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#ff444f"
                  strokeWidth={2.5}
                  fill="url(#gradUsers)"
                  dot={{ r: 3, fill: '#ff444f', strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#ff444f', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState label="No user data available" />
          )}
        </>
      )}

      {/* ── Role Distribution ── */}
      {activeTab === 'roles' && (
        <>
          {roleData.length > 0 ? (
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-full md:w-1/2">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={roleData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      label={PieLabel}
                      labelLine={false}
                    >
                      {roleData.map((_, i) => (
                        <Cell key={i} fill={ROLE_COLORS[i % ROLE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: any) => [`${v} users`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend panel */}
              <div className="w-full md:w-1/2 space-y-3">
                {roleData.map((item, i) => {
                  const pct = roleTotal > 0 ? ((item.value / roleTotal) * 100).toFixed(1) : '0';
                  const color = ROLE_COLORS[i % ROLE_COLORS.length];
                  return (
                    <div key={item.name} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-700 font-medium">{item.name}</span>
                          <span className="text-xs text-gray-500">{item.value.toLocaleString()} ({pct}%)</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, background: color }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
                <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">
                  Total: {roleTotal.toLocaleString()} users
                </p>
              </div>
            </div>
          ) : (
            <EmptyState label="No role data available" />
          )}
        </>
      )}
    </div>
  );
};

export default ChartsSection;