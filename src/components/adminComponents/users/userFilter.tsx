import { Search, Filter, Users } from 'lucide-react';

interface UserFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  onRoleChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

const UserFilters = ({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleChange,
  statusFilter,
  onStatusChange
}: UserFiltersProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent outline-none"
          />
        </div>
        
        {/* Role Filter */}
        <div className="flex items-center gap-2 min-w-[140px]">
          <Users size={18} className="text-gray-400" />
          <select
            value={roleFilter}
            onChange={(e) => onRoleChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent outline-none"
          >
            <option value="all">All Roles</option>
            <option value="user">Investors</option>
            <option value="bossy">Admins</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 min-w-[140px]">
          <Filter size={18} className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent outline-none"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default UserFilters;