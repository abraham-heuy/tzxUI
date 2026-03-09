import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users as UsersIcon, 
  RefreshCw,
  TrendingUp,
  MessageCircle,
  DollarSign,
  UserCheck,
  UserX,
  UserPlus
} from 'lucide-react';
import { userService, type User, type UserStats } from '../../services/users';
import UserFilters from '../../components/adminComponents/users/userFilter';
import UserCard from '../../components/adminComponents/users/userCard';
import UserDetailsModal from '../../components/adminComponents/users/userDetailsModal';
import DeleteUserModal from '../../components/adminComponents/users/deleteUserModal';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Modals
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserDetails, setSelectedUserDetails] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [currentPage, roleFilter, statusFilter]);

  useEffect(() => {
    if (!users.length) return;

    const filtered = users.filter(user => {
      const matchesSearch = 
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm);
      
      return matchesSearch;
    });

    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await userService.getUsers({
        page: currentPage,
        limit: itemsPerPage,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        sortBy: 'createdAt',
        sortOrder: 'DESC'
      });

      setUsers(response.data);
      setFilteredUsers(response.data);
      setTotalPages(response.pagination.pages);
      setTotalItems(response.pagination.total);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await userService.getUserStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch user stats:', err);
    }
  };

  const handleViewUser = async (user: User) => {
    try {
      setActionLoading(true);
      const response = await userService.getUserDetails(user.id);
      setSelectedUserDetails(response.data);
      setSelectedUser(user);
      setShowDetailsModal(true);
    } catch (err) {
      console.error('Failed to fetch user details:', err);
      alert('Failed to load user details');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveUser = async (userId: string, adminNotes?: string) => {
    try {
      setActionLoading(true);
      await userService.approveUser(userId, adminNotes);
      await fetchUsers();
      await fetchStats();
    } catch (err) {
      console.error('Failed to approve user:', err);
      throw err; // Re-throw to show error in modal
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setActionLoading(true);
      await userService.deleteUser(userId);
      await fetchUsers();
      await fetchStats();
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert('Failed to delete user');
    } finally {
      setActionLoading(false);
    }
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#ff444f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading users...</p>
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
            User <span className="text-[#ff444f]">Management</span>
          </h1>
          <p className="text-gray-600 mt-1">View and manage platform users</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              fetchUsers();
              fetchStats();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <UsersIcon size={18} className="text-[#ff444f]" />
              <span className="text-sm text-gray-600">Total Users</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.overview.totalUsers}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck size={18} className="text-green-600" />
              <span className="text-sm text-gray-600">Approved</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.overview.approvedUsers}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <UserX size={18} className="text-amber-600" />
              <span className="text-sm text-gray-600">Pending</span>
            </div>
            <p className="text-2xl font-bold text-amber-600">{stats.overview.pendingUsers}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <UserPlus size={18} className="text-blue-600" />
              <span className="text-sm text-gray-600">New this month</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{stats.overview.newThisMonth}</p>
          </div>
        </div>
      )}

      {/* Engagement Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-4 border border-green-100">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign size={18} className="text-green-600" />
              <span className="text-sm font-medium text-gray-600">Total Invested</span>
            </div>
            <p className="text-xl font-bold text-gray-900">KES {stats.engagement.totalInvestedAmount.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={18} className="text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Active Investors</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{stats.engagement.usersWithInvestments}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-4 border border-purple-100">
            <div className="flex items-center gap-2 mb-1">
              <MessageCircle size={18} className="text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Users with Tickets</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{stats.engagement.usersWithTickets}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchUsers}
            className="mt-2 text-sm text-[#ff444f] hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Filters */}
      <UserFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        roleFilter={roleFilter}
        onRoleChange={setRoleFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onView={handleViewUser}
            onDelete={openDeleteModal}
            onApprove={handleApproveUser}
            isApproving={actionLoading}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && !isLoading && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <UsersIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500">No users match your current filters.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl shadow-lg p-4 border border-gray-100">
          <p className="text-sm text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} users
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
      <UserDetailsModal
        isOpen={showDetailsModal}
        user={selectedUserDetails}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedUser(null);
          setSelectedUserDetails(null);
        }}
      />

      <DeleteUserModal
        isOpen={showDeleteModal}
        user={selectedUser}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDeleteUser}
        isLoading={actionLoading}
      />
    </motion.div>
  );
};

export default Users;