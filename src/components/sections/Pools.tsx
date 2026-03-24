import { forwardRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Users, ArrowRight, Info, DollarSign, Clock, Zap, Users2, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ExchangeRate {
  usdToKes: number;
  lastUpdated: Date;
}

interface Pool {
  name: string;
  usdAmount: number;
  kesAmount: number;
  target: number;
  slotsRemaining: number;
  totalSlots: number;
  profit: number;
  returns: string;
  returnPeriod: string;
  returnPeriodDisplay: string;
  icon: any;
  color: string;
  description: string;
  fee: number;
  risk: string;
  features: string[];
}

const pools: Pool[] = [
  {
    name: 'Starter Pool',
    usdAmount: 20,
    kesAmount: 0,
    target: 1000,
    slotsRemaining: 10,
    totalSlots: 10,
    profit: 55,
    returns: '55%',
    returnPeriod: '7 days',
    returnPeriodDisplay: '7 days',
    icon: Shield,
    color: 'green',
    description: '10 slots available. Target: $1,000 with 55% profit after 7 days.',
    fee: 0.02,
    risk: 'Low',
    features: ['$1,000 target', '55% profit', '7-day return period']
  },
  {
    name: 'Basic Pool',
    usdAmount: 50,
    kesAmount: 0,
    target: 2500,
    slotsRemaining: 6,
    totalSlots: 6,
    profit: 55,
    returns: '55%',
    returnPeriod: '7 days',
    returnPeriodDisplay: '7 days',
    icon: Shield,
    color: 'teal',
    description: '6 slots available. Target: $2,500 with 55% profit after 7 days.',
    fee: 0.025,
    risk: 'Low-Medium',
    features: ['$2,500 target', '55% profit', '7-day return period']
  },
  {
    name: 'Growth Pool',
    usdAmount: 100,
    kesAmount: 0,
    target: 800,
    slotsRemaining: 1,
    totalSlots: 1,
    profit: 55,
    returns: '55%',
    returnPeriod: '3 days',
    returnPeriodDisplay: '3 days',
    icon: Crown,
    color: 'blue',
    description: 'EXCLUSIVE: 1 person pool. Target: $800 with 55% profit after 3 days.',
    fee: 0.03,
    risk: 'Medium',
    features: ['1 person only', '$800 target', '55% profit', '3-day return period', 'Exclusive access']
  },
  {
    name: 'Premium Pool',
    usdAmount: 300,
    kesAmount: 0,
    target: 0,
    slotsRemaining: -1,
    totalSlots: 0,
    profit: 55,
    returns: '55%',
    returnPeriod: 'Any time',
    returnPeriodDisplay: 'Any time',
    icon: TrendingUp,
    color: 'purple',
    description: 'User-specified target. Withdraw any profit daily. 55% profit.',
    fee: 0.035,
    risk: 'Medium-High',
    features: ['Custom target', 'Daily withdrawals', '55% profit']
  },
  {
    name: 'Elite Pool',
    usdAmount: 750,
    kesAmount: 0,
    target: 0,
    slotsRemaining: -1,
    totalSlots: 0,
    profit: 55,
    returns: '55%',
    returnPeriod: 'Any time',
    returnPeriodDisplay: 'Any time',
    icon: Users,
    color: 'amber',
    description: 'User-specified target. Withdraw any profit anytime. 55% profit.',
    fee: 0.04,
    risk: 'High',
    features: ['Custom target', 'Instant withdrawals', '55% profit']
  }
];

const Pools = forwardRef<HTMLDivElement>((_, ref) => {
  const navigate = useNavigate();
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedPools, setUpdatedPools] = useState(pools);

  useEffect(() => {
    fetchExchangeRate();
  }, []);

  const fetchExchangeRate = async () => {
    try {
      setLoading(true);
      const urls = [
        'https://api.exchangerate-api.com/v4/latest/USD',
        'https://api.frankfurter.app/latest?from=USD&to=KES',
        'https://api.exchangerate.host/latest?base=USD&symbols=KES'
      ];
      
      let rate = null;
      
      for (const url of urls) {
        try {
          const response = await fetch(url);
          const data = await response.json();
          
          if (data.rates) {
            if (data.rates.KES) {
              rate = data.rates.KES;
              break;
            } else if (data.rates) {
              for (const [key, value] of Object.entries(data.rates)) {
                if (key === 'KES') {
                  rate = value as number;
                  break;
                }
              }
              if (rate) break;
            }
          } else if (data.data && data.data.KES) {
            rate = data.data.KES;
            break;
          }
        } catch (err) {
          console.warn(`Failed to fetch from ${url}:`, err);
          continue;
        }
      }
      
      if (rate) {
        setExchangeRate({
          usdToKes: rate,
          lastUpdated: new Date()
        });
        
        const updated = pools.map(pool => ({
          ...pool,
          kesAmount: Math.round(pool.usdAmount * rate)
        }));
        setUpdatedPools(updated);
        setError(null);
      } else {
        throw new Error('Could not fetch exchange rate from any API');
      }
    } catch (err) {
      console.error('Failed to fetch exchange rate:', err);
      setError('Unable to fetch current exchange rate. Using approximate rates.');
      const fallbackRate = 130;
      const updated = pools.map(pool => ({
        ...pool,
        kesAmount: Math.round(pool.usdAmount * fallbackRate)
      }));
      setUpdatedPools(updated);
    } finally {
      setLoading(false);
    }
  };

  const formatKES = (amount: number) => `KES ${amount.toLocaleString()}`;
  const formatUSD = (amount: number) => `$${amount}`;

  const getReturnPeriodIcon = (period: string) => {
    if (period === '7 days') return <Clock size={14} className="text-blue-500" />;
    if (period === '3 days') return <Zap size={14} className="text-yellow-500" />;
    if (period === 'Any time') return <Zap size={14} className="text-purple-500" />;
    return <Clock size={14} className="text-blue-500" />;
  };

  const handleInvest = (pool: Pool) => {
    navigate('/register', { 
      state: { 
        pool: {
          name: pool.name,
          usdAmount: pool.usdAmount,
          kesAmount: pool.kesAmount,
          target: pool.target,
          slotsRemaining: pool.slotsRemaining,
          totalSlots: pool.totalSlots,
          profit: pool.profit,
          returnPeriod: pool.returnPeriod
        }
      }
    });
  };

  const getSlotDisplay = (pool: Pool) => {
    // For Starter and Basic pools with slots > 0
    if (pool.slotsRemaining > 0 && pool.totalSlots > 0) {
      return (
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold shadow-md bg-orange-500 text-white">
            <Users2 size={12} />
            <span>{pool.slotsRemaining}/{pool.totalSlots} slots</span>
          </div>
        </div>
      );
    }
    // For Growth pool (1 person exclusive)
    if (pool.name === 'Growth Pool' && pool.slotsRemaining === 1) {
      return (
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg animate-pulse">
            <Crown size={12} />
            <span>1 person pool</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const getTargetDisplay = (pool: Pool) => {
    if (pool.target > 0) {
      return `Target: ${formatUSD(pool.target)}`;
    }
    return 'Custom target';
  };

  return (
    <section ref={ref} id="pools" className="relative py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-center mb-8"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Investment <span className="text-[#ff444f]">Pools</span>
            </h2>
            <p className="text-xl text-gray-600">
              All pools offer <span className="font-bold text-green-600">55% profit</span> - Choose your investment
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 text-right">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign size={16} className="text-green-600" />
                <span className="text-gray-600">Exchange Rate:</span>
                {loading ? (
                  <div className="w-4 h-4 border-2 border-[#ff444f] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="font-semibold text-gray-900">
                    1 USD = {exchangeRate ? formatKES(exchangeRate.usdToKes).replace('KES', '') : '---'} KES
                  </span>
                )}
              </div>
              {exchangeRate && (
                <p className="text-xs text-gray-400 mt-1">
                  Updated: {exchangeRate.lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
            {error && (
              <p className="text-xs text-amber-600 mt-2">{error}</p>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
          {updatedPools.map((pool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer border border-gray-100 group hover:shadow-xl transition-all relative"
            >
              {getSlotDisplay(pool)}
              
              <div className={`relative h-24 bg-gradient-to-r from-${pool.color}-50 to-gray-50 border-b border-gray-100 flex items-center justify-center`}>
                <div className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  <pool.icon className={`w-8 h-8 text-${pool.color}-500`} />
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{pool.name}</h3>
                  <div className="flex items-center gap-1 text-xs">
                    {getReturnPeriodIcon(pool.returnPeriod)}
                    <span className="text-gray-500">{pool.returnPeriodDisplay}</span>
                  </div>
                </div>
                
                <p className="text-gray-500 text-xs mb-3">{pool.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Amount (USD)</span>
                    <span className="font-semibold text-gray-900">{formatUSD(pool.usdAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-xs text-gray-500">Amount (KES)</span>
                    <span className="font-bold text-[#ff444f] text-sm">{formatKES(pool.kesAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Profit</span>
                    <span className="font-semibold text-green-600 text-lg">{pool.profit}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Target</span>
                    <span className="text-xs font-medium text-gray-700">{getTargetDisplay(pool)}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {pool.features.map((feature, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => handleInvest(pool)}
                  className="w-full bg-[#ff444f] text-white py-2 rounded-full hover:bg-[#d43b44] transition-all font-semibold text-sm flex items-center justify-center gap-1 shadow-md hover:shadow-lg"
                >
                  Invest Now
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-8 text-center"
        >
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm text-green-700">
              <Info size={16} />
              <span>
                <strong>All pools offer 55% profit</strong> • Starter (10 slots, $1,000 target, 7 days) • Basic (6 slots, $2,500 target, 7 days) • 
                Growth (<strong className="text-red-600">EXCLUSIVE 1 person pool</strong>, $800 target, 3 days) • Premium (Custom target, daily withdrawals) • 
                Elite (Custom target, instant withdrawals)
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-6 text-center md:hidden"
        >
          <button
            onClick={() => navigate('/pools')}
            className="inline-flex items-center gap-2 text-[#ff444f] font-semibold text-sm"
          >
            <Info size={16} />
            <span className="underline">View Detailed Pool Information</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
});

Pools.displayName = 'Pools';
export default Pools;