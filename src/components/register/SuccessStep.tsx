import { motion } from 'framer-motion';
import { 
  CheckCircle, FileText, Clock, Check, Info 
} from 'lucide-react';

interface SuccessStepProps {
  referenceNumber: string;
  fullName: string;
  investmentAmount: number;
  selectedPoolName: string;
  signature: string;
  onReturnHome: () => void;
  formatAmount: (amount: number) => string;
}

const SuccessStep = ({ 
  referenceNumber, 
  fullName, 
  investmentAmount, 
  selectedPoolName, 
  signature,
  onReturnHome,
  formatAmount 
}: SuccessStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-4"
    >
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Registration <span className="text-green-600">Successful!</span>
      </h2>
      
      <p className="text-gray-600 mb-6">
        Thank you for choosing TZX Trading
      </p>

      {/* Transaction Receipt */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText size={18} className="text-[#ff444f]" />
          Registration Receipt
        </h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between pb-2 border-b border-gray-200">
            <span className="text-gray-600">Reference Number:</span>
            <span className="font-mono font-bold text-[#ff444f]">{referenceNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="font-medium text-gray-900">{fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Investment Amount:</span>
            <span className="font-semibold text-gray-900">{formatAmount(investmentAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Pool:</span>
            <span className="text-gray-900">{selectedPoolName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Signed:</span>
            <span className="text-gray-900">{signature}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="text-gray-900">{new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* What happens next */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6 text-left">
        <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
          <Clock size={18} />
          What happens next?
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-2 text-sm text-amber-700">
            <Check size={16} className="mt-0.5 flex-shrink-0" />
            <span>Your registration is pending approval (usually within 6-24 hours)</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-amber-700">
            <Check size={16} className="mt-0.5 flex-shrink-0" />
            <span>Our team will verify your details and contact you via email/phone</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-amber-700">
            <Check size={16} className="mt-0.5 flex-shrink-0" />
            <span>Once approved, the trader will begin managing your investment</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-amber-700">
            <Check size={16} className="mt-0.5 flex-shrink-0" />
            <span>You'll receive a confirmation email with login credentials</span>
          </li>
        </ul>
      </div>

      {/* Important Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5" />
          <p className="text-xs text-blue-700">
            <span className="font-semibold">For reporting issues:</span> Please quote your reference number{' '}
            <span className="font-mono bg-white px-2 py-0.5 rounded border border-blue-200">
              {referenceNumber}
            </span>{' '}
            when contacting support.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={onReturnHome}
          className="bg-[#ff444f] text-white px-8 py-3 rounded-xl hover:bg-[#d43b44] transition-all font-semibold"
        >
          Return to Home
        </button>
        <p className="text-xs text-gray-500">
          We'll be in touch within 24 hours
        </p>
      </div>
    </motion.div>
  );
};

export default SuccessStep;