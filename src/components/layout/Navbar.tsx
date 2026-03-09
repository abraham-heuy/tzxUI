import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  navItems: Array<{ name: string; href: string }>;
}

const Navbar: React.FC<NavbarProps> = ({ navItems }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (href: string) => {
    setIsMenuOpen(false);
    if (href.startsWith('#')) {
      if (window.location.pathname !== '/') {
        navigate('/' + href);
      } else {
        const element = document.getElementById(href.substring(1));
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex-shrink-0 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <h1 className="text-2xl font-bold text-[#ff444f]">
              TZX<span className="text-gray-900">Trading</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className="text-gray-700 hover:text-[#ff444f] transition-colors duration-200 font-medium"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Login Button - Clean Gray */}
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 font-medium"
            >
              Login
            </button>
            
            {/* Get Started Button */}
            <button 
              onClick={() => navigate('/register')}
              className="bg-[#ff444f] text-white px-6 py-2 rounded-full hover:bg-[#d43b44] transition-colors duration-200 font-semibold"
            >
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-[#ff444f]"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-gray-200"
        >
          <div className="px-4 py-2 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className="block w-full text-left py-2 text-gray-700 hover:text-[#ff444f]"
              >
                {item.name}
              </button>
            ))}
            
            {/* Mobile Login Button - Clean Gray */}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                navigate('/login');
              }}
              className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium text-center mt-2"
            >
              Login
            </button>
            
            {/* Mobile Get Started Button */}
            <button 
              onClick={() => {
                setIsMenuOpen(false);
                navigate('/register');
              }}
              className="w-full bg-[#ff444f] text-white px-4 py-3 rounded-xl hover:bg-[#d43b44] transition-colors font-semibold text-center"
            >
              Get Started
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;