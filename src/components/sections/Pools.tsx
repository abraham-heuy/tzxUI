import { forwardRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Users, ArrowRight, Info, DollarSign, Clock, Zap, Users2, Crown, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPools } from '../../data/pool';

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
  isAvailable: boolean;
}

const Pools = forwardRef<HTMLDivElement>((_, ref) => {
  const navigate = useNavigate();
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [loadingExchange, setLoadingExchange] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedPools, setUpdatedPools] = useState<Pool[]>([]);
  const [fetchingPools, setFetchingPools] = useState(true);

  useEffect(() => {
    loadPools();
  }, []);

  useEffect(() => {
    // When pools are loaded, fetch exchange rate
    if (updatedPools.length > 0) {
      fetchExchangeRate();
    }
  }, [updatedPools.length]);

  const loadPools = async () => {
    try {
      setFetchingPools(true);
      const dynamicPools = await getPools();
      
      // Map dynamic pools to the format expected by this component
      const formattedPools: Pool[] = dynamicPools.map(pool => ({
        name: pool.name,
        usdAmount: pool.usdAmount,
        kesAmount: 0, // Will be updated with exchange rate
        target: pool.target,
        slotsRemaining: pool.slotsRemaining,
        totalSlots: pool.totalSlots,
        profit: pool.profit,
        returns: `${pool.profit}% of profit`,
        returnPeriod: pool.returnPeriod,
        returnPeriodDisplay: pool.returnPeriodDisplay,
        icon: getPoolIcon(pool.name),
        color: getPoolColorClass(pool.name),
        description: getPoolDescription(pool),
        fee: getPoolFee(pool.name),
        risk: pool.risk,
        features: getPoolFeatures(pool),
        isAvailable: pool.isAvailable || pool.slotsRemaining !== 0
      }));
      
      setUpdatedPools(formattedPools);
    } catch (err) {
      console.error('Error loading pools:', err);
      setError('Failed to load pool data');
    } finally {
      setFetchingPools(false);
    }
  };

  const getPoolIcon = (name: string) => {
    switch(name) {
      case 'Starter Pool':
      case 'Basic Pool':
        return Shield;
      case 'Growth Pool':
        return Crown;
      case 'Premium Pool':
        return TrendingUp;
      case 'Elite Pool':
        return Users;
      default:
        return Shield;
    }
  };

  const getPoolColorClass = (name: string): string => {
    switch(name) {
      case 'Starter Pool': return 'green';
      case 'Basic Pool': return 'teal';
      case 'Growth Pool': return 'blue';
      case 'Premium Pool': return 'purple';
      case 'Elite Pool': return 'amber';
      default: return 'gray';
    }
  };

  const getPoolDescription = (pool: any): string => {
    const profitText = `${pool.profit}% of profit`;
    
    if (pool.slotsRemaining === -1) {
      return `${pool.description} Unlimited slots available. ${profitText}`;
    }
    
    if (pool.slotsRemaining > 0) {
      return `${pool.slotsRemaining} slots available. Target: $${pool.target?.toLocaleString() || 'Custom'} with ${profitText} after ${pool.returnPeriodDisplay}.`;
    }
    
    return `Currently full. Target: $${pool.target?.toLocaleString() || 'Custom'} with ${profitText} after ${pool.returnPeriodDisplay}.`;
  };

  const getPoolFee = (name: string): number => {
    switch(name) {
      case 'Starter Pool': return 0.02;
      case 'Basic Pool': return 0.025;
      case 'Growth Pool': return 0.03;
      case 'Premium Pool': return 0.035;
      case 'Elite Pool': return 0.04;
      default: return 0.025;
    }
  };

  const getPoolFeatures = (pool: any): string[] => {
    const profitText = `${pool.profit}% of profit`;
    
    switch(pool.name) {
      case 'Starter Pool':
        return [
          `${pool.totalSlots} slots total`,
          `$${pool.target?.toLocaleString()} pool target`,
          `${profitText} after 7 days`,
          'Low risk strategy',
          'Automatic profit distribution',
          'Beginner friendly'
        ];
      case 'Basic Pool':
        return [
          `${pool.totalSlots} slots total`,
          `$${pool.target?.toLocaleString()} pool target`,
          `${profitText} after 7 days`,
          'Balanced strategy',
          'Moderate risk management',
          'Steady returns'
        ];
      case 'Growth Pool':
        return [
          '1 person only - exclusive access',
          `$${pool.target?.toLocaleString()} pool target`,
          `${profitText} after 3 days`,
          'Fast returns',
          'Priority management',
          'Exclusive opportunity'
        ];
      case 'Premium Pool':
        return [
          'Custom target amount',
          'Daily withdrawals available',
          `${profitText} guaranteed`,
          'Flexible timeline',
          'Full profit control',
          'Active management'
        ];
      case 'Elite Pool':
        return [
          'Custom target amount',
          'Instant withdrawals anytime',
          `${profitText} potential`,
          'No lock-in period',
          'Maximum flexibility',
          'VIP support included'
        ];
      default:
        return [];
    }
  };

  const fetchExchangeRate = async () => {
    try {
      setLoadingExchange(true);
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
        
        // Update KES amounts for all pools
        setUpdatedPools(prev => prev.map(pool => ({
          ...pool,
          kesAmount: Math.round(pool.usdAmount * rate)
        })));
        setError(null);
      } else {
        throw new Error('Could not fetch exchange rate from any API');
      }
    } catch (err) {
      console.error('Failed to fetch exchange rate:', err);
      setError('Unable to fetch current exchange rate. Using approximate rates.');
      const fallbackRate = 130;
      setUpdatedPools(prev => prev.map(pool => ({
        ...pool,
        kesAmount: Math.round(pool.usdAmount * fallbackRate)
      })));
    } finally {
      setLoadingExchange(false);
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
    if (!pool.isAvailable && pool.slotsRemaining !== -1) {
      alert(`Sorry, ${pool.name} is currently full. Please check back later.`);
      return;
    }
    
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
    // For pools with limited slots and slots available
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
    // For full pools
    if (pool.slotsRemaining === 0 && pool.totalSlots > 0) {
      return (
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold shadow-md bg-red-500 text-white">
            <AlertCircle size={12} />
            <span>Full</span>
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

  const handleViewDetails = (pool: Pool) => {
    navigate('/pools', { state: { selectedPool: pool.name } });
  };

  if (fetchingPools) {
    return (
      <section ref={ref} id="pools" className="relative py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#ff444f] animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading investment pools...</p>
          </div>
        </div>
      </section>
    );
  }

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
              All pools offer <span className="font-bold text-green-600">55% of the profit</span> - Choose your investment
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 text-right">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign size={16} className="text-green-600" />
                <span className="text-gray-600">Exchange Rate:</span>
                {loadingExchange ? (
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
              className={`bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 group hover:shadow-xl transition-all relative ${
                !pool.isAvailable && pool.slotsRemaining !== -1 ? 'opacity-75' : 'cursor-pointer'
              }`}
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
                    <span className="font-semibold text-green-600 text-lg">{pool.profit}% of profit</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Target</span>
                    <span className="text-xs font-medium text-gray-700">{getTargetDisplay(pool)}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {pool.features.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleInvest(pool)}
                    disabled={!pool.isAvailable && pool.slotsRemaining !== -1}
                    className={`flex-1 py-2 rounded-full transition-all font-semibold text-sm flex items-center justify-center gap-1 shadow-md hover:shadow-lg ${
                      !pool.isAvailable && pool.slotsRemaining !== -1
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#ff444f] text-white hover:bg-[#d43b44]'
                    }`}
                  >
                    Invest Now
                    <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={() => handleViewDetails(pool)}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all text-sm flex items-center justify-center gap-1"
                    title="View Details"
                  >
                    <Info size={14} />
                  </button>
                </div>
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
                <strong>All pools offer 55% of the profit</strong> • Starter (slots available, $1,000 target, 7 days) • Basic (slots available, $2,500 target, 7 days) • 
                Growth (<strong className="text-red-600">EXCLUSIVE 1 person pool</strong>, $800 target, 3 days) • Premium (Custom target, daily withdrawals) • 
                Elite (Custom target, instant withdrawals)
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-6 text-center"
        >
          <button
            onClick={() => navigate('/pools')}
            className="inline-flex items-center gap-2 text-[#ff444f] font-semibold text-sm hover:underline"
          >
            <Info size={16} />
            <span>View Detailed Pool Information</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
});

Pools.displayName = 'Pools';
export default Pools;