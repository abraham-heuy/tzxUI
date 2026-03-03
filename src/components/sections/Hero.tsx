import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeroProps {
  backgroundImage: string;
}

const Hero = forwardRef<HTMLDivElement, HeroProps>(({ backgroundImage }, ref) => {
  const navigate = useNavigate();

  const heroStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  const scrollToPools = () => {
    const poolsSection = document.getElementById('pools');
    if (poolsSection) {
      poolsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={ref} 
      className="relative min-h-screen flex items-center justify-center px-4"
      style={heroStyle}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative text-center text-white max-w-4xl mx-auto z-10"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Let a Professional Trader(TZX)
          <span className="block text-[#ff444f]">
            Handle Your Investments
          </span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-200">
          Join expert-managed investment pools designed for your financial goals
        </p>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={scrollToPools}
            className="bg-[#ff444f] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#d43b44] transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            View Investment Pools
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => navigate('/about')}
            className="bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/30 transition-all border border-white/30"
          >
            Learn More
          </button>
        </div>

        {/* Scroll Indicator - Moved outside the motion.div but still within section */}
      </motion.div>
      
      {/* Arrow positioned absolutely at bottom */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer"
        onClick={scrollToPools}
      >
        <ChevronDown size={32} className="text-white" />
      </motion.div>
    </section>
  );
});

Hero.displayName = 'Hero';
export default Hero;