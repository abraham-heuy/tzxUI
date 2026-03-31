// src/components/register/verificationstep.tsx

import { motion } from "framer-motion";
import { CheckCircle,  AlertCircle, Info, ArrowRight, CreditCard, Receipt } from "lucide-react";

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
  paymentSent,
}: VerificationStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Verify Your <span className="text-[#ff444f]">Payment</span>
      </h2>
      <p className="text-gray-600 mb-6">
        Enter the M-Pesa transaction code you received to verify your payment
      </p>

      {/* Payment Summary Card */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <CreditCard size={18} className="text-green-600" />
          <span className="text-sm font-semibold text-gray-700">Payment Details</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Amount Paid</span>
            <span className="font-semibold text-gray-900">{formatAmount(total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">M-Pesa Number</span>
            <span className="font-semibold text-gray-900">{mpesaPhone}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Status</span>
            {paymentSent ? (
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle size={14} />
                Payment Initiated
              </span>
            ) : (
              <span className="text-yellow-600">Awaiting Payment</span>
            )}
          </div>
        </div>
      </div>

      {/* Manual Payment Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info size={18} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-800 mb-2">
              Didn't receive the payment prompt?
            </p>
            <p className="text-xs text-blue-700 mb-3">
              You can pay manually using M-Pesa Paybill:
            </p>
            <div className="bg-white rounded-lg p-3 mb-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Paybill Number</p>
                  <p className="font-mono font-bold text-gray-900">4564891</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Account Number</p>
                  <p className="font-mono font-bold text-gray-900 text-xs break-all">
                    {formData.investmentReference || `TZX-${Date.now()}`}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="font-bold text-[#ff444f]">{formatAmount(total)}</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-blue-600">
              After paying manually, enter the receipt number from your SMS below
            </p>
          </div>
        </div>
      </div>

      {/* Transaction Code Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          M-Pesa Transaction Code
        </label>
        <div className="relative">
          <Receipt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            name="mpesaCode"
            value={formData.mpesaCode}
            onChange={onChange}
            placeholder="e.g., QAL123456789"
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff444f] ${
              errors.mpesaCode && touched.mpesaCode
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
        </div>
        {errors.mpesaCode && touched.mpesaCode && (
          <p className="text-red-500 text-xs mt-1">{errors.mpesaCode}</p>
        )}
        <p className="text-xs text-gray-400 mt-2">
          Enter the 10-12 character code from your M-Pesa SMS (e.g., QAL123456789)
        </p>
      </div>

      {/* Info Message */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle size={18} className="text-amber-600 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800 mb-1">
              Verification Process
            </p>
            <p className="text-xs text-amber-700">
              Your transaction code will be cross-checked with our payment records. 
              Once verified, you'll proceed to the signature step. 
              If verification takes longer, our admin will review and confirm your payment manually.
            </p>
          </div>
        </div>
      </div>

      {/* Verify Button */}
      <button
        onClick={onVerify}
        disabled={isVerifying || !formData.mpesaCode}
        className="w-full bg-[#ff444f] text-white py-3 rounded-xl hover:bg-[#d43b44] transition-all font-semibold flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isVerifying ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Verifying...
          </>
        ) : (
          <>
            Verify Payment
            <ArrowRight size={18} />
          </>
        )}
      </button>

      {/* Note */}
      <p className="text-xs text-gray-400 text-center mt-4">
        Your payment will be verified within 5-10 minutes. If not verified, admin will manually confirm.
      </p>
    </motion.div>
  );
};

export default VerificationStep;