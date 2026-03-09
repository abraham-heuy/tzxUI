import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  RefreshCw,
  CheckCircle} from 'lucide-react';
import { contactService, type ContactMessage } from '../../services/contactService';
import ContactCard from '../../components/adminComponents/contact/contactCard';
import ContactFilters from '../../components/adminComponents/contact/contactFilters';
import ContactReplyModal from '../../components/adminComponents/contact/contactReplyModal';
import ContactDetailsModal from '../../components/adminComponents/contact/contactDetailsModal';


const ContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    read: 0,
    replied: 0,
    archived: 0
  });

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Modals
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, [currentPage, statusFilter]);

  useEffect(() => {
    if (!messages.length) return;

    const filtered = messages.filter(msg => {
      const matchesSearch = 
        msg.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.messageReference.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });

    setFilteredMessages(filtered);
  }, [searchTerm, messages]);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await contactService.getMessages({
        page: currentPage,
        limit: itemsPerPage,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        sortBy: 'createdAt',
        sortOrder: 'DESC'
      });

      setMessages(response.data);
      setFilteredMessages(response.data);
      setTotalPages(response.pagination.pages);
      setTotalItems(response.pagination.total);
    } catch (err) {
      console.error('Failed to fetch contact messages:', err);
      setError('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await contactService.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch contact stats:', err);
    }
  };

  const handleReply = async (messageId: string, response: string) => {
    try {
      setActionLoading(true);
      await contactService.replyToMessage(messageId, response);
      await fetchMessages();
      await fetchStats();
      setShowReplyModal(false);
      setSelectedMessage(null);
    } catch (err) {
      console.error('Failed to send reply:', err);
      alert('Failed to send reply. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAsRead = async (message: ContactMessage) => {
    try {
      await contactService.markAsRead(message.id);
      await fetchMessages();
      await fetchStats();
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleArchive = async (message: ContactMessage) => {
    if (!confirm(`Archive message from ${message.fullName}?`)) return;
    
    try {
      await contactService.archiveMessage(message.id);
      await fetchMessages();
      await fetchStats();
    } catch (err) {
      console.error('Failed to archive message:', err);
    }
  };

  const handleDelete = async (message: ContactMessage) => {
    if (!confirm(`Permanently delete message from ${message.fullName}? This action cannot be undone.`)) return;
    
    try {
      await contactService.deleteMessage(message.id);
      await fetchMessages();
      await fetchStats();
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  const openReplyModal = (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowReplyModal(true);
  };

  const openDetailsModal = (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowDetailsModal(true);
  };

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#ff444f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Contact <span className="text-[#ff444f]">Messages</span>
          </h1>
          <p className="text-gray-600 mt-1">Manage and respond to user inquiries</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              fetchMessages();
              fetchStats();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} className="text-gray-600" />
          </button>
          <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
            <Mail size={14} />
            <span>{stats.unread} Unread</span>
          </div>
          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
            <CheckCircle size={14} />
            <span>{stats.replied} Replied</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Unread</p>
          <p className="text-2xl font-bold text-blue-600">{stats.unread}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Replied</p>
          <p className="text-2xl font-bold text-green-600">{stats.replied}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Archived</p>
          <p className="text-2xl font-bold text-amber-600">{stats.archived}</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchMessages}
            className="mt-2 text-sm text-[#ff444f] hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Filters */}
      <ContactFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <ContactCard
            key={message.id}
            message={message}
            onReply={openReplyModal}
            onView={openDetailsModal}
            onArchive={handleArchive}
            onDelete={handleDelete}
            onMarkRead={handleMarkAsRead}
          />
        ))}

        {/* Empty State */}
        {filteredMessages.length === 0 && !isLoading && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
            <p className="text-gray-500">No contact messages match your current filters.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl shadow-lg p-4 border border-gray-100">
          <p className="text-sm text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} messages
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <ContactReplyModal
        isOpen={showReplyModal}
        message={selectedMessage}
        onClose={() => {
          setShowReplyModal(false);
          setSelectedMessage(null);
        }}
        onSubmit={handleReply}
        isLoading={actionLoading}
      />

      <ContactDetailsModal
        isOpen={showDetailsModal}
        message={selectedMessage}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedMessage(null);
        }}
        onReply={openReplyModal}
      />
    </motion.div>
  );
};

export default ContactMessages;