import { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle,
  FileText,
  X,
  Shield,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  BookOpen,
  Eye,
  Timer,
  TrendingDown,
  AlertOctagon
} from 'lucide-react';

const Disclaimer = forwardRef<HTMLDivElement>((_, ref) => {
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  // Terms and Conditions content
  const termsContent = {
    introduction: "Welcome to TZX Trading. By accessing or using our platform, you agree to be bound by these Terms and Conditions. Please read them carefully before investing.",
    
    sections: [
      {
        title: "1. Risk Disclosure",
        icon: <AlertCircle className="w-5 h-5 text-amber-600" />,
        content: "Trading in financial markets involves substantial risk of loss. Past performance does not guarantee future results. You should never invest money that you cannot afford to lose. The leveraged nature of trading means that losses can exceed deposits. It is important to fully understand the risks involved before engaging in any investment activity."
      },
      {
        title: "2. Investment Pools",
        icon: <Shield className="w-5 h-5 text-amber-600" />,
        content: "Our investment pools are managed by professional traders who employ various strategies. Pool performance varies based on market conditions, strategy execution, and risk management. Returns are not guaranteed and can fluctuate. Minimum investment periods apply to each pool as specified in the pool description."
      },
      {
        title: "3. Profit & Loss",
        icon: <TrendingDown className="w-5 h-5 text-amber-600" />,
        content: "The trader manages all withdrawals and profit distributions. If there are no profits in a given period, there will be no withdrawals processed. Trading losses are a normal part of market activity and investors must accept that losses may occur. The trader determines when profits are available for withdrawal based on pool performance."
      },
      {
        title: "4. Withdrawal Policy",
        icon: <Timer className="w-5 h-5 text-amber-600" />,
        content: "Withdrawals are processed only when profits are available. The trader handles all withdrawal requests and determines the timing based on pool liquidity and market conditions. Investors must wait for profitable trading periods before any withdrawals can be made. There is no guaranteed withdrawal schedule."
      },
      {
        title: "5. Fees and Charges",
        icon: <FileText className="w-5 h-5 text-amber-600" />,
        content: "Management fees are charged monthly and deducted from pool profits before distribution. Withdrawal fees of 1% apply to all withdrawals. Deposit fees may apply based on the payment method used. All fees are clearly disclosed in your account dashboard."
      },
      {
        title: "6. Account Security",
        icon: <Shield className="w-5 h-5 text-amber-600" />,
        content: "You are responsible for maintaining the security of your account credentials. Enable two-factor authentication for additional security. Report any unauthorized access immediately. We employ bank-grade security measures but cannot be held responsible for compromised user credentials."
      },
      {
        title: "7. Regulatory Compliance",
        icon: <CheckCircle className="w-5 h-5 text-amber-600" />,
        content: "TZX Trading operates in compliance with applicable financial regulations. Users must provide accurate KYC information and comply with anti-money laundering requirements. We reserve the right to refuse service to anyone in jurisdictions where our services may be restricted."
      },
      {
        title: "8. Limitation of Liability",
        icon: <AlertCircle className="w-5 h-5 text-amber-600" />,
        content: "TZX Trading, its affiliates, employees, and agents shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our services, including but not limited to trading losses, data loss, or business interruption."
      },
      {
        title: "9. Amendments",
        icon: <FileText className="w-5 h-5 text-amber-600" />,
        content: "We reserve the right to modify these terms at any time. Continued use of our platform after changes constitutes acceptance of the modified terms. Material changes will be communicated via email or platform notification."
      }
    ],

    agreement: "By investing with TZX Trading, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions and all associated risks. You understand that trading losses are possible and that withdrawals are processed only when profits are available."
  };

  // Disclaimer points
  const disclaimerPoints = [
    {
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      title: "Trading Involves Risk",
      description: "Financial trading carries substantial risk of loss. Never invest money you cannot afford to lose."
    },
    {
      icon: <Timer className="w-5 h-5 text-amber-600" />,
      title: "Trader Controls Withdrawals",
      description: "The trader manages all withdrawals. If there's no profit, there's no withdrawal. Be patient."
    },
    {
      icon: <TrendingDown className="w-5 h-5 text-amber-600" />,
      title: "Losses Are Possible",
      description: "Trading losses are normal. Accept that losses may occur as part of the investment process."
    },
    {
      icon: <Shield className="w-5 h-5 text-amber-600" />,
      title: "Past Performance",
      description: "Historical returns do not guarantee future results. Market conditions can change rapidly."
    }
  ];

  return (
    <>
      {/* Disclaimer Section */}
      <section ref={ref} className="py-12 md:py-16 bg-gradient-to-br from-amber-50 to-amber-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-10"
          >
            <div className="inline-flex items-center gap-2 bg-amber-200/50 px-4 py-2 rounded-full mb-4">
              <AlertTriangle size={16} className="text-amber-700" />
              <span className="text-amber-800 text-sm font-medium">Important Information</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Important <span className="text-amber-600">Disclaimers</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
              Please review these important notices before proceeding with your investment
            </p>
          </motion.div>

          {/* Disclaimer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {disclaimerPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-5 md:p-6 shadow-lg hover:shadow-xl transition-all border border-amber-200/50"
              >
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-3">
                  {point.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-base md:text-lg">
                  {point.title}
                </h3>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                  {point.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* NEW: Deriv Risk Disclosure Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-xl p-6 shadow-md"
          >
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertOctagon className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-800 mb-3">Deriv Products Risk Warning</h3>
                <div className="space-y-3 text-sm text-red-700">
                  <p>
                    <span className="font-semibold">Deriv offers complex derivatives,</span> such as options and contracts for difference ("CFDs"). 
                    These products may not be suitable for all clients, and trading them puts you at risk.
                  </p>
                  
                  <p className="font-semibold">Please make sure that you understand the following risks before trading Deriv products:</p>
                  
                  <ul className="space-y-2 list-disc list-inside pl-2">
                    <li className="text-red-700">
                      you may lose <span className="font-bold">some or all</span> of the money you invest in the trade
                    </li>
                    <li className="text-red-700">
                      if your trade involves currency conversion, exchange rates will affect your profit and loss
                    </li>
                  </ul>
                  
                  <p className="font-bold text-red-800 mt-2">
                    You should never trade with borrowed money or with money that you cannot afford to lose.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Terms and Conditions Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => setIsTermsOpen(true)}
              className="group flex items-center gap-3 bg-amber-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl hover:bg-amber-700 transition-all shadow-md hover:shadow-lg w-full sm:w-auto justify-center"
            >
              <Eye size={20} />
              <span className="font-semibold">Read Full Terms & Conditions</span>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="text-xs text-gray-500 text-center sm:text-left">
              By investing, you agree to our terms and conditions
            </p>
          </motion.div>

          {/* Additional Disclaimer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">
              *TZX Trading does not provide investment advice. All investment decisions are made by professional traders. 
              Trading losses are possible and withdrawals are processed only when profits are available.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Terms and Conditions Modal */}
      <AnimatePresence>
        {isTermsOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-50"
              onClick={() => setIsTermsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="fixed inset-4 md:inset-8 z-50 flex items-center justify-center pointer-events-none"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-full overflow-hidden pointer-events-auto flex flex-col">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-bold text-gray-900">
                        Terms & Conditions
                      </h2>
                      <p className="text-xs text-gray-500">
                        Last updated: March 2026
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsTermsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} className="text-gray-600" />
                  </button>
                </div>

                {/* Modal Content - Scrollable */}
                <div className="p-4 md:p-6 overflow-y-auto flex-1">
                  {/* Introduction */}
                  <div className="mb-6 bg-amber-50 p-4 rounded-xl border-l-4 border-amber-500">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {termsContent.introduction}
                    </p>
                  </div>

                  {/* Terms Sections */}
                  <div className="space-y-4 mb-6">
                    {termsContent.sections.map((section, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-3 mb-2">
                          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            {section.icon}
                          </div>
                          <h3 className="font-semibold text-gray-900 text-base md:text-lg">
                            {section.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed pl-11">
                          {section.content}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Agreement Statement */}
                  <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-4 md:p-5 rounded-xl text-white">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                      <p className="text-sm leading-relaxed">
                        {termsContent.agreement}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex flex-col gap-3 mt-6">
                    <button
                      onClick={() => setIsTermsOpen(false)}
                      className="w-full bg-amber-600 text-white py-3 rounded-xl hover:bg-amber-700 transition-colors font-semibold text-sm"
                    >
                      I Have Read and Understand
                    </button>
                  </div>

                  {/* Footer Note */}
                  <p className="text-xs text-gray-400 text-center mt-4">
                    These terms constitute a legally binding agreement between you and TZX Trading.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});

Disclaimer.displayName = 'Disclaimer';
export default Disclaimer;