import { motion } from 'framer-motion';
import { X, User, Mail, Phone, Calendar, Clock, MessageCircle, Mail as MailIcon } from 'lucide-react';
import type { ContactMessage } from './contactCard';

interface ContactDetailsModalProps {
  isOpen: boolean;
  message: ContactMessage | null;
  onClose: () => void;
  onReply?: (message: ContactMessage) => void;
}

const ContactDetailsModal = ({ isOpen, message, onClose, onReply }: ContactDetailsModalProps) => {
  if (!isOpen || !message) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-KE', {
      dateStyle: 'full',
      timeStyle: 'long'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'text-blue-700 bg-blue-100';
      case 'read': return 'text-gray-700 bg-gray-100';
      case 'replied': return 'text-green-700 bg-green-100';
      case 'archived': return 'text-amber-700 bg-amber-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#ff444f]/10 rounded-full flex items-center justify-center">
                <MailIcon className="w-5 h-5 text-[#ff444f]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{message.messageReference}</h3>
                <p className="text-sm text-gray-600">{message.subject}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Status Badge */}
          <div className="mb-6">
            <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getStatusColor(message.status)}`}>
              <MessageCircle size={12} />
              Status: {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
            </span>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User size={16} className="text-gray-400" />
                <span className="text-gray-700">{message.fullName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail size={16} className="text-gray-400" />
                <a href={`mailto:${message.email}`} className="text-gray-600 hover:text-[#ff444f]">
                  {message.email}
                </a>
              </div>
              {message.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={16} className="text-gray-400" />
                  <a href={`tel:${message.phone}`} className="text-gray-600 hover:text-[#ff444f]">
                    {message.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Original Message */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-2">Message</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{message.message}</p>
            </div>
          </div>

          {/* Admin Response */}
          {message.adminResponse && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Your Response</h4>
              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                <p className="text-sm text-green-800 whitespace-pre-wrap">{message.adminResponse}</p>
                {message.respondedAt && (
                  <p className="text-xs text-green-600 mt-2">
                    Sent on {formatDate(message.respondedAt)}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="border-t border-gray-200 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <span className="text-gray-600">Received: {formatDate(message.createdAt)}</span>
            </div>
            {message.readAt && (
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-blue-500" />
                <span className="text-blue-600">Read: {formatDate(message.readAt)}</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          {message.status !== 'replied' && onReply && (
            <div className="mt-6">
              <button
                onClick={() => {
                  onClose();
                  onReply(message);
                }}
                className="w-full bg-[#ff444f] text-white py-3 rounded-lg hover:bg-[#d43b44] transition-colors font-semibold"
              >
                Reply to this Message
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ContactDetailsModal;