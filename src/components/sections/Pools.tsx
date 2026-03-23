import { forwardRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Users, ArrowRight, Info, DollarSign, Clock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ExchangeRate {
  usdToKes: number;
  lastUpdated: Date;
}

const pools = [
  {
    name: 'Starter Pool',
    usdAmount: 20,
    kesAmount: 0, // Will be calculated
    returns: '20-35%',
    returnPeriod: '7 days',
    icon: Shield,
    color: 'green',
    description: 'Perfect for beginners. Start with just $20.',
    fee: 0.02,
    risk: 'Low',
    features: ['7-day return period', 'Up to 35% returns', 'Low risk strategy']
  },
  {
    name: 'Basic Pool',
    usdAmount: 50,
    kesAmount: 0, // Will be calculated
    returns: '25-40%',
    returnPeriod: '7 days',
    icon: Shield,
    color: 'teal',
    description: 'Steady growth with minimal risk.',
    fee: 0.025,
    risk: 'Low-Medium',
    features: ['7-day return period', 'Up to 40% returns', 'Balanced approach']
  },
  {
    name: 'Growth Pool',
    usdAmount: 100,
    kesAmount: 0, // Will be calculated
    returns: '35-50%',
    returnPeriod: '3 days',
    icon: TrendingUp,
    color: 'blue',
    description: 'High returns for intermediate investors.',
    fee: 0.03,
    risk: 'Medium',
    features: ['3-day return period', 'Up to 50% returns', 'Active management']
  },
  {
    name: 'Premium Pool',
    usdAmount: 300,
    kesAmount: 0, // Will be calculated
    returns: '45-60%',
    returnPeriod: '3 days',
    icon: TrendingUp,
    color: 'purple',
    description: 'Premium returns for serious investors.',
    fee: 0.035,
    risk: 'Medium-High',
    features: ['3-day return period', 'Up to 60% returns', 'Advanced strategies']
  },
  {
    name: 'Elite Pool',
    usdAmount: 750,
    kesAmount: 0, // Will be calculated
    returns: '55-75%',
    returnPeriod: '3 days',
    icon: Users,
    color: 'amber',
    description: 'Maximum returns for experienced investors.',
    fee: 0.04,
    risk: 'High',
    features: ['3-day return period', 'Up to 75% returns', 'Aggressive strategies']
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
      // Try multiple free APIs with fallbacks
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
          
          // Handle different API response formats
          if (data.rates) {
            if (data.rates.KES) {
              rate = data.rates.KES;
              break;
            } else if (data.rates) {
              // Try to find KES in the rates object
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
          // Silently continue to next API
          console.warn(`Failed to fetch from ${url}:`, err);
          continue;
        }
      }
      
      if (rate) {
        setExchangeRate({
          usdToKes: rate,
          lastUpdated: new Date()
        });
        
        // Update pool amounts with current exchange rate
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
      // Fallback to approximate rates (1 USD ≈ 130 KES)
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
    if (period === '3 days') return <Zap size={14} className="text-yellow-500" />;
    return <Clock size={14} className="text-blue-500" />;
  };

  return (
    <section ref={ref} id="pools" className="relative py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Learn More link */}
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
              Choose your investment amount in USD, pay in KES
            </p>
          </div>
          
          {/* Exchange Rate Display */}
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

        {/* Pools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
          {updatedPools.map((pool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer border border-gray-100 group hover:shadow-xl transition-all"
            >
              {/* Top Section with Icon */}
              <div className={`relative h-24 bg-gradient-to-r from-${pool.color}-50 to-gray-50 border-b border-gray-100 flex items-center justify-center`}>
                <div className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  <pool.icon className={`w-8 h-8 text-${pool.color}-500`} />
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{pool.name}</h3>
                  <div className="flex items-center gap-1 text-xs">
                    {getReturnPeriodIcon(pool.returnPeriod)}
                    <span className="text-gray-500">{pool.returnPeriod}</span>
                  </div>
                </div>
                
                <p className="text-gray-500 text-xs mb-3">{pool.description}</p>
                
                {/* Amounts */}
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
                    <span className="text-xs text-gray-500">Est. Returns</span>
                    <span className="font-semibold text-green-600">{pool.returns}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {pool.features.slice(0, 2).map((feature, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Button */}
                <button className="w-full bg-[#ff444f] text-white py-2 rounded-full hover:bg-[#d43b44] transition-all font-semibold text-sm flex items-center justify-center gap-1 shadow-md hover:shadow-lg">
                  Invest Now
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Info Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-8 text-center"
        >
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm text-blue-700">
              <Info size={16} />
              <span>
                Returns period: 7 days for Starter & Basic pools, 3 days for Growth, Premium & Elite pools
              </span>
            </div>
          </div>
        </motion.div>

        {/* Mobile Info Link */}
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