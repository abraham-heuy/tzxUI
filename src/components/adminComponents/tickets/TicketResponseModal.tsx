import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, Send } from 'lucide-react';
import type { Ticket } from './TicketCard';

interface ResponseModalProps {
  isOpen: boolean;
  ticket: Ticket | null;
  onClose: () => void;
  onSubmit: (ticketId: string, response: string) => Promise<void>;
  isLoading?: boolean;
}

const ResponseModal = ({ isOpen, ticket, onClose, onSubmit, isLoading }: ResponseModalProps) => {
  const [responseText, setResponseText] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !ticket) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-KE', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const displayName = ticket.user?.fullName || ticket.guestName || 'Unknown User';

  const handleSubmit = async () => {
    if (!responseText.trim()) {
      setError('Response message is required');
      return;
    }

    setError('');
    await onSubmit(ticket.id, responseText);
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
              Respond to Ticket {ticket.ticketNumber}
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
              <span className="text-sm font-medium text-gray-700">{displayName}</span>
              <span className="text-xs text-gray-500">{formatDate(ticket.createdAt)}</span>
            </div>
            <p className="text-sm text-gray-700">{ticket.message}</p>
            {ticket.investmentReference && (
              <p className="text-xs text-gray-500 mt-2">
                Ref: {ticket.investmentReference}
              </p>
            )}
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
              placeholder="Type your response here..."
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
                  Send Response
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResponseModal;