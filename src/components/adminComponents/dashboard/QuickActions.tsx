import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  MessageCircle, 
  Download, 
  Filter,
  Users,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ActionChipProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  color?: string;
}

const ActionChip = ({ icon: Icon, label, onClick, color = 'bg-gray-100' }: ActionChipProps) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 ${color} rounded-full text-sm font-medium hover:shadow-md transition-all`}
  >
    <Icon size={16} />
    <span>{label}</span>
  </motion.button>
);

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: CheckCircle,
      label: 'Approve Pending',
      onClick: () => navigate('/admin/transactions?filter=pending'),
      color: 'bg-green-100 text-green-700 hover:bg-green-200'
    },
    {
      icon: MessageCircle,
      label: 'Respond to Tickets',
      onClick: () => navigate('/admin/tickets?filter=open'),
      color: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
    },
    {
      icon: Users,
      label: 'New Investors',
      onClick: () => navigate('/admin/users?filter=new'),
      color: 'bg-purple-100 text-purple-700 hover:bg-purple-200'
    },
    {
      icon: FileText,
      label: 'Generate Report',
      onClick: () => console.log('Generate report'),
      color: 'bg-amber-100 text-amber-700 hover:bg-amber-200'
    },
    {
      icon: Download,
      label: 'Export Data',
      onClick: () => console.log('Export data'),
      color: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    },
    {
      icon: Filter,
      label: 'Advanced Filters',
      onClick: () => alert('Navigate to respective pages to experience the cool filters.'),
      color: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="flex flex-wrap gap-2">
        {actions.map((action, index) => (
          <ActionChip
            key={index}
            icon={action.icon}
            label={action.label}
            onClick={action.onClick}
            color={action.color}
          />
        ))}
      </div>
    </div>
  );
};

export default QuickActions;