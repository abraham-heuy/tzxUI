import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, Mail, Send, AlertCircle } from 'lucide-react';
import type { ContactMessage } from './contactCard';

interface ContactReplyModalProps {
  isOpen: boolean;
  message: ContactMessage | null;
  onClose: () => void;
  onSubmit: (messageId: string, response: string) => Promise<void>;
  isLoading?: boolean;
}

const ContactReplyModal = ({ isOpen, message, onClose, onSubmit, isLoading }: ContactReplyModalProps) => {
  const [responseText, setResponseText] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !message) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-KE', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const handleSubmit = async () => {
    if (!responseText.trim()) {
      setError('Response message is required');
      return;
    }

    setError('');
    await onSubmit(message.id, responseText);
    setResponseText('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              Reply to {message.fullName}
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
          
          {/* Original Message */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex items-center gap-2 mb-2">
              <User size={14} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{message.fullName}</span>
              <span className="text-xs text-gray-500">{formatDate(message.createdAt)}</span>
            </div>
            <p className="text-sm text-gray-700 mb-2">{message.message}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Mail size={12} />
              <a href={`mailto:${message.email}`} className="hover:text-[#ff444f]">
                {message.email}
              </a>
              {message.phone && (
                <>
                  <span>•</span>
                  <a href={`tel:${message.phone}`} className="hover:text-[#ff444f]">
                    {message.phone}
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Email Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700">
              Your response will be sent via email to <strong>{message.email}</strong>. 
              The user will receive this reply in their inbox.
            </p>
          </div>

          {/* Response Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Response <span className="text-red-500">*</span>
            </label>
            <textarea
              value={responseText}
              onChange={(e) => {
                setResponseText(e.target.value);
                setError('');
              }}
              rows={5}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent outline-none resize-none ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Type your response here... This will be sent as an email to the user."
              disabled={isLoading}
            />
            {error && (
              <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !responseText.trim()}
              className="flex-1 px-4 py-2 bg-[#ff444f] text-white rounded-lg hover:bg-[#d43b44] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send Reply
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactReplyModal;