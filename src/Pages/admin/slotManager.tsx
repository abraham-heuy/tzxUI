// src/components/admin/PoolSlotManager.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  RefreshCw, 
  Layers, 
  AlertCircle, 
  TrendingUp,
  Users,
  Crown,
  Shield,
  X,
  Save,
  Edit
} from 'lucide-react';
import { usePoolSlots } from '../../hooks/usePoolSlots';
import { refreshPools } from '../../data/pool';

const poolIcons: Record<string, any> = {
  'Starter Pool': Shield,
  'Basic Pool': Shield,
  'Growth Pool': Crown,
  'Premium Pool': TrendingUp,
  'Elite Pool': Users
};

const poolColors: Record<string, string> = {
  'Starter Pool': 'green',
  'Basic Pool': 'teal',
  'Growth Pool': 'blue',
  'Premium Pool': 'purple',
  'Elite Pool': 'amber'
};

const PoolSlotManager: React.FC = () => {
  const { pools, loading, error, createPool, addSlots, editSlots, resetSlots, fetchPools } = usePoolSlots();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddSlotsModal, setShowAddSlotsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    poolName: '',
    totalSlots: 0,
    targetAmount: 0,
    additionalSlots: 0,
    editTotalSlots: 0
  });
  const [submitting, setSubmitting] = useState(false);

  // Refresh all pool data including frontend cache
  const refreshAllData = async () => {
    await fetchPools();
    await refreshPools(); // Refresh the data pool cache
  };

  const handleCreatePool = async () => {
    if (!formData.poolName || formData.totalSlots <= 0) {
      alert('Please fill all fields');
      return;
    }
    
    setSubmitting(true);
    try {
      await createPool({
        poolName: formData.poolName,
        totalSlots: formData.totalSlots,
        targetAmount: formData.targetAmount || 0
      });
      await refreshAllData();
      setShowCreateModal(false);
      setFormData({ poolName: '', totalSlots: 0, targetAmount: 0, additionalSlots: 0, editTotalSlots: 0 });
    } catch (err) {
      console.error('Failed to create pool:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddSlots = async () => {
    if (!selectedPool || formData.additionalSlots <= 0) {
      alert('Please enter valid number of slots');
      return;
    }
    
    setSubmitting(true);
    try {
      await addSlots({
        poolName: selectedPool,
        additionalSlots: formData.additionalSlots
      });
      await refreshAllData();
      setShowAddSlotsModal(false);
      setSelectedPool(null);
      setFormData({ ...formData, additionalSlots: 0 });
    } catch (err) {
      console.error('Failed to add slots:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSlots = async () => {
    if (!selectedPool || formData.editTotalSlots < 0) {
      alert('Please enter valid number of total slots');
      return;
    }
    
    setSubmitting(true);
    try {
      await editSlots({
        poolName: selectedPool,
        totalSlots: formData.editTotalSlots
      });
      await refreshAllData();
      setShowEditModal(false);
      setSelectedPool(null);
      setFormData({ ...formData, editTotalSlots: 0 });
    } catch (err) {
      console.error('Failed to edit slots:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetSlots = async (poolName: string) => {
    if (confirm(`Reset slots for ${poolName}? This will restore all slots to the original total.`)) {
      setSubmitting(true);
      try {
        await resetSlots(poolName);
        await refreshAllData();
      } catch (err) {
        console.error('Failed to reset slots:', err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const openEditModal = (pool: any) => {
    const currentTotal = typeof pool.totalSlots === 'number' ? pool.totalSlots : 0;
    setSelectedPool(pool.poolName);
    setFormData({ ...formData, editTotalSlots: currentTotal });
    setShowEditModal(true);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'bg-red-500';
    if (progress >= 70) return 'bg-orange-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pool Slot Manager</h1>
            <p className="text-gray-600 mt-1">Manage investment pool slots and availability</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={refreshAllData}
              disabled={submitting}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw size={18} className={submitting ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-[#ff444f] text-white rounded-lg hover:bg-[#d43b44] transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Create New Pool
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !pools.length ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff444f]"></div>
          </div>
        ) : (
          /* Pools Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pools.map((pool, index) => {
              const Icon = poolIcons[pool.poolName] || Layers;
              const color = poolColors[pool.poolName] || 'gray';
              const isUnlimited = pool.totalSlots === 'Unlimited';
              const progress = typeof pool.progress === 'number' ? pool.progress : 0;
              
              return (
                <motion.div
                  key={pool.poolName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
                >
                  <div className={`h-2 bg-gradient-to-r from-${color}-500 to-${color}-600`} />
                  
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Icon className={`w-6 h-6 text-${color}-500`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{pool.poolName}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          pool.status === 'active' ? 'bg-green-100 text-green-800' :
                          pool.status === 'full' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {pool.status === 'active' ? 'Active' : pool.status === 'full' ? 'Full' : pool.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      {!isUnlimited ? (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Total Slots</span>
                            <span className="font-semibold text-gray-900">{pool.totalSlots}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Slots Available</span>
                            <span className="font-semibold text-gray-900">
                              {pool.availableSlots}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`${getProgressColor(progress)} h-2 rounded-full transition-all duration-500`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Filled</span>
                            <span className="font-semibold text-gray-900">{pool.filledCount}</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-3">
                          <span className="text-green-600 font-semibold">Unlimited Slots</span>
                        </div>
                      )}
                      
                      {pool.targetAmount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Target Amount</span>
                          <span className="font-semibold text-gray-900">${pool.targetAmount.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {!isUnlimited && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedPool(pool.poolName);
                            setShowAddSlotsModal(true);
                          }}
                          className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                        >
                          Add Slots
                        </button>
                        <button
                          onClick={() => openEditModal(pool)}
                          className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                          title="Edit total slots"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleResetSlots(pool.poolName)}
                          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          title="Reset slots"
                        >
                          <RefreshCw size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* No Pools State */}
        {!loading && pools.length === 0 && (
          <div className="text-center py-16">
            <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Pools Created Yet</h3>
            <p className="text-gray-500 mb-4">Create your first investment pool to start managing slots</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2 bg-[#ff444f] text-white rounded-lg hover:bg-[#d43b44] transition-colors"
            >
              Create First Pool
            </button>
          </div>
        )}

        {/* Create Pool Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Create New Pool</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pool Name
                  </label>
                  <input
                    type="text"
                    value={formData.poolName}
                    onChange={(e) => setFormData({ ...formData, poolName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff444f]"
                    placeholder="e.g., Starter Pool"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Slots
                  </label>
                  <input
                    type="number"
                    value={formData.totalSlots}
                    onChange={(e) => setFormData({ ...formData, totalSlots: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff444f]"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Amount (USD) - Optional
                  </label>
                  <input
                    type="number"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff444f]"
                    min="0"
                  />
                </div>

                <button
                  onClick={handleCreatePool}
                  disabled={submitting}
                  className="w-full bg-[#ff444f] text-white py-2 rounded-lg hover:bg-[#d43b44] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                  {submitting ? 'Creating...' : 'Create Pool'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Add Slots Modal */}
        {showAddSlotsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Add Slots to {selectedPool}</h2>
                <button
                  onClick={() => setShowAddSlotsModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Slots to Add
                  </label>
                  <input
                    type="number"
                    value={formData.additionalSlots}
                    onChange={(e) => setFormData({ ...formData, additionalSlots: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff444f]"
                    min="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Adding {formData.additionalSlots} slots will increase total slots and available slots
                  </p>
                </div>

                <button
                  onClick={handleAddSlots}
                  disabled={submitting}
                  className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? <RefreshCw size={18} className="animate-spin" /> : <Plus size={18} />}
                  {submitting ? 'Adding...' : 'Add Slots'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Edit Slots Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Edit {selectedPool} Slots</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Slots
                  </label>
                  <input
                    type="number"
                    value={formData.editTotalSlots}
                    onChange={(e) => setFormData({ ...formData, editTotalSlots: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff444f]"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current filled slots: {pools.find(p => p.poolName === selectedPool)?.filledCount || 0}. 
                    Available slots will be: {Math.max(0, formData.editTotalSlots - (pools.find(p => p.poolName === selectedPool)?.filledCount || 0))}
                  </p>
                </div>

                <button
                  onClick={handleEditSlots}
                  disabled={submitting}
                  className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                  {submitting ? 'Updating...' : 'Update Slots'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PoolSlotManager;