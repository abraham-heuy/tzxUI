import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const CTA = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <section ref={ref} className="relative py-20 overflow-hidden">
      {/* Left-to-right gradient fade - from deep red to very pale red/white */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#cc3b44] via-[#e6a0a3] to-[#fae6e7]" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.1) 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />

      {/* Content */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Ready to Start Your{' '}
            <span className="text-[#cc3b44]">
              Investment Journey?
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Join expert-managed investment pools and start growing your wealth today. 
            Minimum investment from KES 5,000.
          </p>

          {/* Single CTA Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button className="group bg-[#cc3b44] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#b22f37] transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Simple disclaimer */}
          <p className="mt-6 text-xs text-gray-600">
            *Trading involves risk. Past performance doesn't guarantee future results.
          </p>
        </motion.div>
      </div>
    </section>
  );
});

CTA.displayName = 'CTA';
export default CTA;