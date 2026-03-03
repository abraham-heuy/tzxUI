import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Users, ArrowRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const pools = [
  {
    name: 'Stable Income',
    minAmount: 'KES 5,000',
    risk: 'Low',
    returns: '5-8%',
    icon: Shield,
    description: 'Perfect for beginners seeking steady, reliable returns with minimal risk exposure.'
  },
  {
    name: 'Balanced Growth',
    minAmount: 'KES 20,000',
    risk: 'Medium',
    returns: '10-15%',
    icon: TrendingUp,
    description: 'Optimal mix of growth and stability for intermediate investors.'
  },
  {
    name: 'High Yield',
    minAmount: 'KES 100,000',
    risk: 'High',
    returns: '20-30%',
    icon: Users,
    description: 'Maximum returns potential for experienced investors comfortable with market fluctuations.'
  }
];

const Pools = forwardRef<HTMLDivElement>((_, ref) => {
  const navigate = useNavigate();

  return (
    <section ref={ref} id="pools" className="relative py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Learn More link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-center mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Investment Pools
            </h2>
            <p className="text-xl text-gray-600">
              Choose the pool that matches your risk appetite
            </p>
          </div>
          
          {/* Learn More Link */}
          <motion.button
            whileHover={{ x: 5 }}
            onClick={() => navigate('/pools')}
            className="flex items-center gap-2 text-[#ff444f] hover:text-[#d43b44] font-semibold mt-4 sm:mt-0 group"
          >
            <span className="underline underline-offset-4 decoration-2 decoration-[#ff444f]/30 group-hover:decoration-[#ff444f] transition-all">
              Learn More About Pools
            </span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        {/* Pools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pools.map((pool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer border border-gray-100 group"
            >
              {/* New Top Styling - Clean with icon in circle */}
              <div className="relative h-32 bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-100 flex items-center justify-center">
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage: `radial-gradient(circle at 20px 20px, #ff444f 2px, transparent 2px)`,
                  backgroundSize: '40px 40px'
                }} />
                
                {/* Icon Circle */}
                <div className="relative z-10 w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform group-hover:rotate-3">
                  <pool.icon className="w-10 h-10 text-[#ff444f]" />
                </div>
                
                {/* Small accent dot */}
                <div className="absolute bottom-3 right-3 w-2 h-2 bg-[#ff444f] rounded-full opacity-50" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">{pool.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{pool.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-gray-500">Minimum</span>
                    <span className="font-semibold text-gray-900">{pool.minAmount}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-gray-500">Risk Level</span>
                    <span className="font-semibold text-gray-900">{pool.risk}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Est. Returns</span>
                    <span className="font-semibold text-green-600">{pool.returns} monthly</span>
                  </div>
                </div>

                {/* Button - Rounded well as requested */}
                <button className="w-full bg-[#ff444f] text-white py-3 rounded-full hover:bg-[#d43b44] transition-all font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                  Select Pool
                  <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Info Link for Mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-10 text-center md:hidden"
        >
          <button
            onClick={() => navigate('/pools')}
            className="inline-flex items-center gap-2 text-[#ff444f] font-semibold"
          >
            <Info size={18} />
            <span className="underline">Detailed Pool Information</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
});

Pools.displayName = 'Pools';
export default Pools;