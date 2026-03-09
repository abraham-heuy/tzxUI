import { motion } from 'framer-motion';
import { Check } from 'lucide-react'; // Removed Minus, Plus imports
import { pools } from '../../data/pool';

interface PoolSelectionProps {
  formData: any;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  selectedPoolData: any;
  onPoolSelect: (poolId: string) => void;
  formatAmount: (amount: number) => string;
  onShowMpesaLimit: () => void;
}

const PoolSelection = ({ 
  formData, 
  errors, 
  touched, 
  selectedPoolData,
  onPoolSelect, 
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

      {/* Pool Selection - Fixed amounts */}
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
                  
                  {/* Fixed Amount Display */}
                  <div className="flex items-center gap-4 text-sm mb-2">
                    <span className="font-bold text-[#ff444f]">
                      {formatAmount(pool.amount)}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      Returns after {pool.returnPeriod}
                    </span>
                  </div>
                  
                  {/* Details Row */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Returns: {pool.returns}</span>
                    <span>Fee: {(pool.fee * 100)}%</span>
                  </div>

                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-[#ff444f]">
                      <Check size={14} />
                      <span>Selected</span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {touched.selectedPool && errors.selectedPool && (
        <p className="text-red-500 text-sm mb-4">{errors.selectedPool}</p>
      )}

      {/* No amount input - fixed amounts only */}
      {selectedPoolData && selectedPoolData.id !== 'test' && selectedPoolData.amount > 299999 && (
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
    </motion.div>
  );
};

export default PoolSelection;