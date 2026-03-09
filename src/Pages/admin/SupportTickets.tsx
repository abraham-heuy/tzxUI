import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  CheckCircle, 
  Clock,
  RefreshCw
} from 'lucide-react';
import { adminService } from '../../services/admin';
import TicketCard, { type Ticket } from '../../components/adminComponents/tickets/TicketCard';

import TicketDetailsModal from '../../components/adminComponents/tickets/TicketDetailsModal';
import TicketFilters from '../../components/adminComponents/tickets/TicketsFilters';
import ResponseModal from '../../components/adminComponents/tickets/TicketResponseModal';

const SupportTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Modals
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, [currentPage, statusFilter, priorityFilter]);

  useEffect(() => {
    if (!tickets.length) return;

    const filtered = tickets.filter(ticket => {
      const displayName = ticket.user?.fullName || ticket.guestName || '';
      const displayEmail = ticket.user?.email || ticket.guestEmail || '';
      
      const matchesSearch = 
        displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        displayEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.investmentReference?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      
      return matchesSearch;
    });

    setFilteredTickets(filtered);
  }, [searchTerm, tickets]);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await adminService.getTickets({
        page: currentPage,
        limit: itemsPerPage,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined,
        sortBy: 'createdAt',
        sortOrder: 'DESC'
      });

      setTickets(response.data);
      setFilteredTickets(response.data);
      setTotalPages(response.pagination.pages);
      setTotalItems(response.pagination.total);
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
      setError('Failed to load support tickets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRespond = async (ticketId: string, response: string) => {
    try {
      setActionLoading(true);
      await adminService.respondToTicket(ticketId, response);
      await fetchTickets(); // Refresh the list
      setShowResponseModal(false);
      setSelectedTicket(null);
    } catch (err) {
      console.error('Failed to respond to ticket:', err);
      alert('Failed to send response. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolve = async (ticket: Ticket) => {
    if (!confirm(`Mark ticket ${ticket.ticketNumber} as resolved?`)) return;
    
    try {
      setActionLoading(true);
      await adminService.resolveTicket(ticket.id);
      await fetchTickets();
    } catch (err) {
      console.error('Failed to resolve ticket:', err);
      alert('Failed to resolve ticket. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClose = async (ticket: Ticket) => {
    if (!confirm(`Close ticket ${ticket.ticketNumber}?`)) return;
    
    try {
      setActionLoading(true);
      await adminService.closeTicket(ticket.id);
      await fetchTickets();
    } catch (err) {
      console.error('Failed to close ticket:', err);
      alert('Failed to close ticket. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const openRespondModal = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowResponseModal(true);
  };

  const openDetailsModal = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowDetailsModal(true);
  };

  const stats = {
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    total: tickets.length
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
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Support <span className="text-[#ff444f]">Tickets</span>
          </h1>
          <p className="text-gray-600 mt-1">Manage and respond to user support requests</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchTickets}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} className="text-gray-600" />
          </button>
          <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
            <Clock size={14} />
            <span>{stats.open + stats.inProgress} Active</span>
          </div>
          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
            <CheckCircle size={14} />
            <span>{stats.resolved} Resolved</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchTickets}
            className="mt-2 text-sm text-[#ff444f] hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Filters */}
      <TicketFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
      />

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onRespond={openRespondModal}
            onResolve={handleResolve}
            onView={openDetailsModal}
            onClose={ticket.status === 'resolved' ? handleClose : undefined}
          />
        ))}

        {/* Empty State */}
        {filteredTickets.length === 0 && !isLoading && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-500">No support tickets match your current filters.</p>
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

      {/* Modals */}
      <ResponseModal
        isOpen={showResponseModal}
        ticket={selectedTicket}
        onClose={() => {
          setShowResponseModal(false);
          setSelectedTicket(null);
        }}
        onSubmit={handleRespond}
        isLoading={actionLoading}
      />

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

export default SupportTickets;