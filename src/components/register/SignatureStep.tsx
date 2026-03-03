import { motion, AnimatePresence } from 'framer-motion';
import { 
  PenSquare, 
  FileCheck, 
  AlertCircle, 
  ExternalLink,
  BookOpen,
  X,
  Shield,
  Timer,
  TrendingDown,
  CheckCircle,
  FileText,
  Check
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface SignatureStepProps {
  fullName: string;
  signature: string;
  signatureError: string;
  termsAccepted: boolean;
  termsError: string;
  onSignatureChange: (value: string) => void;
  onTermsChange: (checked: boolean) => void;
}

// Full Terms and Conditions content (from Disclaimer)
const termsContent = {
  introduction: "Welcome to TZX Trading. By accessing or using our platform, you agree to be bound by these Terms and Conditions. Please read them carefully before investing.",
  
  sections: [
    {
      title: "1. Risk Disclosure",
      icon: <AlertCircle className="w-5 h-5 text-amber-600" />,
      content: "Trading in financial markets involves substantial risk of loss. Past performance does not guarantee future results. You should never invest money that you cannot afford to lose. The leveraged nature of trading means that losses can exceed deposits. It is important to fully understand the risks involved before engaging in any investment activity."
    },
    {
      title: "2. Investment Pools",
      icon: <Shield className="w-5 h-5 text-amber-600" />,
      content: "Our investment pools are managed by professional traders who employ various strategies. Pool performance varies based on market conditions, strategy execution, and risk management. Returns are not guaranteed and can fluctuate. Minimum investment periods apply to each pool as specified in the pool description."
    },
    {
      title: "3. Profit & Loss",
      icon: <TrendingDown className="w-5 h-5 text-amber-600" />,
      content: "The trader manages all withdrawals and profit distributions. If there are no profits in a given period, there will be no withdrawals processed. Trading losses are a normal part of market activity and investors must accept that losses may occur. The trader determines when profits are available for withdrawal based on pool performance."
    },
    {
      title: "4. Withdrawal Policy",
      icon: <Timer className="w-5 h-5 text-amber-600" />,
      content: "Withdrawals are processed only when profits are available. The trader handles all withdrawal requests and determines the timing based on pool liquidity and market conditions. Investors must wait for profitable trading periods before any withdrawals can be made. There is no guaranteed withdrawal schedule."
    },
    {
      title: "5. Fees and Charges",
      icon: <FileText className="w-5 h-5 text-amber-600" />,
      content: "Management fees are charged monthly and deducted from pool profits before distribution. Withdrawal fees of 1% apply to all withdrawals. Deposit fees may apply based on the payment method used. All fees are clearly disclosed in your account dashboard."
    },
    {
      title: "6. Account Security",
      icon: <Shield className="w-5 h-5 text-amber-600" />,
      content: "You are responsible for maintaining the security of your account credentials. Enable two-factor authentication for additional security. Report any unauthorized access immediately. We employ bank-grade security measures but cannot be held responsible for compromised user credentials."
    },
    {
      title: "7. Regulatory Compliance",
      icon: <CheckCircle className="w-5 h-5 text-amber-600" />,
      content: "TZX Trading operates in compliance with applicable financial regulations. Users must provide accurate KYC information and comply with anti-money laundering requirements. We reserve the right to refuse service to anyone in jurisdictions where our services may be restricted."
    },
    {
      title: "8. Limitation of Liability",
      icon: <AlertCircle className="w-5 h-5 text-amber-600" />,
      content: "TZX Trading, its affiliates, employees, and agents shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our services, including but not limited to trading losses, data loss, or business interruption."
    },
    {
      title: "9. Amendments",
      icon: <FileText className="w-5 h-5 text-amber-600" />,
      content: "We reserve the right to modify these terms at any time. Continued use of our platform after changes constitutes acceptance of the modified terms. Material changes will be communicated via email or platform notification."
    }
  ],

  agreement: "By investing with TZX Trading, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions and all associated risks. You understand that trading losses are possible and that withdrawals are processed only when profits are available."
};

const SignatureStep = ({ 
  fullName, 
  signature, 
  signatureError,
  termsAccepted,
  termsError,
  onSignatureChange,
  onTermsChange,
}: SignatureStepProps) => {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [localMatchStatus, setLocalMatchStatus] = useState<'none' | 'partial' | 'exact'>('none');

  // Normalize strings for comparison (remove extra spaces, convert to lowercase)
  const normalizeString = (str: string) => {
    return str.toLowerCase().replace(/\s+/g, ' ').trim();
  };

  // Check signature match status in real-time
  useEffect(() => {
    if (!signature || !fullName) {
      setLocalMatchStatus('none');
      return;
    }

    const normalizedSignature = normalizeString(signature);
    const normalizedFullName = normalizeString(fullName);

    if (normalizedSignature === normalizedFullName) {
      setLocalMatchStatus('exact');
    } else if (normalizedFullName.includes(normalizedSignature) && normalizedSignature.length > 0) {
      setLocalMatchStatus('partial');
    } else {
      setLocalMatchStatus('none');
    }
  }, [signature, fullName]);

  // Get match status color and message
  const getMatchStatusDisplay = () => {
    if (!fullName) return null;
    
    switch (localMatchStatus) {
      case 'exact':
        return (
          <div className="flex items-center gap-1 text-green-600 mt-1">
            <Check size={14} />
            <span className="text-xs">✓ Name matches exactly</span>
          </div>
        );
      case 'partial':
        return (
          <div className="flex items-center gap-1 text-amber-600 mt-1">
            <AlertCircle size={14} />
            <span className="text-xs">Partial match - type your full name exactly</span>
          </div>
        );
      default:
        return (
          <p className="text-xs text-gray-500 mt-1">
            Must match: <span className="font-medium">{fullName}</span>
          </p>
        );
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Digital <span className="text-[#ff444f]">Signature</span>
        </h2>

        <div className="space-y-6">
          {/* Signature Instruction */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="flex items-start gap-3">
              <PenSquare className="w-5 h-5 text-[#ff444f] mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Electronic Signature</h3>
                <p className="text-sm text-gray-600">
                  Type your full name below to serve as your digital signature. 
                  This constitutes a legally binding agreement.
                </p>
              </div>
            </div>
          </div>

          {/* Signature Input with Real-time Validation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type your full name to sign <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={signature}
                onChange={(e) => onSignatureChange(e.target.value)}
                placeholder={fullName || "Enter your full name"}
                className={`w-full px-4 py-3 border rounded-xl font-signature text-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent transition-all outline-none pr-10 ${
                  signatureError ? 'border-red-500' : 
                  localMatchStatus === 'exact' ? 'border-green-500' :
                  localMatchStatus === 'partial' ? 'border-amber-500' : 'border-gray-300'
                }`}
              />
              {localMatchStatus === 'exact' && (
                <Check className="absolute right-3 top-3 text-green-500" size={20} />
              )}
            </div>
            
            {/* Error Message */}
            {signatureError && (
              <p className="text-red-500 text-xs mt-1">{signatureError}</p>
            )}
            
            {/* Match Status */}
            {!signatureError && getMatchStatusDisplay()}
          </div>

          {/* Terms and Conditions */}
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <FileCheck className="w-5 h-5 text-[#ff444f] mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">Terms & Conditions</h3>
                <p className="text-xs text-gray-500">Please read before accepting</p>
              </div>
            </div>

            {/* Terms Preview */}
            <div className="bg-gray-50 rounded-lg p-3 mb-3 max-h-32 overflow-y-auto text-xs text-gray-600">
              <p className="mb-2"><span className="font-semibold">1. Risk Disclosure:</span> Trading involves substantial risk of loss. Never invest money you cannot afford to lose.</p>
              <p className="mb-2"><span className="font-semibold">2. Investment Pools:</span> Returns are not guaranteed and can fluctuate based on market conditions.</p>
              <p className="mb-2"><span className="font-semibold">3. Profit & Loss:</span> Withdrawals only when profits are available. Losses are possible.</p>
              <p className="mb-2"><span className="font-semibold">4. Fees:</span> Management fees apply as specified in your selected pool.</p>
            </div>

            {/* View Full Terms Button */}
            <button
              onClick={() => setIsTermsOpen(true)}
              className="flex items-center gap-1 text-[#ff444f] text-sm hover:underline mb-3"
            >
              <ExternalLink size={14} />
              Read full Terms & Conditions
            </button>

            {/* Accept Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => onTermsChange(e.target.checked)}
                className="mt-1 w-4 h-4 text-[#ff444f] border-gray-300 rounded focus:ring-[#ff444f]"
              />
              <span className="text-sm text-gray-700">
                I have read and agree to the Terms & Conditions and understand the risks involved in trading.
              </span>
            </label>
            {termsError && (
              <p className="text-red-500 text-xs mt-1">{termsError}</p>
            )}
          </div>

          {/* Legal Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
              <p className="text-xs text-amber-700">
                By typing your name above and checking the agreement box, you are signing this document electronically. 
                You agree that your electronic signature is the legal equivalent of your manual signature.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Terms and Conditions Modal - Full version from Disclaimer */}
      <AnimatePresence>
        {isTermsOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-50"
              onClick={() => setIsTermsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="fixed inset-4 md:inset-8 z-50 flex items-center justify-center pointer-events-none"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-full overflow-hidden pointer-events-auto flex flex-col">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-bold text-gray-900">
                        Terms & Conditions
                      </h2>
                      <p className="text-xs text-gray-500">
                        Last updated: March 2026
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsTermsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} className="text-gray-600" />
                  </button>
                </div>

                {/* Modal Content - Scrollable */}
                <div className="p-4 md:p-6 overflow-y-auto flex-1">
                  {/* Introduction */}
                  <div className="mb-6 bg-amber-50 p-4 rounded-xl border-l-4 border-amber-500">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {termsContent.introduction}
                    </p>
                  </div>

                  {/* Terms Sections */}
                  <div className="space-y-4 mb-6">
                    {termsContent.sections.map((section, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-3 mb-2">
                          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            {section.icon}
                          </div>
                          <h3 className="font-semibold text-gray-900 text-base md:text-lg">
                            {section.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed pl-11">
                          {section.content}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Agreement Statement */}
                  <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-4 md:p-5 rounded-xl text-white">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                      <p className="text-sm leading-relaxed">
                        {termsContent.agreement}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex flex-col gap-3 mt-6">
                    <button
                      onClick={() => setIsTermsOpen(false)}
                      className="w-full bg-amber-600 text-white py-3 rounded-xl hover:bg-amber-700 transition-colors font-semibold text-sm"
                    >
                      I Have Read and Understand
                    </button>
                  </div>

                  {/* Footer Note */}
                  <p className="text-xs text-gray-400 text-center mt-4">
                    These terms constitute a legally binding agreement between you and TZX Trading.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SignatureStep;