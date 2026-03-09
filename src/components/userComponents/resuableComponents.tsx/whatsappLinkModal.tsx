import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Users, ExternalLink, Check } from 'lucide-react';

interface WhatsAppGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WhatsAppGroupModal = ({ isOpen, onClose }: WhatsAppGroupModalProps) => {
  // Get WhatsApp group link from environment variable
  const whatsappGroupLink = import.meta.env.VITE_WHATSAPP_GROUP_LINK || '#';

  const handleJoinGroup = () => {
    window.open(whatsappGroupLink, '_blank');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Join Our Community</h2>
                  <p className="text-sm text-white/90">Connect with other investors</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">WhatsApp Group</h3>
              <p className="text-gray-600 text-sm">
                Join our exclusive WhatsApp group to connect with fellow investors, 
                get real-time updates, and participate in discussions.
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h4 className="font-medium text-gray-900 mb-3 text-sm">What you'll get:</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Real-time market updates and analysis</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Connect with experienced investors</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Get answers to your questions quickly</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Exclusive investment opportunities</span>
                </li>
              </ul>
            </div>

            {/* Link Preview (optional - you can remove this if you don't want to show the link) */}
            {whatsappGroupLink !== '#' && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg text-center">
                <p className="text-xs text-blue-700 break-all">{whatsappGroupLink}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-gray-700 font-medium"
              >
                Later
              </button>
              <button
                onClick={handleJoinGroup}
                disabled={whatsappGroupLink === '#'}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <ExternalLink size={18} />
                Join Group
              </button>
            </div>

            {/* Note */}
            <p className="text-xs text-gray-400 text-center mt-4">
              By joining, you agree to follow the group rules and community guidelines.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WhatsAppGroupModal;