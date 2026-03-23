import { motion } from 'framer-motion';
import { Check, DollarSign, Clock, Zap } from 'lucide-react';
import { pools } from '../../data/pool';

interface PoolSelectionProps {
  formData: any;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  selectedPoolData: any;
  onPoolSelect: (poolId: string) => void;
  formatAmount: (amount: number) => string;
  onShowMpesaLimit: () => void;
  exchangeRate?: number;
  loadingExchange?: boolean;
}

const PoolSelection = ({ 
  formData, 
  errors, 
  touched, 
  selectedPoolData,
  onPoolSelect, 
  formatAmount,
  onShowMpesaLimit,
  exchangeRate = 130,
  loadingExchange = false
}: PoolSelectionProps) => {
  
  const getReturnPeriodIcon = (period: string) => {
    if (period === '3 days') return <Zap size={14} className="text-yellow-500" />;
    return <Clock size={14} className="text-blue-500" />;
  };

  const formatUSD = (amount: number) => `$${amount}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Select <span className="text-[#ff444f]">Investment Pool</span>
      </h2>
      
      {/* Exchange Rate Info */}
      <div className="mb-6 p-3 bg-blue-50 rounded-lg flex items-center gap-2 text-sm">
        <DollarSign size={16} className="text-blue-600" />
        <span className="text-blue-700">
          Current exchange rate: 
          {loadingExchange ? (
            <span className="ml-1 inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <strong className="ml-1">1 USD = {formatAmount(Math.round(exchangeRate))}</strong>
          )}
        </span>
      </div>

      {/* Pool Selection */}
      <div className="space-y-4 mb-6">
        {pools.map(pool => {
          const PoolIcon = pool.icon;
          const isSelected = formData.selectedPool === pool.id;
          // Calculate KES amount (rounded to whole number)
          const kesAmount = Math.round(pool.usdAmount * exchangeRate);
          
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
                    <div className="flex items-center gap-1 text-xs">
                      {getReturnPeriodIcon(pool.returnPeriod)}
                      <span className="text-gray-500">{pool.returnPeriod}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{pool.description}</p>
                  
                  {/* Amount Display - USD and KES */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">USD:</span>
                      <span className="font-medium text-gray-700">{formatUSD(pool.usdAmount)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">KES:</span>
                      <span className="font-bold text-[#ff444f] text-base">
                        {formatAmount(kesAmount)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Details Row */}
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Returns: {pool.returns}
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                      Fee: {(pool.fee * 100)}%
                    </span>
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

      {/* M-Pesa Limit Warning */}
      {selectedPoolData && (() => {
        const kesAmount = Math.round(selectedPoolData.usdAmount * exchangeRate);
        if (kesAmount > 299999) {
          return (
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
          );
        }
        return null;
      })()}
    </motion.div>
  );
};

export default PoolSelection;