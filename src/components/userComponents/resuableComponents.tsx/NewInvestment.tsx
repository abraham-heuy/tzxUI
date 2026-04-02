import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  TrendingUp,
  CreditCard,
  Key,
  PenSquare,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Import components from register
import ProgressSteps from "../../../components/common/ProgressSteps";
import PoolSelection from "../../../components/register/PoolSelection";
import PaymentStep from "../../../components/register/PaymentStep";
import VerificationStep from "../../../components/register/verificationstep";
import SignatureStep from "../../../components/register/SignatureStep";
import MpesaLimitModal from "../../../components/register/MpesaLimitModal";

// Import services
import { registrationService } from "../../../services/registrationService";
import { userService } from "../../../services/user";
import { useUser } from "../../../hooks/useUser";

// Import data
import { pools } from "../../../data/pool";

// Steps configuration (simplified for existing users)
const steps = [
  { id: 1, name: "Select Pool", icon: TrendingUp },
  { id: 2, name: "Payment", icon: CreditCard },
  { id: 3, name: "Verify", icon: Key },
  { id: 4, name: "Sign", icon: PenSquare },
  { id: 5, name: "Complete", icon: CheckCircle },
];

const NewInvestment = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isMpesaLimitOpen, setIsMpesaLimitOpen] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number>(130);
  const [loadingExchange, setLoadingExchange] = useState(true);

  // Payment states
  const [isSendingPayment, setIsSendingPayment] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentSent, setPaymentSent] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Signature state
  const [signature, setSignature] = useState("");
  const [signatureError, setSignatureError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    selectedPool: "",
    investmentAmount: 0, // Will hold KES amount
    mpesaPhone: "",
    mpesaCode: "",
  });

  // Fetch exchange rate
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/USD",
        );
        const data = await response.json();
        if (data.rates?.KES) {
          setExchangeRate(data.rates.KES);
        }
      } catch (error) {
        console.error("Failed to fetch exchange rate:", error);
        setExchangeRate(130);
      } finally {
        setLoadingExchange(false);
      }
    };
    fetchExchangeRate();
  }, []);

  // Helper Functions
  const formatAmount = (amount: number) => `KES ${amount.toLocaleString()}`;

  // Calculate KES amount from USD
  const calculateKesAmount = (usdAmount: number): number => {
    return Math.round(usdAmount * exchangeRate);
  };

  const selectedPoolData = pools.find((p) => p.id === formData.selectedPool);
  
  // Calculate the KES amount for the selected pool
  const kesAmount = selectedPoolData 
    ? calculateKesAmount(selectedPoolData.usdAmount) 
    : 0;
  
  // No fees - just the investment amount
  const total = kesAmount;

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError(null);
  };

  const handlePoolSelect = (poolId: string) => {
    const selectedPoolData = pools.find((p) => p.id === poolId);
    if (selectedPoolData) {
      const kesAmountValue = calculateKesAmount(selectedPoolData.usdAmount);
      setFormData((prev) => ({
        ...prev,
        selectedPool: poolId,
        investmentAmount: kesAmountValue, // Store KES amount
      }));
    }
  };

  // Validation - updated for fixed USD amounts
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.selectedPool) {
      newErrors.selectedPool = "Please select an investment pool";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.mpesaPhone) {
      newErrors.mpesaPhone = "Phone number is required";
    } else if (!/^\+?254\d{9}$/.test(formData.mpesaPhone.replace(/\s/g, ""))) {
      newErrors.mpesaPhone = "Enter valid M-Pesa number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.mpesaCode) {
      newErrors.mpesaCode = "Transaction code is required";
    } else if (!/^[A-Z0-9]{10,12}$/i.test(formData.mpesaCode)) {
      newErrors.mpesaCode = "Enter a valid M-Pesa transaction code";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    let isValid = true;
    if (!signature.trim()) {
      setSignatureError("Please type your full name to sign");
      isValid = false;
    } else if (
      user?.fullName &&
      signature.toLowerCase() !== user.fullName.toLowerCase()
    ) {
      setSignatureError("Signature must match your full name exactly");
      isValid = false;
    } else {
      setSignatureError("");
    }
    return isValid;
  };

  // API Handlers
  const handleSendPayment = async () => {
    if (!validateStep2()) {
      setTouched({ ...touched, mpesaPhone: true });
      return;
    }

    setIsSendingPayment(true);
    setApiError(null);

    try {
      // Send the KES amount to M-Pesa
      const response = await registrationService.initiateMpesaPayment({
        phoneNumber: formData.mpesaPhone,
        amount: Math.floor(total), // Use the KES amount, rounded to whole number
        reference: `INV-${Date.now()}`,
      });

      console.log("Payment initiated:", response);
      setPaymentSent(true);
      setCurrentStep(3);
      setErrors({});
    } catch (error: any) {
      setApiError(error.message || "Payment failed. Please try again.");
    } finally {
      setIsSendingPayment(false);
    }
  };

  const handleVerifyTransaction = () => {
    if (!validateStep3()) {
      setTouched({ ...touched, mpesaCode: true });
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      setCurrentStep(4);
      setErrors({});
    }, 1500);
  };

  const handleFinalSubmit = async () => {
    if (!validateStep4()) return;

    setIsVerifying(true);
    setApiError(null);

    try {
      const selectedPoolData = pools.find(
        (p) => p.id === formData.selectedPool
      );

      if (!selectedPoolData) {
        throw new Error("Please select an investment pool");
      }

      const investmentData = {
        selectedPool: {
          name: selectedPoolData.name,
          fee: selectedPoolData.fee,
        },
        investmentAmount: kesAmount, // Store KES amount in database
        mpesaPhone: formData.mpesaPhone,
        mpesaTransactionCode: formData.mpesaCode,
        digitalSignature: signature,
        agreementSignedAt: new Date(),
      };

      const response = await userService.createTransaction(investmentData);
      console.log("Investment created:", response);
      setCurrentStep(5);
    } catch (error: any) {
      setApiError(error.message || "Investment failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleNext = async () => {
    let isValid = false;
    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      case 4:
        isValid = validateStep4();
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      if (currentStep === 1) {
        setCurrentStep(2);
      } else if (currentStep === 2) {
        await handleSendPayment();
      } else if (currentStep === 3) {
        handleVerifyTransaction();
      } else if (currentStep === 4) {
        await handleFinalSubmit();
      }
    } else {
      const fieldsToTouch: Record<string, boolean> = {};
      if (currentStep === 1) {
        fieldsToTouch.selectedPool = true;
      } else if (currentStep === 2) {
        fieldsToTouch.mpesaPhone = true;
      } else if (currentStep === 3) {
        fieldsToTouch.mpesaCode = true;
      }
      setTouched(fieldsToTouch);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setErrors({});
      setApiError(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter,_sans-serif']">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate("/user/dashboard")}
              className="flex items-center gap-2 text-gray-700 hover:text-[#ff444f] transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Dashboard</span>
            </button>
            <div className="flex-shrink-0 ml-auto">
              <h1 className="text-2xl font-bold text-[#ff444f]">
                TZX<span className="text-gray-900">Trading</span>
              </h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16">
        {/* Hero Section */}
        <section className="relative py-12 bg-gradient-to-r from-[#ff444f] to-[#d43b44]">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative max-w-4xl mx-auto px-4 text-center z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                New <span className="text-white">Investment</span>
              </h1>
              <p className="text-white/90">Create an additional investment</p>
            </motion.div>
          </div>
        </section>

        {/* Investment Form */}
        <section className="py-8 md:py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            {/* Progress Steps */}
            <ProgressSteps steps={steps} currentStep={currentStep} />

            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              {/* API Error Display */}
              {apiError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{apiError}</p>
                </div>
              )}

              <AnimatePresence mode="wait">
                {/* Step 1: Select Pool */}
                {currentStep === 1 && (
                  <PoolSelection
                    formData={formData}
                    errors={errors}
                    touched={touched}
                    selectedPoolData={selectedPoolData}
                    onPoolSelect={handlePoolSelect}
                    formatAmount={formatAmount}
                    onShowMpesaLimit={() => setIsMpesaLimitOpen(true)}
                    exchangeRate={exchangeRate}
                    loadingExchange={loadingExchange}
                  />
                )}

                {/* Step 2: Payment */}
                {currentStep === 2 && (
                  <PaymentStep
                    formData={formData}
                    errors={errors}
                    touched={touched}
                    selectedPoolData={selectedPoolData}
                    investmentAmount={kesAmount} // Pass KES amount
                    fee={0} // No fee
                    total={total}
                    onChange={handleChange}
                    onSendPayment={handleSendPayment}
                    formatAmount={formatAmount}
                    isSendingPayment={isSendingPayment}
                  />
                )}

                {/* Step 3: Verify */}
                {currentStep === 3 && (
                  <VerificationStep
                    formData={formData}
                    errors={errors}
                    touched={touched}
                    total={total}
                    mpesaPhone={formData.mpesaPhone}
                    onChange={handleChange}
                    onVerify={handleVerifyTransaction}
                    formatAmount={formatAmount}
                    isVerifying={isVerifying}
                    paymentSent={paymentSent}
                  />
                )}

                {/* Step 4: Sign */}
                {currentStep === 4 && (
                  <SignatureStep
                    fullName={user?.fullName || ""}
                    signature={signature}
                    signatureError={signatureError}
                    termsAccepted={termsAccepted}
                    termsError={errors.terms || ""}
                    onSignatureChange={setSignature}
                    onTermsChange={setTermsAccepted}
                  />
                )}

                {/* Step 5: Complete */}
                {currentStep === 5 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Investment{" "}
                      <span className="text-green-600">Created!</span>
                    </h2>

                    <p className="text-gray-600 mb-6">
                      Your investment has been submitted successfully and is
                      pending approval.
                    </p>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6 text-left">
                      <h3 className="font-semibold text-amber-800 mb-2">
                        What happens next?
                      </h3>
                      <ul className="space-y-2 text-sm text-amber-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle
                            size={16}
                            className="mt-0.5 flex-shrink-0"
                          />
                          <span>
                            Your investment will be reviewed by our team
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle
                            size={16}
                            className="mt-0.5 flex-shrink-0"
                          />
                          <span>
                            You'll receive a notification once approved
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle
                            size={16}
                            className="mt-0.5 flex-shrink-0"
                          />
                          <span>The trader will begin managing your funds</span>
                        </li>
                      </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => navigate("/dashboard/transactions")}
                        className="bg-[#ff444f] text-white px-6 py-3 rounded-xl hover:bg-[#d43b44] transition-colors font-semibold"
                      >
                        View My Investments
                      </button>
                      <button
                        onClick={() => navigate("/dashboard")}
                        className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                      >
                        Back to Dashboard
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              {currentStep < 5 && (
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  {currentStep > 1 && (
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <ChevronLeft size={18} /> Back
                    </button>
                  )}

                  <button
                    onClick={handleNext}
                    disabled={isSendingPayment || isVerifying}
                    className="ml-auto flex items-center gap-2 bg-[#ff444f] text-white px-8 py-3 rounded-xl hover:bg-[#d43b44] transition-all font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSendingPayment
                      ? "Sending..."
                      : isVerifying
                      ? "Processing..."
                      : currentStep === 4
                      ? "Submit Investment"
                      : "Continue"}
                    {!isSendingPayment && !isVerifying && (
                      <ChevronRight size={18} />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* M-Pesa Limit Modal */}
      <MpesaLimitModal
        isOpen={isMpesaLimitOpen}
        onClose={() => setIsMpesaLimitOpen(false)}
      />
    </div>
  );
};

export default NewInvestment;