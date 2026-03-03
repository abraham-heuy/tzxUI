import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { pools } from '../../data/pool';

interface PoolSelectionProps {
  formData: any;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  selectedPoolData: any;
  onPoolSelect: (poolId: string) => void;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAdjustAmount: (increment: boolean) => void;
  formatAmount: (amount: number) => string;
  onShowMpesaLimit: () => void;
}

const PoolSelection = ({ 
  formData, 
  errors, 
  touched, 
  selectedPoolData,
  onPoolSelect, 
  onAmountChange,
  onAdjustAmount,
  formatAmount,
  onShowMpesaLimit
}: PoolSelectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Select <span className="text-[#ff444f]">Investment Pool</span>
      </h2>

      {/* Pool Selection */}
      <div className="space-y-4 mb-6">
        {pools.map(pool => {
          const PoolIcon = pool.icon;
          const isSelected = formData.selectedPool === pool.id;
          
          return (
            <button
              key={pool.id}
              onClick={() => onPoolSelect(pool.id)}
              className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                isSelected 
                  ? 'border-[#ff444f] bg-[#ff444f]/5' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isSelected ? 'bg-[#ff444f]' : 'bg-gray-100'
                }`}>
                  <PoolIcon className={`w-6 h-6 ${
                    isSelected ? 'text-white' : `text-${pool.color}-600`
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">{pool.name}</h3>
                    <span className={`text-sm font-medium text-${pool.color}-600`}>
                      {pool.risk} Risk
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{pool.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Min: KES {pool.minAmount.toLocaleString()}</span>
                    <span>Max: KES {pool.maxAmount.toLocaleString()}</span>
                    <span>Returns: {pool.returns}</span>
                    <span>Fee: {(pool.fee * 100)}%</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {touched.selectedPool && errors.selectedPool && (
        <p className="text-red-500 text-sm mb-4">{errors.selectedPool}</p>
      )}

      {/* Investment Amount */}
      {selectedPoolData && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Investment Amount <span className="text-red-500">*</span>
          </label>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => onAdjustAmount(false)}
              className="w-12 h-12 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-[#ff444f] transition-colors"
            >
              <Minus size={20} className="text-gray-600" />
            </button>
            
            <div className="flex-1">
              <input
                type="number"
                name="investmentAmount"
                value={formData.investmentAmount}
                onChange={onAmountChange}
                min={selectedPoolData.minAmount}
                max={selectedPoolData.maxAmount}
                step={1000}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-center text-xl font-semibold focus:ring-2 focus:ring-[#ff444f] focus:border-transparent outline-none"
              />
            </div>
            
            <button
              onClick={() => onAdjustAmount(true)}
              className="w-12 h-12 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-[#ff444f] transition-colors"
            >
              <Plus size={20} className="text-gray-600" />
            </button>
          </div>

          <div className="flex items-center justify-between mt-3 text-sm">
            <span className="text-gray-500">Min: {formatAmount(selectedPoolData.minAmount)}</span>
            <span className="text-gray-500">Max: {formatAmount(selectedPoolData.maxAmount)}</span>
          </div>

          {formData.investmentAmount > 299999 && (
            <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-700">
                Amount exceeds M-Pesa limit (KES 299,999). 
                <button 
                  onClick={onShowMpesaLimit}
                  className="ml-1 text-[#ff444f] font-medium underline"
                >
                  View options
                </button>
              </p>
            </div>
          )}

          {touched.investmentAmount && errors.investmentAmount && (
            <p className="text-red-500 text-xs mt-2">{errors.investmentAmount}</p>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default PoolSelection;