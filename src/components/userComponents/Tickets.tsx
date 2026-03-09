import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Plus, RefreshCw, AlertCircle, Eye } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import { userService, type Ticket } from '../../services/user';
import CreateTicketModal from './resuableComponents.tsx/createTicketModal';
import TicketDetailsModal from './resuableComponents.tsx/TicketDetailsModal';

const UserTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTickets();
  }, [currentPage, statusFilter]);

  useEffect(() => {
    if (!tickets.length) return;

    const filtered = tickets.filter(ticket => 
      ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.investmentReference?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    );

    setFilteredTickets(filtered);
  }, [searchTerm, tickets]);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await userService.getMyTickets({
        page: currentPage,
        limit: itemsPerPage,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        sortBy: 'createdAt',
        sortOrder: 'DESC'
      });

      setTickets(response.data);
      setFilteredTickets(response.data);
      setTotalPages(response.pagination.pages);
      setTotalItems(response.pagination.total);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      setError('Failed to load tickets. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTicket = async (data: { subject: string; message: string; priority?: string }) => {
    try {
      setActionLoading(true);
      await userService.createUserTicket({
        subject: data.subject,
        message: data.message,
        priority: data.priority as any
      });
      await fetchTickets();
      setShowNewTicket(false);
    } catch (error) {
      console.error('Failed to create ticket:', error);
      alert('Failed to create ticket. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewDetails = async (ticket: Ticket) => {
    try {
      setActionLoading(true);
      const response = await userService.getMyTicketDetails(ticket.id);
      setSelectedTicket(response.data);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Failed to fetch ticket details:', error);
      alert('Failed to load ticket details. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading && tickets.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#ff444f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Support <span className="text-[#ff444f]">Tickets</span>
          </h1>
          <p className="text-gray-600 mt-1">View and manage your support requests</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchTickets}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} className="text-gray-600" />
          </button>
          <button
            onClick={() => setShowNewTicket(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#ff444f] text-white rounded-lg hover:bg-[#d43b44] transition-colors"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">New Ticket</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by ticket number or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent outline-none"
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center gap-2 min-w-[140px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent outline-none"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchTickets}
            className="mt-2 text-sm text-[#ff444f] hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <div 
              key={ticket.id} 
              className="bg-white rounded-xl shadow-lg p-4 border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => handleViewDetails(ticket)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#ff444f]/10 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-[#ff444f]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{ticket.ticketNumber}</h3>
                    <p className="text-sm text-gray-600">{ticket.subject}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={ticket.status} />
                  <Eye size={16} className="text-gray-400" />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <span>Created: {formatDate(ticket.createdAt)}</span>
                {ticket.priority && (
                  <span className={`px-2 py-0.5 rounded-full ${
                    ticket.priority === 'high' || ticket.priority === 'urgent' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {ticket.priority}
                  </span>
                )}
                {ticket.adminResponse && (
                  <span className="text-green-600">• Admin responded</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-500 mb-4">You haven't created any support tickets yet.</p>
            <button
              onClick={() => setShowNewTicket(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff444f] text-white rounded-lg hover:bg-[#d43b44] transition-colors"
            >
              <Plus size={18} />
              Create Your First Ticket
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl shadow-lg p-4 border border-gray-100">
          <p className="text-sm text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} tickets
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

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={showNewTicket}
        onClose={() => setShowNewTicket(false)}
        onSubmit={handleCreateTicket}
        isLoading={actionLoading}
      />

      {/* Ticket Details Modal */}
      <TicketDetailsModal
        isOpen={showDetailsModal}
        ticket={selectedTicket}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedTicket(null);
        }}
      />
    </motion.div>
  );
};

export default UserTickets;