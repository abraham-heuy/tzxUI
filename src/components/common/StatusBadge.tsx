interface StatusBadgeProps {
    status: 'pending' | 'approved' | 'rejected' | 'resolved' | 'open' | 'in_progress' | 'closed';
  }
  
  const StatusBadge = ({ status }: StatusBadgeProps) => {
    const getStatusConfig = () => {
      switch (status) {
        case 'pending':
        case 'open':
          return {
            bg: 'bg-yellow-100',
            text: 'text-yellow-700',
            label: status === 'open' ? 'Open' : 'Pending'
          };
        case 'approved':
        case 'resolved':
          return {
            bg: 'bg-green-100',
            text: 'text-green-700',
            label: status === 'approved' ? 'Approved' : 'Resolved'
          };
        case 'rejected':
          return {
            bg: 'bg-red-100',
            text: 'text-red-700',
            label: 'Rejected'
          };
        case 'in_progress':
          return {
            bg: 'bg-blue-100',
            text: 'text-blue-700',
            label: 'In Progress'
          };
        case 'closed':
          return {
            bg: 'bg-gray-100',
            text: 'text-gray-700',
            label: 'Closed'
          };
        default:
          return {
            bg: 'bg-gray-100',
            text: 'text-gray-700',
            label: status
          };
      }
    };
  
    const config = getStatusConfig();
  
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };
  
  export default StatusBadge;