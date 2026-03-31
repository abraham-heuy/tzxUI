import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  User,
  TrendingUp,
  CreditCard,
  Key,
  PenSquare,
  CheckCircle,
  FileText,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Import components
import ProgressSteps from "../components/common/ProgressSteps";
import BasicDetails from "../components/register/BasicDetails";
import PoolSelection from "../components/register/PoolSelection";
import PaymentStep from "../components/register/PaymentStep";
import SignatureStep from "../components/register/SignatureStep";
import SuccessStep from "../components/register/SuccessStep";
import MpesaLimitModal from "../components/register/MpesaLimitModal";

// Import services
import { registrationService } from "../services/registrationService";

// Import data and types
import type { FormData } from "../types/register";

// Import background image
import registerBg from "../assets/register.jpg";
import { pools } from "../data/pool";
import VerificationStep from "../components/register/verificationstep";

// Steps configuration
const steps = [
  { id: 1, name: "Basic Details", icon: User },
  { id: 2, name: "Select Pool", icon: TrendingUp },
  { id: 3, name: "Payment", icon: CreditCard },
  { id: 4, name: "Verify", icon: Key },
  { id: 5, name: "Sign & Agree", icon: PenSquare },
  { id: 6, name: "Complete", icon: CheckCircle },
];

// Terms and Conditions content
const termsContent = {
  introduction:
    "Welcome to TZX Trading. By accessing or using our platform, you agree to be bound by these Terms and Conditions.",
  sections: [
    {
      title: "1. Risk Disclosure",
      content:
        "Trading in financial markets involves substantial risk of loss. Past performance does not guarantee future results.",
    },
    {
      title: "2. Investment Pools",
      content:
        "Our investment pools are managed by professional traders. Returns are not guaranteed and can fluctuate.",
    },
    {
      title: "3. Profit & Loss",
      content:
        "The trader manages all withdrawals and profit distributions. Losses are a normal part of trading.",
    },
    {
      title: "4. Fees and Charges",
      content:
        "Management fees are charged monthly and deducted from pool profits before distribution.",
    },
  ],
  agreement:
    "By investing with TZX Trading, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.",
};

const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isMpesaLimitOpen, setIsMpesaLimitOpen] = useState(false);

  // Payment states
  const [isSendingPayment, setIsSendingPayment] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentSent, setPaymentSent] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);

  // Signature and terms state
  const [signature, setSignature] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [signatureError, setSignatureError] = useState("");
  const [exchangeRate, setExchangeRate] = useState<number>(130);
  const [loadingExchange, setLoadingExchange] = useState(true);

  // Registration result
  const [registrationResult, setRegistrationResult] = useState<any>(null);

  // Form data state
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    idNumber: "",
    password: "",
    confirmPassword: "",
    selectedPool: "",
    investmentAmount: 0,
    mpesaPhone: "",
    mpesaCode: "",
  });

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

  const calculateKesAmount = (usdAmount: number): number => {
    return Math.round(usdAmount * exchangeRate);
  };

  const selectedPoolData = pools.find((p) => p.id === formData.selectedPool);
  const kesAmount = selectedPoolData 
    ? calculateKesAmount(selectedPoolData.usdAmount) 
    : 0;
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
    setVerificationMessage(null);
  };

  const handlePoolSelect = (poolId: string) => {
    const selectedPoolData = pools.find((p) => p.id === poolId);
    if (selectedPoolData) {
      const kesAmountValue = calculateKesAmount(selectedPoolData.usdAmount);
      setFormData((prev) => ({
        ...prev,
        selectedPool: poolId,
        investmentAmount: kesAmountValue,
      }));
    }
  };

  // Validation
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email is required";
    if (
      !formData.phone.trim() ||
      !/^\+?254\d{9}$/.test(formData.phone.replace(/\s/g, ""))
    ) {
      newErrors.phone = "Valid Kenyan number required";
    }
    if (!formData.idNumber.trim() || !/^\d{5,8}$/.test(formData.idNumber)) {
      newErrors.idNumber = "Valid ID number required";
    }
    if (!formData.password || formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.selectedPool) {
      newErrors.selectedPool = "Please select an investment pool";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep5 = () => {
    let isValid = true;
    if (!signature.trim()) {
      setSignatureError("Please type your full name to sign");
      isValid = false;
    } else if (signature.toLowerCase() !== formData.fullName.toLowerCase()) {
      setSignatureError("Signature must match your full name exactly");
      isValid = false;
    } else {
      setSignatureError("");
    }
    if (!termsAccepted) {
      setErrors((prev) => ({
        ...prev,
        terms: "You must accept the terms and conditions",
      }));
      isValid = false;
    }
    return isValid;
  };

  // API Handlers
  const handleSendPayment = async () => {
    if (!formData.mpesaPhone) {
      setErrors((prev) => ({
        ...prev,
        mpesaPhone: "Phone number is required",
      }));
      return;
    }
    if (!/^\+?254\d{9}$/.test(formData.mpesaPhone.replace(/\s/g, ""))) {
      setErrors((prev) => ({
        ...prev,
        mpesaPhone: "Enter valid M-Pesa number",
      }));
      return;
    }

    setIsSendingPayment(true);
    setApiError(null);

    try {
      const response = await registrationService.initiateMpesaPayment({
        phoneNumber: formData.mpesaPhone,
        amount: Math.floor(total),
        reference: `TZX-${Date.now()}`,
      });

      console.log("Payment initiated:", response);
      setPaymentSent(true);
      setCurrentStep(4);
      setErrors({});
    } catch (error: any) {
      setApiError(error.message || "Payment failed. Please try again.");
    } finally {
      setIsSendingPayment(false);
    }
  };

  // ✅ Updated verification function - allows users to proceed with code
  const handleVerifyTransaction = async () => {
    if (!formData.mpesaCode) {
      setErrors((prev) => ({
        ...prev,
        mpesaCode: "Transaction code is required",
      }));
      return;
    }
    
    // Accept M-Pesa receipt format (10-12 chars) and test codes
    if (!/^[A-Z0-9]{10,12}$/i.test(formData.mpesaCode) && 
        !formData.mpesaCode.startsWith('TEST-')) {
      setErrors((prev) => ({
        ...prev,
        mpesaCode: "Enter a valid M-Pesa transaction code (e.g., QAL123456789)",
      }));
      return;
    }

    setIsVerifying(true);
    setApiError(null);
    setVerificationMessage(null);

    try {
      // Try to verify with backend
      const response = await registrationService.verifyTransaction({
        transactionCode: formData.mpesaCode,
        phoneNumber: formData.mpesaPhone,
        amount: total
      });

      if (response.success) {
        // Transaction verified in database - move to signature step
        setVerificationMessage("✅ Payment verified successfully! Proceeding to signature.");
        setTimeout(() => {
          setCurrentStep(5);
          setErrors({});
        }, 1500);
      } else {
        // Transaction not found in database - still proceed with message
        setVerificationMessage(
          "📝 Payment code received. Our admin will verify this payment. You can proceed to complete your registration."
        );
        setTimeout(() => {
          setCurrentStep(5);
        }, 2000);
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      // Even if verification fails, allow user to proceed with admin review
      setVerificationMessage(
        "⏳ Payment code recorded. Your payment will be verified by our admin. You may continue with registration."
      );
      setTimeout(() => {
        setCurrentStep(5);
      }, 2000);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFinalSubmit = async () => {
    setIsVerifying(true);
    setApiError(null);

    try {
      const selectedPoolData = pools.find(
        (p) => p.id === formData.selectedPool,
      );

      if (!selectedPoolData) {
        throw new Error("Please select an investment pool");
      }

      const registrationData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        idNumber: formData.idNumber,
        password: formData.password,
        selectedPool: {
          name: selectedPoolData.name,
          fee: selectedPoolData.fee,
        },
        investmentAmount: kesAmount,
        mpesaPhone: formData.mpesaPhone,
        mpesaTransactionCode: formData.mpesaCode,
        digitalSignature: signature,
        agreementSignedAt: new Date(),
      };

      const response =
        await registrationService.completeRegistration(registrationData);
      setRegistrationResult(response.data);
      setCurrentStep(6);
    } catch (error: any) {
      setApiError(error.message || "Registration failed. Please try again.");
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
      case 5:
        isValid = validateStep5();
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      if (currentStep === 5) {
        await handleFinalSubmit();
      } else {
        setCurrentStep((prev) => Math.min(prev + 1, 6));
        setErrors({});
        setTouched({});
      }
    } else {
      const allFields = [
        "fullName",
        "email",
        "phone",
        "idNumber",
        "password",
        "confirmPassword",
        "selectedPool",
      ];
      const newTouched: Record<string, boolean> = {};
      allFields.forEach((field) => (newTouched[field] = true));
      setTouched(newTouched);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
    setApiError(null);
    setVerificationMessage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter,_sans-serif']">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-gray-700 hover:text-[#ff444f] transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Home</span>
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
        <section
          className="relative py-12 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${registerBg})` }}
        >
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative max-w-4xl mx-auto px-4 text-center z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Start Your{" "}
              <span className="text-[#ff444f]">Investment Journey</span>
            </h1>
            <p className="text-gray-200">
              Complete the steps below to get started
            </p>
          </div>
        </section>

        {/* Registration Form */}
        <section className="py-8 md:py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <ProgressSteps steps={steps} currentStep={currentStep} />

            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              {/* API Error Display */}
              {apiError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{apiError}</p>
                </div>
              )}

              {/* Verification Message Display */}
              {verificationMessage && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm">{verificationMessage}</p>
                </div>
              )}

              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <BasicDetails
                    formData={formData}
                    errors={errors}
                    touched={touched}
                    onChange={handleChange}
                  />
                )}

                {currentStep === 2 && (
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

                {currentStep === 3 && (
                  <PaymentStep
                    formData={formData}
                    errors={errors}
                    touched={touched}
                    selectedPoolData={selectedPoolData}
                    investmentAmount={kesAmount}
                    fee={0}
                    total={total}
                    onChange={handleChange}
                    onSendPayment={handleSendPayment}
                    formatAmount={formatAmount}
                    isSendingPayment={isSendingPayment}
                  />
                )}

                {currentStep === 4 && (
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

                {currentStep === 5 && (
                  <SignatureStep
                    fullName={formData.fullName}
                    signature={signature}
                    signatureError={signatureError}
                    termsAccepted={termsAccepted}
                    termsError={errors.terms || ""}
                    onSignatureChange={setSignature}
                    onTermsChange={(checked) => {
                      setTermsAccepted(checked);
                      if (checked)
                        setErrors((prev) => ({ ...prev, terms: "" }));
                    }}
                  />
                )}

                {currentStep === 6 && (
                  <SuccessStep
                    referenceNumber={
                      registrationResult?.investment?.reference || "TZX-0000"
                    }
                    fullName={formData.fullName}
                    investmentAmount={kesAmount}
                    selectedPoolName={selectedPoolData?.name || ""}
                    signature={signature}
                    onReturnHome={() => navigate("/")}
                    formatAmount={formatAmount}
                  />
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              {currentStep < 6 && (
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  {currentStep > 1 && (
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <ChevronLeft size={18} /> Back
                    </button>
                  )}

                  {currentStep === 1 && (
                    <button
                      onClick={handleNext}
                      className="ml-auto flex items-center gap-2 bg-[#ff444f] text-white px-8 py-3 rounded-xl hover:bg-[#d43b44] transition-all font-semibold"
                    >
                      Continue <ChevronRight size={18} />
                    </button>
                  )}

                  {currentStep === 2 && (
                    <button
                      onClick={handleNext}
                      className="ml-auto flex items-center gap-2 bg-[#ff444f] text-white px-8 py-3 rounded-xl hover:bg-[#d43b44] transition-all font-semibold"
                    >
                      Continue to Payment <ChevronRight size={18} />
                    </button>
                  )}

                  {currentStep === 5 && (
                    <button
                      onClick={handleNext}
                      disabled={isVerifying}
                      className="ml-auto flex items-center gap-2 bg-[#ff444f] text-white px-8 py-3 rounded-xl hover:bg-[#d43b44] transition-all font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isVerifying ? "Processing..." : "Complete Registration"}
                      {!isVerifying && <ChevronRight size={18} />}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Terms Modal */}
      <AnimatePresence>
        {isTermsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-50"
              onClick={() => setIsTermsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-4 md:inset-8 z-50 flex items-center justify-center pointer-events-none"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-full overflow-hidden pointer-events-auto flex flex-col">
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-white">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-amber-600" />
                    <h2 className="text-lg font-bold text-gray-900">
                      Terms & Conditions
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsTermsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} className="text-gray-600" />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto">
                  <p className="text-sm text-gray-700 mb-4">
                    {termsContent.introduction}
                  </p>
                  {termsContent.sections.map((section, index) => (
                    <div key={index} className="mb-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {section.title}
                      </h3>
                      <p className="text-sm text-gray-600">{section.content}</p>
                    </div>
                  ))}
                  <div className="bg-amber-50 p-4 rounded-xl mt-4">
                    <p className="text-sm text-amber-800">
                      {termsContent.agreement}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsTermsOpen(false)}
                    className="w-full bg-amber-600 text-white py-3 rounded-xl hover:bg-amber-700 transition-colors font-semibold mt-6"
                  >
                    I Have Read and Understand
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* M-Pesa Limit Modal */}
      <MpesaLimitModal
        isOpen={isMpesaLimitOpen}
        onClose={() => setIsMpesaLimitOpen(false)}
      />
    </div>
  );
};

export default Register;