import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import type { User } from '../../../services/users';

interface DeleteUserModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: (userId: string) => Promise<void>;
  isLoading?: boolean;
}

const DeleteUserModal = ({ isOpen, user, onClose, onConfirm, isLoading }: DeleteUserModalProps) => {
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !user) return null;

  const handleDelete = async () => {
    if (confirmText !== user.fullName) {
      setError(`Please type "${user.fullName}" to confirm deletion`);
      return;
    }

    setError('');
    await onConfirm(user.id);
    setConfirmText('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl max-w-md w-full"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Delete User</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-700 mb-2">
              You are about to delete <span className="font-bold">{user.fullName}</span>. 
              This action will permanently remove:
            </p>
            <ul className="text-xs text-red-600 list-disc list-inside space-y-1">
              <li>The user account</li>
              <li>All investment records for this user</li>
              <li>All support tickets created by this user</li>
            </ul>
          </div>

          {/* Confirmation Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type the user's full name to confirm: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => {
                setConfirmText(e.target.value);
                setError('');
              }}
              placeholder={user.fullName}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent outline-none ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {error && (
              <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
          </div>

          {/* User Info Preview */}
          <div className="bg-gray-50 rounded-lg p-3 mb-6">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-900">{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm mt-1">
              <span className="text-gray-600">Role:</span>
              <span className="font-medium text-gray-900 capitalize">{user.role.name}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading || confirmText !== user.fullName}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  Delete User
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteUserModal;