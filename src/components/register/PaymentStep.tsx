import { motion } from 'framer-motion';
import { Smartphone, Info, ArrowRight } from 'lucide-react';

interface PaymentStepProps {
  formData: any;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  selectedPoolData: any;
  investmentAmount: number;
  fee: number;
  total: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendPayment: () => void;
  formatAmount: (amount: number) => string;
  isSendingPayment: boolean;
}

const PaymentStep = ({ 
  formData, 
  errors, 
  touched, 
  selectedPoolData,
  investmentAmount,
  fee,
  total,
  onChange,
  onSendPayment,
  formatAmount,
  isSendingPayment
}: PaymentStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Payment <span className="text-[#ff444f]">Details</span>
      </h2>

      <div className="space-y-6">
        {/* Summary with Fees */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-3">Investment Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Pool:</span>
              <span className="font-medium text-gray-900">{selectedPoolData?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Investment Amount:</span>
              <span className="font-medium text-gray-900">{formatAmount(investmentAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction Fee ({(selectedPoolData?.fee || 0) * 100}%):</span>
              <span className="font-medium text-gray-900">{formatAmount(fee)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="text-gray-600 font-semibold">Total to Pay:</span>
              <span className="font-bold text-[#ff444f]">{formatAmount(total)}</span>
            </div>
          </div>
        </div>

        {/* M-Pesa Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            M-Pesa Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Smartphone className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="tel"
              name="mpesaPhone"
              value={formData.mpesaPhone}
              onChange={onChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#ff444f] focus:border-transparent transition-all outline-none ${
                touched.mpesaPhone && errors.mpesaPhone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0712345678"
              disabled={isSendingPayment}
            />
          </div>
          {touched.mpesaPhone && errors.mpesaPhone && (
            <p className="text-red-500 text-xs mt-1">{errors.mpesaPhone}</p>
          )}
        </div>

        {/* Send Payment Button */}
        <button
          onClick={onSendPayment}
          disabled={isSendingPayment}
          className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
            isSendingPayment
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#ff444f] text-white hover:bg-[#d43b44] hover:scale-[1.02]'
          }`}
        >
          {isSendingPayment ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending Payment Request...
            </>
          ) : (
            <>
              Send Payment Request
              <ArrowRight size={18} />
            </>
          )}
        </button>

        {/* Payment Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 font-medium">How it works:</p>
              <ol className="text-xs text-blue-600 mt-2 space-y-2 list-decimal list-inside">
                <li>Click "Send Payment Request" above</li>
                <li>You'll receive an STK prompt on your phone</li>
                <li>Enter your M-Pesa PIN to complete payment</li>
                <li>Save the confirmation SMS with transaction code</li>
                <li>Proceed to next step to enter the code</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentStep;