import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Phone, Mail, CreditCard } from 'lucide-react';

interface MpesaLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MpesaLimitModal = ({ isOpen, onClose }: MpesaLimitModalProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
        onClick={onClose}
        aria-label="Close modal"
      />

      {/* Modal - Mobile First Design */}
      <motion.div
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed inset-x-0 bottom-0 z-50 md:inset-0 md:flex md:items-center md:justify-center"
      >
        <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:max-w-[500px] md:mx-auto max-h-[90vh] overflow-y-auto">
          {/* Header - Sticky on mobile */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-t-2xl">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 leading-tight">
                Amount Exceeds <br className="block md:hidden" />
                <span className="text-amber-600">M-Pesa Limit</span>
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-full transition-colors flex-shrink-0"
              aria-label="Close modal"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 md:p-6">
            {/* Limit Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
              <p className="text-sm text-amber-800">
                <span className="font-bold">Maximum per transaction:</span>{' '}
                <span className="text-lg font-bold text-amber-600">KES 299,999</span>
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-800 text-sm md:text-base mb-1">
                    Multiple M-Pesa Transactions
                  </h3>
                  <p className="text-xs md:text-sm text-blue-700 leading-relaxed">
                    Split your investment into multiple M-Pesa transactions of up to KES 299,999 each.
                    Contact us to coordinate multiple payments.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-purple-800 text-sm md:text-base mb-1">
                    Bank Transfer
                  </h3>
                  <p className="text-xs md:text-sm text-purple-700 leading-relaxed">
                    For large investments, we accept direct bank transfers. Request our bank details
                    and we'll guide you through the process.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-3">
                Contact our team:
              </h3>
              <div className="space-y-3">
                <a 
                  href="tel:+254700123456" 
                  className="flex items-center gap-3 text-sm bg-white p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Phone size={16} className="text-[#ff444f]" />
                  <span className="text-gray-700 flex-1">+254 700 123 456</span>
                  <span className="text-xs text-[#ff444f]">Call now</span>
                </a>
                <a 
                  href="mailto:investments@tzxtrading.com" 
                  className="flex items-center gap-3 text-sm bg-white p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Mail size={16} className="text-[#ff444f]" />
                  <span className="text-gray-700 flex-1">investments@tzxtrading.com</span>
                  <span className="text-xs text-[#ff444f]">Email</span>
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-2">
              <a
                href="mailto:investments@tzxtrading.com"
                className="flex-1 border-2 border-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-sm text-center"
              >
                Contact Support
              </a>
              <button
                onClick={onClose}
                className="flex-1 bg-[#ff444f] text-white py-3 px-4 rounded-xl hover:bg-[#d43b44] transition-colors font-semibold text-sm"
              >
                Continue with Lower Amount
              </button>
            </div>

            {/* Note */}
            <p className="text-xs text-gray-400 text-center mt-4">
              We're here to help you with larger investments
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MpesaLimitModal;