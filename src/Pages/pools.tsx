import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Shield, 
  TrendingUp, 
  Users, 
  X,
  CheckCircle,
  AlertCircle,
  Info,
  BarChart3,
  Target,
  Layers,
  DollarSign,
  Zap,
  ArrowRight
} from 'lucide-react';
import CTA from '../components/sections/CTA';

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
        {/* Blurred transparent background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-md"
          onClick={onClose}
        />
        
        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>

          {/* Header Gradient */}
          <div className={`h-3 bg-gradient-to-r ${pool.color}`} />

          <div className="p-6 md:p-8">
            {/* Icon and Title */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center">
                <pool.icon className="w-8 h-8 text-[#ff444f]" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{pool.name}</h2>
                <p className="text-[#ff444f] font-medium">{pool.tagline}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              <div className="bg-gray-50 p-3 rounded-xl text-center">
                <DollarSign className="w-5 h-5 text-[#ff444f] mx-auto mb-1" />
                <div className="text-xs text-gray-500">Minimum</div>
                <div className="font-bold text-gray-900 text-sm">{pool.minAmount}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl text-center">
                <BarChart3 className="w-5 h-5 text-[#ff444f] mx-auto mb-1" />
                <div className="text-xs text-gray-500">Risk</div>
                <div className={`font-bold text-sm ${
                  pool.risk === 'Low' ? 'text-green-600' :
                  pool.risk === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                }`}>{pool.risk}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl text-center">
                <TrendingUp className="w-5 h-5 text-[#ff444f] mx-auto mb-1" />
                <div className="text-xs text-gray-500">Returns</div>
                <div className="font-bold text-green-600 text-sm">{pool.returns}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl text-center">
                <Users className="w-5 h-5 text-[#ff444f] mx-auto mb-1" />
                <div className="text-xs text-gray-500">Investors</div>
                <div className="font-bold text-gray-900 text-sm">{pool.investors}+</div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Info size={18} className="text-[#ff444f]" />
                About This Pool
              </h3>
              <p className="text-gray-600 leading-relaxed">{pool.detailedDescription}</p>
            </div>

            {/* How It Works */}
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

            {/* Key Features */}
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

            {/* Suitable For */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Target size={18} className="text-[#ff444f]" />
                Suitable For
              </h3>
              <div className="flex flex-wrap gap-2">
                {pool.suitableFor.map((item: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Risk Disclosure */}
            <div className="mb-8 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-amber-800 font-medium text-sm">Risk Disclosure</p>
                  <p className="text-amber-700 text-xs mt-1">
                    {pool.risk} risk investments carry {pool.risk === 'Low' ? 'minimal' : pool.risk === 'Medium' ? 'moderate' : 'significant'} volatility. 
                    Past performance doesn't guarantee future results. Only invest what you can afford to lose.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
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

  // Detailed pool data with all information
  const pools = [
    {
      name: 'Stable Income Pool',
      tagline: 'Safe & Steady Growth',
      icon: Shield,
      minAmount: 'KES 5,000',
      risk: 'Low',
      returns: '5-8% monthly',
      investors: '234',
      color: 'from-green-500 to-emerald-600',
      detailedDescription: 'The Stable Income Pool is designed for conservative investors who prioritize capital preservation while still generating consistent returns. Our traders focus on low-risk opportunities including major currency pairs, government bonds, and blue-chip stocks with proven track records.',
      howItWorks: [
        'Funds are pooled together from multiple investors to create a diversified portfolio',
        'Professional traders execute low-risk strategies focusing on capital preservation',
        'Positions are carefully monitored with strict stop-losses to minimize drawdowns',
        'Profits are distributed monthly based on each investor\'s contribution percentage',
        'Regular performance reports are sent to all pool participants'
      ],
      features: [
        'Conservative trading strategy',
        'Focus on capital preservation',
        'Diversified across multiple assets',
        'Lower volatility profile',
        'Strict risk management',
        'Monthly profit distributions',
        'Transparent reporting',
        'Easy withdrawal process'
      ],
      suitableFor: [
        'First-time investors',
        'Retirement savings',
        'Emergency fund growth',
        'Risk-averse individuals',
        'Long-term wealth building'
      ],
      strategy: 'The strategy focuses on carry trades, arbitrage opportunities, and high-probability setups with minimal risk. Position sizes are kept small with maximum 2% risk per trade.',
      management: 'Managed by senior traders with 10+ years of experience in conservative portfolio management.',
      minPeriod: '30 days',
      withdrawalNotice: '7 days'
    },
    {
      name: 'Balanced Growth Pool',
      tagline: 'Optimal Risk-Reward Mix',
      icon: TrendingUp,
      minAmount: 'KES 20,000',
      risk: 'Medium',
      returns: '10-15% monthly',
      investors: '156',
      color: 'from-blue-500 to-indigo-600',
      detailedDescription: 'The Balanced Growth Pool offers the perfect balance between risk and reward. This pool employs a mixed strategy approach, combining elements of both conservative and aggressive trading to capture growth opportunities while maintaining reasonable risk controls.',
      howItWorks: [
        'Funds are allocated across multiple strategies including trend following and swing trading',
        'Traders actively manage positions based on market conditions and technical analysis',
        'Portfolio is rebalanced weekly to optimize risk-reward ratios',
        'Partial profits are taken regularly to lock in gains',
        'Monthly performance reviews with strategy adjustments as needed'
      ],
      features: [
        'Mixed strategy approach',
        'Balance between growth and stability',
        'Moderate leverage usage',
        'Diversified sector exposure',
        'Active position management',
        'Weekly rebalancing',
        'Partial profit taking',
        'Dynamic risk adjustment'
      ],
      suitableFor: [
        'Intermediate investors',
        'Wealth accumulation',
        'Medium-term goals (3-5 years)',
        'Comfortable with some volatility',
        'Portfolio diversification'
      ],
      strategy: 'Combines trend following, breakout trading, and mean reversion strategies with moderate leverage (3-5x). Risk per trade limited to 3-4% of portfolio.',
      management: 'Managed by a team of traders specializing in different market conditions and timeframes.',
      minPeriod: '60 days',
      withdrawalNotice: '14 days'
    },
    {
      name: 'High Yield Pool',
      tagline: 'Maximum Return Potential',
      icon: Users,
      minAmount: 'KES 100,000',
      risk: 'High',
      returns: '20-30% monthly',
      investors: '89',
      color: 'from-purple-500 to-pink-600',
      detailedDescription: 'The High Yield Pool is for experienced investors seeking maximum returns and comfortable with significant market volatility. This pool employs aggressive trading strategies to capture the best opportunities across all market conditions.',
      howItWorks: [
        'Aggressive strategies including momentum trading and breakout systems',
        'Higher leverage utilization (up to 10x) for amplified returns',
        'Multiple time frame analysis for entry and exit points',
        'Rapid position adjustment based on market volatility',
        'Active scalping and day trading strategies'
      ],
      features: [
        'Aggressive trading strategies',
        'Higher leverage utilization',
        'Momentum and breakout trading',
        'Multiple time frame analysis',
        'Rapid position adjustment',
        'Scalping opportunities',
        'News trading strategies',
        'Maximum return focus'
      ],
      suitableFor: [
        'Experienced investors',
        'High-risk tolerance',
        'Short-term wealth building',
        'Active portfolio diversification',
        'Aggressive growth seekers'
      ],
      strategy: 'Employs multiple aggressive strategies including momentum trading, breakout systems, and news trading with higher leverage (5-10x). Risk per trade can be up to 5-6%.',
      management: 'Managed by elite traders with proven track records in high-volatility environments.',
      minPeriod: '90 days',
      withdrawalNotice: '30 days'
    }
  ];

  // Custom amounts information
  const customAmounts = [
    {
      range: 'KES 5,000 - KES 20,000',
      pools: 'Stable Income only',
      features: ['Access to Stable Income Pool', 'Basic reporting', 'Email support']
    },
    {
      range: 'KES 20,000 - KES 100,000',
      pools: 'Stable Income + Balanced Growth',
      features: ['Access to two pools', 'Monthly reports', 'Priority email support', 'Performance analytics']
    },
    {
      range: 'KES 100,000+',
      pools: 'All pools accessible',
      features: ['Access to all three pools', 'Weekly reports', 'Dedicated account manager', 'Advanced analytics', 'VIP support']
    }
  ];

  const openModal = (pool: any) => {
    setSelectedPool(pool);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedPool(null), 300);
  };

  return (
    <div className="min-h-screen bg-white font-['Inter,_sans-serif']">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            {/* Back Arrow */}
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-700 hover:text-[#ff444f] transition-colors duration-200"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Home</span>
            </button>
            
            {/* Logo */}
            <div className="flex-shrink-0 ml-auto">
              <h1 className="text-2xl font-bold text-[#ff444f]">
                TZX<span className="text-gray-900">Trading</span>
              </h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16">
        {/* Hero Section */}
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
                Choose the perfect pool for your financial goals
              </p>
              <div className="flex justify-center gap-2">
                <span className="w-12 md:w-16 h-1 bg-[#ff444f] rounded-full"></span>
                <span className="w-12 md:w-16 h-1 bg-white/50 rounded-full"></span>
                <span className="w-12 md:w-16 h-1 bg-[#ff444f] rounded-full"></span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Introduction */}
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
                Each investment pool is professionally managed by our experienced traders, with strategies tailored to specific risk levels and return expectations. Funds are pooled together to create larger positions and better trading opportunities.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg text-left mt-6 md:mt-8 mx-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-blue-800 font-medium text-sm md:text-base">Important Note</p>
                    <p className="text-blue-700 text-xs md:text-sm">
                      Higher returns potential comes with increased risk. Choose a pool that aligns with your risk tolerance and investment timeline.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pools Grid - Clickable Cards */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
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
                    {/* Header with Icon */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                        <pool.icon className="w-6 h-6 text-[#ff444f]" />
                      </div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-gray-900">{pool.name}</h3>
                        <p className="text-xs text-[#ff444f]">{pool.tagline}</p>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Minimum</span>
                        <span className="font-semibold text-gray-900">{pool.minAmount}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Risk Level</span>
                        <span className={`font-semibold ${
                          pool.risk === 'Low' ? 'text-green-600' :
                          pool.risk === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                        }`}>{pool.risk}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Est. Returns</span>
                        <span className="font-semibold text-green-600">{pool.returns}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Investors</span>
                        <span className="font-semibold text-gray-900">{pool.investors}</span>
                      </div>
                    </div>

                    {/* Description Preview */}
                    <p className="text-gray-600 text-xs md:text-sm line-clamp-2 mb-4">
                      {pool.detailedDescription.substring(0, 100)}...
                    </p>

                    {/* Click for more indicator */}
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

        {/* Custom Amounts Section */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-8 md:mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Investment <span className="text-[#ff444f]">Tiers</span>
              </h2>
              <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-4">
                Choose how much you want to invest and access different pool combinations
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {customAmounts.map((tier, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 rounded-2xl p-5 md:p-6 hover:shadow-lg transition-all border border-gray-200"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="w-5 h-5 text-[#ff444f]" />
                    <h3 className="text-lg md:text-xl font-bold text-gray-900">{tier.range}</h3>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-sm text-gray-500">Available Pools:</span>
                    <p className="font-semibold text-gray-900 text-sm md:text-base mt-1">{tier.pools}</p>
                  </div>

                  <div>
                    <span className="text-sm text-gray-500 mb-2 block">Features:</span>
                    <ul className="space-y-2">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs md:text-sm">
                          <CheckCircle size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className="w-full mt-5 bg-white border-2 border-[#ff444f] text-[#ff444f] py-2 rounded-full text-sm font-semibold hover:bg-[#ff444f] hover:text-white transition-colors">
                    Invest This Amount
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Custom Amount Note */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="mt-8 text-center"
            >
              <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <Info size={16} />
                Custom amounts above KES 500,000 qualify for preferential management fees
              </p>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8 md:mb-10">
              Frequently Asked <span className="text-[#ff444f]">Questions(Pools)</span>
            </h2>
            
            <div className="space-y-3 md:space-y-4 px-4">
              {[
                {
                  q: "How are returns calculated?",
                  a: "Returns are calculated based on the pool's trading performance, minus management fees. Monthly returns are distributed to investors proportionally to their investment amount."
                },
                {
                  q: "Can I switch between pools?",
                  a: "Yes, you can request to switch pools, subject to a 7-day notice period to allow for proper fund reallocation without disrupting trading activities."
                },
                {
                  q: "What happens during losses?",
                  a: "Losses are shared proportionally among all pool participants. Our risk management strategies are designed to minimize drawdowns and protect capital."
                },
                {
                  q: "When can I withdraw my funds?",
                  a: "Withdrawals are processed monthly, with requests submitted before the 25th of each month for processing on the 1st of the following month."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white p-5 md:p-6 rounded-xl shadow-sm"
                >
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">{faq.q}</h3>
                  <p className="text-gray-600 text-xs md:text-sm">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTA />
      </div>

      {/* Pool Modal */}
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