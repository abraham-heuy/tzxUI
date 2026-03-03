import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Shield, Users, Award, Target, HeartHandshake, ExternalLink } from 'lucide-react';
import CTA from '../components/sections/CTA';

// Import background image for the heading section
import aboutHeroBg from '../assets/about-hero-bg.jpg';

const About = () => {
  const navigate = useNavigate();

  // Services data
  const services = [
    {
      icon: <TrendingUp className="w-8 h-8 text-[#ff444f]" />,
      title: "Professional Trading",
      description: "Expert-managed investment pools with proven strategies and risk management."
    },
    {
      icon: <Shield className="w-8 h-8 text-[#ff444f]" />,
      title: "Portfolio Management",
      description: "Diversified investment portfolios tailored to different risk appetites."
    },
    {
      icon: <Users className="w-8 h-8 text-[#ff444f]" />,
      title: "Pool Investing",
      description: "Join forces with other investors to access better trading opportunities."
    },
    {
      icon: <Award className="w-8 h-8 text-[#ff444f]" />,
      title: "Performance Tracking",
      description: "Real-time monitoring of your investments and pool performance."
    },
    {
      icon: <Target className="w-8 h-8 text-[#ff444f]" />,
      title: "Goal-Based Planning",
      description: "Investment strategies aligned with your financial goals."
    },
    {
      icon: <HeartHandshake className="w-8 h-8 text-[#ff444f]" />,
      title: "Client Support",
      description: "Dedicated support team to assist you throughout your investment journey."
    }
  ];

  // Quotes from TZX Trader
  const quotes = [
    {
      text: "Success in trading isn't about being right, it's about managing risk and staying disciplined.",
      author: "TZX Trader"
    },
    {
      text: "We don't just trade markets, we build wealth through consistent, data-driven strategies.",
      author: "TZX Trading Team"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-['Inter,_sans-serif']">
      {/* Navigation Bar - Simple with back arrow */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
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

      {/* Main Content - Add padding top for fixed navbar */}
      <div className="pt-16">
        {/* Hero Section for About - WITH BACKGROUND IMAGE */}
        <section 
          className="relative py-20 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${aboutHeroBg})`,
          }}
        >
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/60" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                About <span className="text-[#ff444f]">TZX Trading</span>
              </h1>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                Your trusted partner in professional investment management
              </p>
              
              {/* Optional decorative element */}
              <div className="mt-6 flex justify-center gap-2">
                <span className="w-12 h-1 bg-[#ff444f] rounded-full"></span>
                <span className="w-12 h-1 bg-white/50 rounded-full"></span>
                <span className="w-12 h-1 bg-[#ff444f] rounded-full"></span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Who We Are Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Who <span className="text-[#ff444f]">We Are</span>
                </h2>
                <div className="prose prose-lg text-gray-600">
                  <p className="mb-4">
                    TZX Trading is a premier investment management platform that connects everyday investors with professional trading expertise. We believe that sophisticated investment strategies shouldn't be reserved for the wealthy elite.
                  </p>
                  <p className="mb-4">
                    Founded by experienced traders with over a decade of combined market experience, we've created a platform that democratizes access to professional trading. Our pool-based investment system allows you to start with as little as KES 5,000 while benefiting from the same strategies used by institutional investors.
                  </p>
                  <p>
                    We combine cutting-edge technology with human expertise to deliver consistent returns while managing risk effectively. Our team monitors markets 24/7, adjusting strategies to capitalize on opportunities and protect your capital.
                  </p>
                </div>
                
                {/* TZX Link */}
                <motion.a
                  href="https://tzxtraders.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-6 text-[#ff444f] hover:text-[#d43b44] font-semibold group"
                  whileHover={{ x: 5 }}
                >
                  Learn more about TZX Trading 
                  <ExternalLink size={18} className="group-hover:scale-110 transition-transform" />
                </motion.a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-[#ff444f] to-[#d43b44] p-8 rounded-2xl text-white"
              >
                <h3 className="text-2xl font-bold mb-4">Our Promise</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-white font-bold">✓</span>
                    <span>Transparent fee structure with no hidden charges</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white font-bold">✓</span>
                    <span>Regular performance updates and reports</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white font-bold">✓</span>
                    <span>Professional risk management protocols</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white font-bold">✓</span>
                    <span>Dedicated client support team</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                What <span className="text-[#ff444f]">We Offer</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive investment services designed for your success
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100"
                >
                  <div className="mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Quotes Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {quotes.map((quote, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="mb-8 last:mb-0"
              >
                <div className="bg-gradient-to-r from-gray-50 to-white p-8 rounded-2xl border-l-4 border-[#ff444f] shadow-md">
                  <p className="text-xl md:text-2xl text-gray-800 font-bold italic mb-4">
                    "{quote.text}"
                  </p>
                  <p className="text-[#ff444f] font-semibold text-right">
                    — {quote.author}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our <span className="text-[#ff444f]">Mission</span>
              </h2>
              <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl">
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
                  To democratize access to professional trading by providing 
                  <span className="text-[#ff444f] font-semibold"> transparent, secure, and profitable </span> 
                  investment opportunities that empower everyday investors to build lasting wealth.
                </p>
                <div className="mt-8 flex justify-center gap-2">
                  <span className="w-2 h-2 bg-[#ff444f] rounded-full"></span>
                  <span className="w-2 h-2 bg-[#ff444f] rounded-full"></span>
                  <span className="w-2 h-2 bg-[#ff444f] rounded-full"></span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Reusing the CTA component */}
        <CTA />
      </div>
    </div>
  );
};

export default About;