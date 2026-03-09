import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  User, 
  Mail, 
  Tag, 
  Calendar, 
  Clock, 
  Reply, 
  CheckCircle, 
  Eye,
  AlertCircle
} from 'lucide-react';
import StatusBadge from '../../common/StatusBadge';

export interface Ticket {
  id: string;
  ticketNumber: string;
  user?: {
    fullName: string;
    email: string;
  } | null;
  guestName?: string | null;
  guestEmail?: string | null;
  guestPhone?: string | null;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string | null;
  investmentReference?: string | null;
  adminResponse?: string | null;
}

interface TicketCardProps {
  ticket: Ticket;
  onRespond: (ticket: Ticket) => void;
  onResolve: (ticket: Ticket) => void;
  onView: (ticket: Ticket) => void;
  onClose?: (ticket: Ticket) => void;
}

const TicketCard = ({ ticket, onRespond, onResolve, onView, onClose }: TicketCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-gray-600 bg-gray-100';
      case 'medium': return 'text-blue-600 bg-blue-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'urgent': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'low': return <AlertCircle size={14} />;
      case 'medium': return <Clock size={14} />;
      case 'high': return <AlertCircle size={14} />;
      case 'urgent': return <AlertCircle size={14} className="text-red-600" />;
      default: return <Tag size={14} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-KE', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const displayName = ticket.user?.fullName || ticket.guestName || 'Unknown User';
  const displayEmail = ticket.user?.email || ticket.guestEmail || 'No email';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
    >
      {/* Ticket Header */}
      <div className="p-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#ff444f]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-[#ff444f]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-gray-900">{ticket.ticketNumber}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getPriorityColor(ticket.priority)}`}>
                  {getPriorityIcon(ticket.priority)}
                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                </span>
                <StatusBadge status={ticket.status} />
              </div>
              <p className="text-sm text-gray-600 truncate max-w-md">{ticket.subject}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-13 sm:ml-0">
            <button
              onClick={() => onRespond(ticket)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Respond"
            >
              <Reply size={18} />
            </button>
            {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
              <button
                onClick={() => onResolve(ticket)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Mark as Resolved"
              >
                <CheckCircle size={18} />
              </button>
            )}
            {ticket.status === 'resolved' && onClose && (
              <button
                onClick={() => onClose(ticket)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Close Ticket"
              >
                <CheckCircle size={18} />
              </button>
            )}
            <button
              onClick={() => onView(ticket)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Ticket Content */}
      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* User Info */}
          <div className="lg:col-span-1 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User size={14} className="text-gray-400 flex-shrink-0" />
              <span className="text-gray-700 truncate">{displayName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail size={14} className="text-gray-400 flex-shrink-0" />
              <span className="text-gray-600 truncate">{displayEmail}</span>
            </div>
            {ticket.investmentReference && (
              <div className="flex items-center gap-2 text-sm">
                <Tag size={14} className="text-gray-400 flex-shrink-0" />
                <span className="text-gray-600 font-mono text-xs truncate">{ticket.investmentReference}</span>
              </div>
            )}
          </div>

          {/* Message Preview */}
          <div className="lg:col-span-2">
            <p className="text-sm text-gray-700 line-clamp-2">{ticket.message}</p>
            {ticket.adminResponse && (
              <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                <p className="text-xs font-medium text-blue-700">Admin Response:</p>
                <p className="text-xs text-blue-600 line-clamp-1">{ticket.adminResponse}</p>
              </div>
            )}
          </div>

          {/* Timestamps */}
          <div className="lg:col-span-1 space-y-1 text-right">
            <div className="flex items-center justify-end gap-2 text-xs text-gray-500">
              <Calendar size={12} />
              <span>Created: {formatDate(ticket.createdAt)}</span>
            </div>
            {ticket.resolvedAt && (
              <div className="flex items-center justify-end gap-2 text-xs text-green-600">
                <CheckCircle size={12} />
                <span>Resolved: {formatDate(ticket.resolvedAt)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TicketCard;