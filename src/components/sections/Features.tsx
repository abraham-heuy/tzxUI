import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Users } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: "Secure & Regulated",
    description: "Your funds are protected with bank-grade security"
  },
  {
    icon: TrendingUp,
    title: "Professional Trading",
    description: "Experienced trader managing your investments"
  },
  {
    icon: Users,
    title: "Pool Together",
    description: "Join forces with other investors for better returns"
  }
];

const Features = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <section ref={ref} className="relative py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose TZX Trading?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional trading without the complexity
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100"
            >
              <feature.icon className="w-12 h-12 text-[#ff444f] mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

Features.displayName = 'Features';
export default Features;