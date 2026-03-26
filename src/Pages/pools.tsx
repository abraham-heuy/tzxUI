import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  TrendingUp, 
  X,
  CheckCircle,
  AlertCircle,
  Info,
  BarChart3,
  Target,
  Layers,
  DollarSign,
  Zap,
  ArrowRight,
  Clock,
  RefreshCw,
  Loader2
} from 'lucide-react';
import CTA from '../components/sections/CTA';
import { getPools } from '../data/pool';

// Import background image
import poolsBg from '../assets/pool.jpg';

// Modal Component for each pool
const PoolModal = ({ pool, isOpen, onClose }: { pool: any; isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-md"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>

          <div className={`h-3 bg-gradient-to-r ${pool.color}`} />

          <div className="p-6 md:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center">
                <pool.icon className="w-8 h-8 text-[#ff444f]" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{pool.name}</h2>
                <p className="text-[#ff444f] font-medium">{pool.tagline}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              <div className="bg-gray-50 p-3 rounded-xl text-center">
                <DollarSign className="w-5 h-5 text-[#ff444f] mx-auto mb-1" />
                <div className="text-xs text-gray-500">Amount (USD)</div>
                <div className="font-bold text-gray-900 text-sm">{pool.usdAmount}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl text-center">
                <BarChart3 className="w-5 h-5 text-[#ff444f] mx-auto mb-1" />
                <div className="text-xs text-gray-500">Risk</div>
                <div className={`font-bold text-sm ${
                  pool.risk === 'Low' ? 'text-green-600' :
                  pool.risk === 'Low-Medium' ? 'text-green-500' :
                  pool.risk === 'Medium' ? 'text-yellow-600' :
                  pool.risk === 'Medium-High' ? 'text-orange-600' : 'text-red-600'
                }`}>{pool.risk}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl text-center">
                <TrendingUp className="w-5 h-5 text-[#ff444f] mx-auto mb-1" />
                <div className="text-xs text-gray-500">Profit</div>
                <div className="font-bold text-green-600 text-sm">{pool.profit}% of profit</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl text-center">
                <Clock className="w-5 h-5 text-[#ff444f] mx-auto mb-1" />
                <div className="text-xs text-gray-500">Return Period</div>
                <div className="font-bold text-gray-900 text-sm">{pool.returnPeriodDisplay}</div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Info size={18} className="text-[#ff444f]" />
                About This Pool
              </h3>
              <p className="text-gray-600 leading-relaxed">{pool.detailedDescription}</p>
            </div>

            {pool.target > 0 && (
              <div className="mb-8 bg-blue-50 p-4 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Target size={18} className="text-[#ff444f]" />
                  Pool Target
                </h3>
                <p className="text-gray-700">Target amount: <span className="font-bold">${pool.target.toLocaleString()}</span></p>
                {pool.slotsRemaining > 0 && (
                  <p className="text-gray-700 mt-1">Slots remaining: <span className="font-bold">{pool.slotsRemaining}/{pool.totalSlots}</span></p>
                )}
              </div>
            )}

            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Zap size={18} className="text-[#ff444f]" />
                How It Works
              </h3>
              <div className="space-y-3">
                {pool.howItWorks.map((step: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#ff444f]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-[#ff444f]">{idx + 1}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Layers size={18} className="text-[#ff444f]" />
                Key Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pool.features.map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Refund Policy Section */}
            <div className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <RefreshCw className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-blue-800 font-medium text-sm">Refund Policy</p>
                  <p className="text-blue-700 text-xs mt-1">
                    <strong>50-50 Refund:</strong> If the trading account balance goes to zero, you receive 50% of your investment back.
                    <br />
                    <strong>Early Withdrawal:</strong> If you cash out before the return period ends, you get your full invested amount back (no profit will be paid).
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-amber-800 font-medium text-sm">Risk Disclosure</p>
                  <p className="text-amber-700 text-xs mt-1">
                    All pools offer {pool.profit}% of profit with varying risk levels. {pool.risk} risk investments carry 
                    {pool.risk === 'Low' ? ' minimal' : pool.risk === 'Low-Medium' ? ' low to moderate' : 
                      pool.risk === 'Medium' ? ' moderate' : pool.risk === 'Medium-High' ? ' moderate to high' : ' significant'} volatility. 
                    Past performance doesn't guarantee future results. Only invest what you can afford to lose.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex-1 bg-[#ff444f] text-white py-4 rounded-full hover:bg-[#d43b44] transition-all font-semibold">
                Select This Pool
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const PoolsPage = () => {
  const navigate = useNavigate();
  const [selectedPool, setSelectedPool] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pools, setPools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPools();
  }, []);

  const loadPools = async () => {
    try {
      setLoading(true);
      const dynamicPools = await getPools();
      
      // Map dynamic pool data to the format expected by the component
      const formattedPools = dynamicPools.map(pool => ({
        name: pool.name,
        tagline: getTagline(pool.name),
        icon: pool.icon,
        usdAmount: `$${pool.usdAmount}`,
        kesAmount: `KES ${Math.round(pool.usdAmount * 130).toLocaleString()}`,
        target: pool.target,
        slotsRemaining: pool.slotsRemaining,
        totalSlots: pool.totalSlots,
        profit: pool.profit,
        risk: pool.risk,
        returnPeriodDisplay: pool.returnPeriodDisplay,
        color: getPoolColor(pool.name),
        detailedDescription: getDetailedDescription(pool),
        howItWorks: getHowItWorks(pool.name),
        features: getFeatures(pool),
        suitableFor: getSuitableFor(pool.name)
      }));
      
      setPools(formattedPools);
      setError(null);
    } catch (err) {
      console.error('Error loading pools:', err);
      setError('Failed to load pools. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const getTagline = (name: string): string => {
    switch(name) {
      case 'Starter Pool': return 'Begin Your Journey';
      case 'Basic Pool': return 'Steady Growth';
      case 'Growth Pool': return 'Exclusive 1-Person Pool';
      case 'Premium Pool': return 'Flexible & Daily';
      case 'Elite Pool': return 'Maximum Flexibility';
      default: return 'Investment Pool';
    }
  };

  const getPoolColor = (name: string): string => {
    switch(name) {
      case 'Starter Pool': return 'from-green-500 to-emerald-600';
      case 'Basic Pool': return 'from-teal-500 to-green-600';
      case 'Growth Pool': return 'from-blue-500 to-indigo-600';
      case 'Premium Pool': return 'from-purple-500 to-pink-600';
      case 'Elite Pool': return 'from-amber-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getDetailedDescription = (pool: any): string => {
    const profitText = `${pool.profit}% of profit`;
    
    switch(pool.name) {
      case 'Starter Pool':
        return `Perfect for beginners. ${pool.slotsRemaining > 0 ? `${pool.slotsRemaining} slots available` : 'Currently full'} with a target of $${pool.target.toLocaleString()}. Earn ${profitText} after 7 days. This pool is designed for those starting their investment journey with minimal risk.`;
      case 'Basic Pool':
        return `${pool.slotsRemaining > 0 ? `${pool.slotsRemaining} slots available` : 'Currently full'} with a target of $${pool.target.toLocaleString()}. Earn ${profitText} after 7 days. A balanced approach for steady growth with slightly higher returns potential.`;
      case 'Growth Pool':
        return `EXCLUSIVE: This is a 1-person pool. Target of $${pool.target.toLocaleString()} with ${profitText} after just 3 days. Fast returns for serious investors ready to go all in.`;
      case 'Premium Pool':
        return `Custom target pool with daily withdrawal capability. Set your own target and withdraw any profit amount daily. ${profitText} on your investment.`;
      case 'Elite Pool':
        return `Premium pool for serious investors. Set your own target and withdraw any profit instantly at any time. Maximum flexibility with ${profitText} potential.`;
      default:
        return pool.description;
    }
  };

  const getHowItWorks = (name: string): string[] => {
    switch(name) {
      case 'Starter Pool':
        return [
          'Invest $20 (KES equivalent) to join the pool',
          'Funds are pooled to reach the $1,000 target',
          'Professional traders manage the investment',
          'After 7 days, 55% of profit is distributed',
          'Returns are sent to your wallet automatically'
        ];
      case 'Basic Pool':
        return [
          'Invest $50 (KES equivalent) to join the pool',
          'Funds are pooled to reach the $2,500 target',
          'Professional traders execute balanced strategies',
          'After 7 days, 55% of profit is distributed',
          'Returns are credited to your account'
        ];
      case 'Growth Pool':
        return [
          'Single investor only - claim this exclusive spot',
          'Full $100 investment goes toward the $800 target',
          'Faster 3-day return period',
          'Aggressive but calculated strategies',
          '55% of profit paid directly after completion'
        ];
      case 'Premium Pool':
        return [
          'Invest $300 and set your custom target',
          'Traders work to achieve 55% of profit',
          'Withdraw any profit amount daily',
          'Flexible investment timeline',
          'Full control over your returns'
        ];
      case 'Elite Pool':
        return [
          'Invest $750 with custom target',
          'Advanced trading strategies for maximum returns',
          'Instant withdrawal of any profit anytime',
          'No lock-in periods',
          'Full liquidity and control'
        ];
      default:
        return ['Investment process varies by pool'];
    }
  };

  const getFeatures = (pool: any): string[] => {
    const profitText = `${pool.profit}% of profit`;
    
    switch(pool.name) {
      case 'Starter Pool':
        return [
          `${pool.totalSlots} slots total`,
          `$${pool.target.toLocaleString()} pool target`,
          `${profitText} after 7 days`,
          'Low risk strategy',
          'Automatic profit distribution',
          'Beginner friendly'
        ];
      case 'Basic Pool':
        return [
          `${pool.totalSlots} slots total`,
          `$${pool.target.toLocaleString()} pool target`,
          `${profitText} after 7 days`,
          'Balanced strategy',
          'Moderate risk management',
          'Steady returns'
        ];
      case 'Growth Pool':
        return [
          '1 person only - exclusive access',
          `$${pool.target.toLocaleString()} pool target`,
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

  const getSuitableFor = (name: string): string[] => {
    switch(name) {
      case 'Starter Pool':
        return ['First-time investors', 'Low risk tolerance', 'Short-term investment', 'Learning the process'];
      case 'Basic Pool':
        return ['Intermediate investors', 'Moderate risk tolerance', 'Steady wealth building', 'Short to medium term'];
      case 'Growth Pool':
        return ['Serious investors', 'Medium risk tolerance', 'Fast returns seeker', 'Exclusive opportunities'];
      case 'Premium Pool':
        return ['Active investors', 'Daily income seekers', 'Flexible goals', 'Medium-high risk tolerance'];
      case 'Elite Pool':
        return ['Experienced investors', 'High risk tolerance', 'Maximum flexibility', 'Serious capital allocation'];
      default:
        return [];
    }
  };

  const openModal = (pool: any) => {
    setSelectedPool(pool);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedPool(null), 300);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#ff444f] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading investment pools...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-2">{error}</p>
          <button
            onClick={loadPools}
            className="px-4 py-2 bg-[#ff444f] text-white rounded-lg hover:bg-[#d43b44]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-['Inter,_sans-serif']">
      <nav className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-700 hover:text-[#ff444f] transition-colors duration-200"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Home</span>
            </button>
            
            <div className="flex-shrink-0 ml-auto">
              <h1 className="text-2xl font-bold text-[#ff444f]">
                TZX<span className="text-gray-900">Trading</span>
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        <section 
          className="relative py-16 md:py-20 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${poolsBg})`,
          }}
        >
          <div className="absolute inset-0 bg-black/70" />
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4">
                Investment <span className="text-[#ff444f]">Pools</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-4 md:mb-6 px-4">
                All pools offer <span className="text-[#ff444f] font-bold">55% of the profit</span> - Choose your investment
              </p>
              <div className="flex justify-center gap-2">
                <span className="w-12 md:w-16 h-1 bg-[#ff444f] rounded-full"></span>
                <span className="w-12 md:w-16 h-1 bg-white/50 rounded-full"></span>
                <span className="w-12 md:w-16 h-1 bg-[#ff444f] rounded-full"></span>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
                Understanding Our <span className="text-[#ff444f]">Pool Structure</span>
              </h2>
              <p className="text-base md:text-lg text-gray-600 mb-4 px-4">
                Each investment pool offers 55% of the profit with varying return periods. Starter and Basic pools take 7 days, 
                Growth pool takes 3 days, while Premium and Elite pools offer daily or instant withdrawals.
              </p>
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg text-left mt-6 md:mt-8 mx-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-green-800 font-medium text-sm md:text-base">55% of the Profit Across All Pools</p>
                    <p className="text-green-700 text-xs md:text-sm">
                      Every pool guarantees 55% of the profit. Choose based on your preferred return period and investment amount.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
              {pools.map((pool, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  onClick={() => openModal(pool)}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden cursor-pointer border border-gray-100"
                >
                  <div className={`h-2 bg-gradient-to-r ${pool.color}`} />
                  
                  <div className="p-5 md:p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                        <pool.icon className="w-6 h-6 text-[#ff444f]" />
                      </div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-gray-900">{pool.name}</h3>
                        <p className="text-xs text-[#ff444f]">{pool.tagline}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Amount</span>
                        <span className="font-semibold text-gray-900">{pool.usdAmount}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Risk Level</span>
                        <span className={`font-semibold ${
                          pool.risk === 'Low' ? 'text-green-600' :
                          pool.risk === 'Low-Medium' ? 'text-green-500' :
                          pool.risk === 'Medium' ? 'text-yellow-600' :
                          pool.risk === 'Medium-High' ? 'text-orange-600' : 'text-red-600'
                        }`}>{pool.risk}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Profit</span>
                        <span className="font-semibold text-green-600">{pool.profit}% of profit</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Return Period</span>
                        <span className="font-semibold text-gray-900">{pool.returnPeriodDisplay}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-xs md:text-sm line-clamp-2 mb-4">
                      {pool.detailedDescription.substring(0, 80)}...
                    </p>

                    <div className="flex items-center justify-end text-[#ff444f] text-xs font-medium">
                      <span>Click for details</span>
                      <ArrowRight size={14} className="ml-1" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Refund Policy Banner */}
        <section className="py-8 md:py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 border border-blue-200"
            >
              <div className="flex items-start gap-4">
                <RefreshCw className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Refund Policy</h3>
                  <div className="space-y-3 text-gray-700">
                    <p className="text-sm md:text-base">
                      <strong className="text-blue-700">50-50 Refund:</strong> If the trading account balance goes to zero, 
                      you receive 50% of your investment back as a safety net.
                    </p>
                    <p className="text-sm md:text-base">
                      <strong className="text-blue-700">Early Withdrawal:</strong> If you cash out before the return period ends, 
                      you get your full invested amount back (no profit will be paid).
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      * This policy applies to all pools. Terms and conditions apply.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <CTA />
      </div>

      {selectedPool && (
        <PoolModal 
          pool={selectedPool} 
          isOpen={modalOpen} 
          onClose={closeModal} 
        />
      )}
    </div>
  );
};

export default PoolsPage;