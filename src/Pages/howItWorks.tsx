import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, UserCheck, Wallet, TrendingUp, Users, Shield, Clock } from 'lucide-react';
import CTA from '../components/sections/CTA';

// Import background image
import howItWorksBg from '../assets/works.jpg';

const HowItWorks = () => {
  const navigate = useNavigate();

  // Steps data
  const steps = [
    {
      number: "01",
      icon: <UserCheck className="w-8 h-8 text-white" />,
      title: "Create Your Account",
      description: "Sign up with your basic information including name, email, and phone number. The registration process takes less than 5 minutes.",
      details: [
        "Fill in your personal details",
        "Verify your email address",
        "Set up your secure password",
        "Agree to terms & conditions"
      ]
    },
    {
      number: "02",
      icon: <Wallet className="w-8 h-8 text-white" />,
      title: "Choose Your Investment Pool",
      description: "Select from our three professionally managed pools based on your risk appetite and investment goals.",
      details: [
        "Stable Income: Low risk, steady returns",
        "Balanced Growth: Medium risk, optimal mix",
        "High Yield: Higher risk, maximum returns"
      ]
    },
    {
      number: "03",
      icon: <Shield className="w-8 h-8 text-white" />,
      title: "Digital Signature & Agreement",
      description: "Review and digitally sign our investment agreement. Your typed name serves as your legal electronic signature.",
      details: [
        "Read the investment terms carefully",
        "Type your full name as signature",
        "Acknowledge risk disclosure",
        "Receive confirmation via email"
      ]
    },
    {
      number: "04",
      icon: <TrendingUp className="w-8 h-8 text-white" />,
      title: "Fund Your Investment",
      description: "Transfer your investment amount via M-Pesa to the designated paybill. Funds are allocated to your chosen pool.",
      details: [
        "Minimum investment: KES 5,000",
        "Secure M-Pesa integration",
        "Instant confirmation",
        "Funds visible in your dashboard"
      ]
    },
    {
      number: "05",
      icon: <Users className="w-8 h-8 text-white" />,
      title: "Professional Trading Begins",
      description: "Our expert trader manages the pooled funds, executing trades based on market analysis and proven strategies.",
      details: [
        "24/7 market monitoring",
        "Risk-managed positions",
        "Regular performance updates",
        "Transparent trade reporting"
      ]
    },
    {
      number: "06",
      icon: <Clock className="w-8 h-8 text-white" />,
      title: "Track & Withdraw Profits",
      description: "Monitor your investment performance in real-time and withdraw profits according to the pool's distribution schedule.",
      details: [
        "Real-time dashboard access",
        "Monthly profit distributions",
        "Withdrawal requests processed within 48 hours",
        "Detailed performance reports"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white font-['Inter,_sans-serif']">
      {/* Navigation Bar */}
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

      {/* Main Content */}
      <div className="pt-16">
        {/* Hero Section with Background */}
        <section 
          className="relative py-20 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${howItWorksBg})`,
          }}
        >
          <div className="absolute inset-0 bg-black/70" />
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                How <span className="text-[#ff444f]">It Works</span>
              </h1>
              <p className="text-xl text-gray-200 mb-6">
                Start your investment journey in six simple steps
              </p>
              <div className="flex justify-center gap-2">
                <span className="w-16 h-1 bg-[#ff444f] rounded-full"></span>
                <span className="w-16 h-1 bg-white/50 rounded-full"></span>
                <span className="w-16 h-1 bg-[#ff444f] rounded-full"></span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Simple, Transparent, and <span className="text-[#ff444f]">Professional</span>
              </h2>
              <div className="prose prose-lg text-gray-600 mx-auto">
                <p className="mb-4">
                  At TZX Trading, we've simplified the investment process so you can start growing your wealth without the complexity. Our platform handles everything from registration to professional trading, allowing you to benefit from expert market knowledge with minimal effort.
                </p>
                <p className="mb-4">
                  Whether you're a first-time investor or experienced trader looking for passive income, our pool-based investment system provides access to strategies typically reserved for institutional investors. Start with as little as KES 5,000 and watch your money grow.
                </p>
                <p>
                  Follow these six simple steps to begin your investment journey with TZX Trading today.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden group"
                >
                  {/* Step Number Background */}
                  <div className="absolute top-0 right-0 text-8xl font-bold text-gray-100 opacity-50 group-hover:opacity-30 transition-opacity">
                    {step.number}
                  </div>

                  {/* Content */}
                  <div className="p-8 relative z-10">
                    {/* Icon Circle */}
                    <div className="w-16 h-16 bg-gradient-to-br from-[#ff444f] to-[#d43b44] rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform">
                      {step.icon}
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4">
                      {step.description}
                    </p>

                    {/* Details List */}
                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-[#ff444f] font-bold mt-0.5">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Step Label */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <span className="inline-block px-3 py-1 bg-[#ff444f]/10 text-[#ff444f] text-sm font-semibold rounded-full">
                        Step {step.number}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Summary Section */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-gray-50 to-white p-8 md:p-12 rounded-3xl shadow-lg border border-gray-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-[#ff444f] mb-2">5 min</div>
                  <div className="text-gray-600">Registration time</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#ff444f] mb-2">KES 5,000</div>
                  <div className="text-gray-600">Minimum investment</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#ff444f] mb-2">24/7</div>
                  <div className="text-gray-600">Market monitoring</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <CTA />
      </div>
    </div>
  );
};

export default HowItWorks;