import { motion } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Clock, 
  MessageCircle,
  Tag,
  CheckCircle} from 'lucide-react';
import StatusBadge from '../../common/StatusBadge';

interface TicketDetails {
  id: string;
  ticketNumber: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
  adminResponse?: string;
  investmentReference?: string;
}

interface TicketDetailsModalProps {
  isOpen: boolean;
  ticket: TicketDetails | null;
  onClose: () => void;
}

const TicketDetailsModal = ({ isOpen, ticket, onClose }: TicketDetailsModalProps) => {
  if (!isOpen || !ticket) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-KE', {
      dateStyle: 'full',
      timeStyle: 'short'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-gray-600 bg-gray-100';
      case 'medium': return 'text-blue-600 bg-blue-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'urgent': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#ff444f]/10 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-[#ff444f]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{ticket.ticketNumber}</h2>
                <p className="text-sm text-gray-600">{ticket.subject}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <StatusBadge status={ticket.status} />
            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getPriorityColor(ticket.priority)}`}>
              <Tag size={12} />
              Priority: {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
            </span>
          </div>

          {/* Message */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-2">Message</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{ticket.message}</p>
            </div>
          </div>

          {/* Admin Response */}
          {ticket.adminResponse && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Admin Response</h3>
              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                <p className="text-sm text-green-800 whitespace-pre-wrap">{ticket.adminResponse}</p>
              </div>
            </div>
          )}

          {/* Investment Reference */}
          {ticket.investmentReference && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Related Investment</h3>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm font-mono text-blue-700">{ticket.investmentReference}</p>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="border-t border-gray-200 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <span className="text-gray-600">Created: {formatDate(ticket.createdAt)}</span>
            </div>
            {ticket.resolvedAt && (
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-green-600">Resolved: {formatDate(ticket.resolvedAt)}</span>
              </div>
            )}
            {ticket.updatedAt && ticket.updatedAt !== ticket.createdAt && (
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-400" />
                <span className="text-gray-600">Updated: {formatDate(ticket.updatedAt)}</span>
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TicketDetailsModal;