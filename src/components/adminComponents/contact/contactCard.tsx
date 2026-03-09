import { motion } from 'framer-motion';
import { 
  Mail, 
  User, 
  Phone, 
  Calendar, 
  Reply, 
  Eye, 
  Archive,
  Trash2,
  CheckCircle} from 'lucide-react';

export interface ContactMessage {
  id: string;
  messageReference: string;
  fullName: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  adminResponse: string | null;
  createdAt: string;
  readAt: string | null;
  respondedAt: string | null;
}

interface ContactCardProps {
  message: ContactMessage;
  onReply: (message: ContactMessage) => void;
  onView: (message: ContactMessage) => void;
  onArchive: (message: ContactMessage) => void;
  onDelete: (message: ContactMessage) => void;
  onMarkRead?: (message: ContactMessage) => void;
}

const ContactCard = ({ 
  message, 
  onReply, 
  onView, 
  onArchive, 
  onDelete,
  onMarkRead 
}: ContactCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-KE', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-blue-100 text-blue-700';
      case 'read': return 'bg-gray-100 text-gray-700';
      case 'replied': return 'bg-green-100 text-green-700';
      case 'archived': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden ${
        message.status === 'unread' ? 'ring-2 ring-blue-200' : ''
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              message.status === 'unread' ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <Mail className={`w-5 h-5 ${
                message.status === 'unread' ? 'text-blue-600' : 'text-gray-600'
              }`} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-gray-900">{message.messageReference}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                  {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                </span>
              </div>
              <p className="text-sm text-gray-600 truncate max-w-md">{message.subject}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-13 sm:ml-0">
            {message.status !== 'replied' && message.status !== 'archived' && (
              <button
                onClick={() => onReply(message)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Reply"
              >
                <Reply size={18} />
              </button>
            )}
            {message.status === 'unread' && onMarkRead && (
              <button
                onClick={() => onMarkRead(message)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Mark as Read"
              >
                <CheckCircle size={18} />
              </button>
            )}
            <button
              onClick={() => onView(message)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye size={18} />
            </button>
            {message.status !== 'archived' && (
              <button
                onClick={() => onArchive(message)}
                className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                title="Archive"
              >
                <Archive size={18} />
              </button>
            )}
            <button
              onClick={() => onDelete(message)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* User Info */}
          <div className="lg:col-span-1 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User size={14} className="text-gray-400 flex-shrink-0" />
              <span className="text-gray-700 truncate">{message.fullName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail size={14} className="text-gray-400 flex-shrink-0" />
              <a href={`mailto:${message.email}`} className="text-gray-600 truncate hover:text-[#ff444f]">
                {message.email}
              </a>
            </div>
            {message.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone size={14} className="text-gray-400 flex-shrink-0" />
                <a href={`tel:${message.phone}`} className="text-gray-600 truncate hover:text-[#ff444f]">
                  {message.phone}
                </a>
              </div>
            )}
          </div>

          {/* Message Preview */}
          <div className="lg:col-span-2">
            <p className="text-sm text-gray-700 line-clamp-2">{message.message}</p>
            {message.adminResponse && (
              <div className="mt-2 p-2 bg-green-50 rounded-lg">
                <p className="text-xs font-medium text-green-700">Your Response:</p>
                <p className="text-xs text-green-600 line-clamp-1">{message.adminResponse}</p>
              </div>
            )}
          </div>

          {/* Timestamps */}
          <div className="lg:col-span-1 space-y-1 text-right">
            <div className="flex items-center justify-end gap-2 text-xs text-gray-500">
              <Calendar size={12} />
              <span>{formatDate(message.createdAt)}</span>
            </div>
            {message.respondedAt && (
              <div className="flex items-center justify-end gap-2 text-xs text-green-600">
                <CheckCircle size={12} />
                <span>Replied: {formatDate(message.respondedAt)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactCard;