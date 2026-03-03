import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  CheckCircle,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  MessageCircle,
  HeadphonesIcon
} from 'lucide-react';

import contactBg from '../assets/contact.jpg';

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [emailSubscription, setEmailSubscription] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setFormStatus('success');
    setTimeout(() => setFormStatus('idle'), 3000);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailSubscription) {
      setSubscribeStatus('success');
      setTimeout(() => setSubscribeStatus('idle'), 3000);
      setEmailSubscription('');
    }
  };

  // Contact information
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: [
        "+254 700 123 456",
        "+254 711 789 012"
      ],
      action: "Call us anytime",
      link: "tel:+254700123456"
    },
    {
      icon: Mail,
      title: "Email",
      details: [
        "info@tzxtrading.com",
        "support@tzxtrading.com"
      ],
      action: "Email us",
      link: "mailto:info@tzxtrading.com"
    },
    {
      icon: MapPin,
      title: "Office",
      details: [
        "14th Floor, Delta Tower",
        "Upper Hill, Nairobi, Kenya"
      ],
      action: "Get directions",
      link: "https://maps.google.com"
    },
    {
      icon: Clock,
      title: "Hours",
      details: [
        "Monday - Friday: 8am - 6pm",
        "Saturday: 9am - 1pm",
        "Sunday: Closed"
      ],
      action: "All times EAT"
    }
  ];

  // Support channels - FIXED: Store icon components, not JSX
  const supportChannels = [
    {
      icon: MessageCircle,
      name: "Live Chat",
      description: "Chat with our support team",
      available: "24/7",
      action: "Start Chat"
    },
    {
      icon: HeadphonesIcon,
      name: "WhatsApp",
      description: "Quick support on WhatsApp",
      available: "8am - 8pm",
      action: "WhatsApp Us"
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
          className="relative py-16 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${contactBg})`,
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
                Contact <span className="text-[#ff444f]">Us</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-4 md:mb-6 px-4">
                Get in touch with our team. We're here to help!
              </p>
              <div className="flex justify-center gap-2">
                <span className="w-12 md:w-16 h-1 bg-[#ff444f] rounded-full"></span>
                <span className="w-12 md:w-16 h-1 bg-white/50 rounded-full"></span>
                <span className="w-12 md:w-16 h-1 bg-[#ff444f] rounded-full"></span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Contact Section - Left Column (Info) + Right Column (Form) */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              {/* Left Column - Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Get in <span className="text-[#ff444f]">Touch</span>
                </h2>
                <p className="text-gray-600 mb-8">
                  Have questions about our investment pools? We're here to help you every step of the way.
                </p>

                {/* Contact Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {contactInfo.map((info, index) => {
                    const IconComponent = info.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 p-4 rounded-xl hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            <IconComponent className="w-5 h-5 text-[#ff444f]" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                            {info.details.map((detail, idx) => (
                              <p key={idx} className="text-sm text-gray-600">{detail}</p>
                            ))}
                            {info.action && (
                              <a 
                                href={info.link} 
                                className="text-xs text-[#ff444f] hover:underline mt-1 inline-block"
                              >
                                {info.action} →
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Support Channels - FIXED */}
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-900 mb-4">Quick Support Channels</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {supportChannels.map((channel, index) => {
                      const IconComponent = channel.icon;
                      return (
                        <button
                          key={index}
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-[#ff444f] hover:shadow-md transition-all group"
                        >
                          <div className="w-10 h-10 bg-[#ff444f]/10 rounded-lg flex items-center justify-center group-hover:bg-[#ff444f] transition-colors">
                            <IconComponent className="w-5 h-5 text-[#ff444f] group-hover:text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-medium text-gray-900 text-sm">{channel.name}</p>
                            <p className="text-xs text-gray-500">{channel.available}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Follow Us</h3>
                  <div className="flex gap-3">
                    {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
                      <a
                        key={index}
                        href="#"
                        className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#ff444f] hover:text-white transition-colors"
                      >
                        <Icon size={18} />
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Right Column - Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100"
              >
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                  Send us a <span className="text-[#ff444f]">Message</span>
                </h3>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff444f] focus:border-transparent transition-all outline-none"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff444f] focus:border-transparent transition-all outline-none"
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff444f] focus:border-transparent transition-all outline-none"
                      placeholder="+254 700 000 000"
                    />
                  </div>

                  {/* Subject Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff444f] focus:border-transparent transition-all outline-none bg-white"
                    >
                      <option value="">Select a subject</option>
                      <option value="investment">Investment Inquiry</option>
                      <option value="support">Customer Support</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff444f] focus:border-transparent transition-all outline-none resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#ff444f] text-white py-4 rounded-xl hover:bg-[#d43b44] transition-all font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <Send size={18} />
                    Send Message
                  </button>

                  {/* Form Status */}
                  {formStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg"
                    >
                      <CheckCircle size={18} />
                      <span className="text-sm">Message sent successfully! We'll get back to you soon.</span>
                    </motion.div>
                  )}
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Email Subscription Section */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Subscribe to Our <span className="text-[#ff444f]">Newsletter</span>
                </h2>
                <p className="text-gray-600">
                  Get the latest updates on investment opportunities and market insights
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <input
                      type="email"
                      value={emailSubscription}
                      onChange={(e) => setEmailSubscription(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff444f] focus:border-transparent transition-all outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#ff444f] text-white px-6 py-3 rounded-xl hover:bg-[#d43b44] transition-all font-semibold whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </div>

                {/* Subscription Status */}
                {subscribeStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg mt-3"
                  >
                    <CheckCircle size={16} />
                    <span className="text-sm">Successfully subscribed to our newsletter!</span>
                  </motion.div>
                )}

                <p className="text-xs text-gray-500 text-center mt-3">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>
            </motion.div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Contact;