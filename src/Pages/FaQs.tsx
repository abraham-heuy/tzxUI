import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ChevronDown,
  Menu,
  X,
  CreditCard,
  Shield,
  Scale,
  UserPlus,
  TrendingUp,
  HelpCircle,
  FileText,
  DollarSign,
  MessageCircle
} from 'lucide-react';

// Import background image
import faqsBg from '../assets/faqs.jpg';

// FAQ Category Icons mapping
const categoryIcons: Record<string, any> = {
  'All': HelpCircle,
  'Registration': UserPlus,
  'Transactions': CreditCard,
  'Security': Shield,
  'Ethics': Scale,
  'Investments': TrendingUp,
  'Accounts': FileText,
  'Withdrawals': DollarSign,
  'Support': MessageCircle
};

const FAQs = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);

  // FAQ Categories
  const categories = [
    'All',
    'Registration',
    'Transactions',
    'Security',
    'Ethics',
    'Investments',
    'Accounts',
    'Withdrawals',
    'Support'
  ];

  // FAQ Data
  const faqs = [
    // Registration Category
    {
      id: 1,
      category: 'Registration',
      question: 'How do I create an account?',
      answer: 'Creating an account is simple. Click the "Get Started" button, fill in your personal details including name, email, and phone number, then verify your email address. The entire process takes less than 5 minutes.'
    },
    {
      id: 2,
      category: 'Registration',
      question: 'What documents do I need to register?',
      answer: 'You need a valid government-issued ID (National ID or Passport), your tax PIN, and a proof of address (utility bill or bank statement from the last 3 months).'
    },
    {
      id: 3,
      category: 'Registration',
      question: 'Is there a minimum age requirement?',
      answer: 'Yes, you must be at least 18 years old to register and invest with TZX Trading. This is in compliance with financial regulations.'
    },
    {
      id: 4,
      category: 'Registration',
      question: 'Can I register as a business entity?',
      answer: 'Yes, businesses can register by providing company registration documents, director identification, and business tax PIN. Contact our support team for assistance.'
    },

    // Transactions Category
    {
      id: 5,
      category: 'Transactions',
      question: 'How do I fund my investment?',
      answer: 'You can fund your investment via M-Pesa Paybill. Simply select your preferred pool, enter the amount, and you\'ll receive an STK push on your phone to complete the transaction.'
    },
    {
      id: 6,
      category: 'Transactions',
      question: 'What are the transaction limits?',
      answer: 'M-Pesa transactions have a minimum of KES 100 and maximum of KES 150,000 per transaction. For larger amounts, you can make multiple transactions or contact us for bank transfer options.'
    },
    {
      id: 7,
      category: 'Transactions',
      question: 'How long do transactions take?',
      answer: 'M-Pesa transactions are instant. Bank transfers may take 1-3 business days to reflect in your investment account.'
    },
    {
      id: 8,
      category: 'Transactions',
      question: 'Are there transaction fees?',
      answer: 'M-Pesa transaction fees apply as per Safaricom rates. TZX Trading does not charge additional fees for deposits. Withdrawal fees are 1% of the withdrawal amount.'
    },

    // Security Category
    {
      id: 9,
      category: 'Security',
      question: 'How secure is my investment?',
      answer: 'We employ bank-grade security measures including 256-bit SSL encryption, two-factor authentication, and secure data storage. Your funds are held in segregated accounts.'
    },
    {
      id: 10,
      category: 'Security',
      question: 'Is my personal data safe?',
      answer: 'Yes, we comply with data protection regulations. Your personal information is encrypted and never shared with third parties without your consent.'
    },
    {
      id: 11,
      category: 'Security',
      question: 'What is two-factor authentication?',
      answer: '2FA adds an extra layer of security by requiring a one-time code sent to your phone in addition to your password when logging in.'
    },
    {
      id: 12,
      category: 'Security',
      question: 'How do you prevent fraud?',
      answer: 'We have advanced fraud detection systems, regular security audits, and strict verification processes for all transactions and account changes.'
    },

    // Ethics Category
    {
      id: 13,
      category: 'Ethics',
      question: 'How do you ensure ethical trading?',
      answer: 'We follow strict ethical guidelines, maintain transparency in all operations, and our traders adhere to a code of conduct that prioritizes client interests.'
    },
    {
      id: 14,
      category: 'Ethics',
      question: 'Do you have a conflict of interest policy?',
      answer: 'Yes, we have comprehensive policies to identify, disclose, and manage any potential conflicts of interest, ensuring client interests always come first.'
    },
    {
      id: 15,
      category: 'Ethics',
      question: 'How transparent are your operations?',
      answer: 'We provide regular performance reports, clear fee structures, and full disclosure of trading strategies and risks involved.'
    },
    {
      id: 16,
      category: 'Ethics',
      question: 'What regulations do you follow?',
      answer: 'We operate in compliance with local and international financial regulations, including anti-money laundering (AML) and know your customer (KYC) requirements.'
    },

    // Investments Category
    {
      id: 17,
      category: 'Investments',
      question: 'What are investment pools?',
      answer: 'Investment pools combine funds from multiple investors to create larger trading positions. This allows access to better opportunities and professional management with lower minimum investments.'
    },
    {
      id: 18,
      category: 'Investments',
      question: 'How are returns calculated?',
      answer: 'Returns are calculated based on the pool\'s trading performance, minus management fees. Profits are distributed monthly proportionally to each investor\'s contribution.'
    },
    {
      id: 19,
      category: 'Investments',
      question: 'What is the minimum investment?',
      answer: 'Our minimum investment is KES 5,000 for the Stable Income Pool. Higher-tier pools have higher minimums but offer potentially higher returns.'
    },
    {
      id: 20,
      category: 'Investments',
      question: 'Can I lose my money?',
      answer: 'Trading involves risk, and it\'s possible to lose money. However, our risk management strategies are designed to minimize losses. We recommend choosing a pool that matches your risk tolerance.'
    },

    // Accounts Category
    {
      id: 21,
      category: 'Accounts',
      question: 'How do I view my investment performance?',
      answer: 'You can log into your dashboard anytime to view real-time performance, transaction history, and detailed reports of your investments.'
    },
    {
      id: 22,
      category: 'Accounts',
      question: 'Can I update my personal information?',
      answer: 'Yes, you can update most information through your account settings. Some changes may require verification for security purposes.'
    },
    {
      id: 23,
      category: 'Accounts',
      question: 'What happens if I forget my password?',
      answer: 'Use the "Forgot Password" link on the login page to reset your password via email. You\'ll receive instructions to create a new password.'
    },
    {
      id: 24,
      category: 'Accounts',
      question: 'Can I have multiple accounts?',
      answer: 'No, each individual or business can only have one account to ensure compliance with regulations and prevent fraud.'
    },

    // Withdrawals Category
    {
      id: 25,
      category: 'Withdrawals',
      question: 'How do I withdraw my funds?',
      answer: 'Submit a withdrawal request through your dashboard. Withdrawals are processed monthly, with requests before the 25th paid on the 1st of the following month.'
    },
    {
      id: 26,
      category: 'Withdrawals',
      question: 'Are there withdrawal fees?',
      answer: 'Yes, a 1% fee applies to withdrawals to cover transaction costs. The minimum withdrawal amount is KES 1,000.'
    },
    {
      id: 27,
      category: 'Withdrawals',
      question: 'How long do withdrawals take?',
      answer: 'Withdrawals are processed within 48 hours of the monthly processing date. Funds are sent via M-Pesa or bank transfer depending on your preference.'
    },
    {
      id: 28,
      category: 'Withdrawals',
      question: 'Can I withdraw partial amounts?',
      answer: 'Yes, you can withdraw partial amounts as long as you maintain the minimum balance required for your pool (KES 5,000 for Stable Income).'
    },

    // Support Category
    {
      id: 29,
      category: 'Support',
      question: 'How do I contact customer support?',
      answer: 'You can reach us via live chat, email at support@tzxtrading.com, or phone at +254 700 123 456 during business hours.'
    },
    {
      id: 30,
      category: 'Support',
      question: 'What are your support hours?',
      answer: 'Our support team is available Monday-Friday 8am-6pm, Saturday 9am-1pm. Live chat is available 24/7 for basic inquiries.'
    },
    {
      id: 31,
      category: 'Support',
      question: 'Do you have a physical office?',
      answer: 'Yes, we\'re located at 14th Floor, Delta Tower, Upper Hill, Nairobi. Visit us during business hours for in-person assistance.'
    },
    {
      id: 32,
      category: 'Support',
      question: 'How quickly do you respond to emails?',
      answer: 'We aim to respond to all email inquiries within 24 hours during business days.'
    }
  ];

  // Filter FAQs based on active category
  const filteredFaqs = activeCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  // Toggle question expansion
  const toggleQuestion = (id: number) => {
    setExpandedQuestions(prev =>
      prev.includes(id)
        ? prev.filter(qId => qId !== id)
        : [...prev, id]
    );
  };

  // Get icon for category
  const CategoryIcon = categoryIcons[activeCategory] || HelpCircle;

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

            {/* Mobile Sidebar Toggle */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden ml-4 p-2 text-gray-700 hover:text-[#ff444f]"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16">
        {/* Hero Section */}
        <section 
          className="relative py-16 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${faqsBg})`,
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
                Frequently Asked <span className="text-[#ff444f]">Questions</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-4 md:mb-6 px-4">
                Find answers to common questions about our platform and services
              </p>
              <div className="flex justify-center gap-2">
                <span className="w-12 md:w-16 h-1 bg-[#ff444f] rounded-full"></span>
                <span className="w-12 md:w-16 h-1 bg-white/50 rounded-full"></span>
                <span className="w-12 md:w-16 h-1 bg-[#ff444f] rounded-full"></span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQs Section with Sidebar */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Desktop Sidebar */}
              <div className="hidden lg:block lg:w-64 flex-shrink-0">
                <div className="bg-white rounded-2xl shadow-lg p-4 sticky top-24">
                  <h3 className="font-semibold text-gray-900 mb-4 px-3">Categories</h3>
                  <div className="space-y-1">
                    {categories.map((category) => {
                      const Icon = categoryIcons[category] || HelpCircle;
                      return (
                        <button
                          key={category}
                          onClick={() => setActiveCategory(category)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                            activeCategory === category
                              ? 'bg-[#ff444f] text-white'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <Icon size={18} />
                          <span className="text-sm font-medium">{category}</span>
                          {category !== 'All' && (
                            <span className={`ml-auto text-xs ${
                              activeCategory === category ? 'text-white/80' : 'text-gray-400'
                            }`}>
                              {faqs.filter(f => f.category === category).length}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Category Info */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 px-3">
                      <CategoryIcon className="w-5 h-5 text-[#ff444f]" />
                      <div>
                        <p className="text-xs text-gray-500">Current Category</p>
                        <p className="font-medium text-gray-900">{activeCategory}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Sidebar (Drawer) */}
              <AnimatePresence>
                {isSidebarOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                      onClick={() => setIsSidebarOpen(false)}
                    />
                    <motion.div
                      initial={{ x: '100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '100%' }}
                      transition={{ type: 'tween' }}
                      className="fixed right-0 top-0 h-full w-64 bg-white z-50 shadow-2xl lg:hidden"
                    >
                      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900">Categories</h3>
                        <button
                          onClick={() => setIsSidebarOpen(false)}
                          className="p-1 hover:bg-gray-100 rounded-lg"
                        >
                          <X size={20} />
                        </button>
                      </div>
                      <div className="p-4 space-y-1 overflow-y-auto h-[calc(100%-64px)]">
                        {categories.map((category) => {
                          const Icon = categoryIcons[category] || HelpCircle;
                          return (
                            <button
                              key={category}
                              onClick={() => {
                                setActiveCategory(category);
                                setIsSidebarOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                                activeCategory === category
                                  ? 'bg-[#ff444f] text-white'
                                  : 'hover:bg-gray-100 text-gray-700'
                              }`}
                            >
                              <Icon size={18} />
                              <span className="text-sm font-medium">{category}</span>
                              {category !== 'All' && (
                                <span className={`ml-auto text-xs ${
                                  activeCategory === category ? 'text-white/80' : 'text-gray-400'
                                }`}>
                                  {faqs.filter(f => f.category === category).length}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* FAQs Content */}
              <div className="flex-1">
                {/* Category Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-lg p-6 mb-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#ff444f]/10 rounded-xl flex items-center justify-center">
                      <CategoryIcon className="w-6 h-6 text-[#ff444f]" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                        {activeCategory} <span className="text-[#ff444f]">FAQs</span>
                      </h2>
                      <p className="text-sm text-gray-500">
                        {filteredFaqs.length} {filteredFaqs.length === 1 ? 'question' : 'questions'} available
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* FAQ Items */}
                <div className="space-y-3">
                  {filteredFaqs.map((faq, index) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden"
                    >
                      {/* Question Button */}
                      <button
                        onClick={() => toggleQuestion(faq.id)}
                        className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <span className="text-[#ff444f] font-bold text-sm mt-1">
                            Q{index + 1}.
                          </span>
                          <span className="font-medium text-gray-900 pr-4">
                            {faq.question}
                          </span>
                        </div>
                        <motion.div
                          animate={{ rotate: expandedQuestions.includes(faq.id) ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        </motion.div>
                      </button>

                      {/* Answer Panel */}
                      <AnimatePresence>
                        {expandedQuestions.includes(faq.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="p-5 md:p-6 pt-0 border-t border-gray-100">
                              <div className="flex items-start gap-3">
                                <span className="text-green-600 font-bold text-sm mt-1">
                                  A.
                                </span>
                                <p className="text-gray-600 leading-relaxed">
                                  {faq.answer}
                                </p>
                              </div>
                              
                              {/* Category Tag */}
                              <div className="mt-3 flex items-center gap-2">
                                <span className="text-xs text-gray-400">Category:</span>
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                  {faq.category}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}

                  {/* No Results */}
                  {filteredFaqs.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white rounded-2xl shadow-lg p-12 text-center"
                    >
                      <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No FAQs Found</h3>
                      <p className="text-gray-500">
                        There are no questions in this category yet.
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Still Have Questions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="mt-8 bg-gradient-to-r from-[#ff444f] to-[#d43b44] rounded-2xl shadow-lg p-6 md:p-8 text-center"
                >
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                    Still Have Questions?
                  </h3>
                  <p className="text-white/90 mb-4">
                    Can't find the answer you're looking for? Please contact our support team.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button 
                      onClick={() => navigate('/contact')}
                      className="bg-white text-[#ff444f] px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Contact Support
                    </button>
                    <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors">
                      Live Chat
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FAQs;