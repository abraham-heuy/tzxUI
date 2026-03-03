import { motion } from 'framer-motion';
import { Key, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface VerificationStepProps {
  formData: any;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  total: number;
  mpesaPhone: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVerify: () => void;
  formatAmount: (amount: number) => string;
  isVerifying: boolean;
  paymentSent: boolean;
}

const VerificationStep = ({ 
  formData, 
  errors, 
  touched, 
  total,
  mpesaPhone,
  onChange,
  onVerify,
  formatAmount,
  isVerifying,
  paymentSent
}: VerificationStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Verify <span className="text-[#ff444f]">Transaction</span>
      </h2>

      <div className="space-y-6">
        {/* Payment Status */}
        {paymentSent && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm text-green-800 font-medium">Payment Request Sent!</p>
                <p className="text-xs text-green-600 mt-1">
                  Check your phone for the STK prompt and complete the payment.
                  Then enter the transaction code below.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Summary */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-3">Transaction Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount Paid:</span>
              <span className="font-medium text-gray-900">{formatAmount(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone Number:</span>
              <span className="font-medium text-gray-900">{mpesaPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium text-gray-900">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* M-Pesa Transaction Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            M-Pesa Transaction Code <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Key className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              name="mpesaCode"
              value={formData.mpesaCode}
              onChange={onChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl font-mono focus:ring-2 focus:ring-[#ff444f] focus:border-transparent transition-all outline-none ${
                touched.mpesaCode && errors.mpesaCode ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., QWE2R3TY4U"
              disabled={isVerifying}
            />
          </div>
          {touched.mpesaCode && errors.mpesaCode && (
            <p className="text-red-500 text-xs mt-1">{errors.mpesaCode}</p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Enter the transaction code from your M-Pesa confirmation SMS
          </p>
        </div>

        {/* Verify Button */}
        <button
          onClick={onVerify}
          disabled={isVerifying}
          className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
            isVerifying
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#ff444f] text-white hover:bg-[#d43b44] hover:scale-[1.02]'
          }`}
        >
          {isVerifying ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Verifying Transaction...
            </>
          ) : (
            <>
              Verify & Continue
              <ArrowRight size={18} />
            </>
          )}
        </button>

        {/* Help Text */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm text-amber-800 font-medium">Didn't receive the code?</p>
              <p className="text-xs text-amber-600 mt-1">
                If you haven't received the STK prompt or transaction code:
              </p>
              <ul className="text-xs text-amber-600 mt-2 space-y-1 list-disc list-inside">
                <li>Wait 2-3 minutes for the prompt</li>
                <li>Check if you have sufficient M-Pesa balance</li>
                <li>Ensure your phone is on and has network</li>
                <li>Contact support: +254 700 123 456</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VerificationStep;