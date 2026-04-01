// src/components/adminComponents/transactions/NewTransactionModal.tsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, DollarSign, Phone, FileText, AlertCircle } from 'lucide-react';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: NewTransactionData) => Promise<void>;
  isLoading: boolean;
}

export interface NewTransactionData {
  fullName: string;
  email: string;
  phone: string;
  idNumber: string;
  password: string;
  selectedPool: {
    name: string;
    fee: number;
  };
  investmentAmount: number;
  mpesaPhone: string;
  mpesaTransactionCode: string;
  digitalSignature: string;
  agreementSignedAt: Date;
}

const pools = [
  { name: 'Starter Pool', fee: 0.02, usdAmount: 20 },
  { name: 'Basic Pool', fee: 0.025, usdAmount: 50 },
  { name: 'Growth Pool', fee: 0.03, usdAmount: 100 },
  { name: 'Premium Pool', fee: 0.035, usdAmount: 300 },
  { name: 'Elite Pool', fee: 0.04, usdAmount: 750 }
];

const NewTransactionModal = ({ isOpen, onClose, onCreate, isLoading }: NewTransactionModalProps) => {
  const [formData, setFormData] = useState<NewTransactionData>({
    fullName: '',
    email: '',
    phone: '',
    idNumber: '',
    password: '',
    selectedPool: pools[0],
    investmentAmount: 0,
    mpesaPhone: '',
    mpesaTransactionCode: '',
    digitalSignature: '',
    agreementSignedAt: new Date()
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'investmentAmount' ? parseFloat(value) || 0 : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pool = pools.find(p => p.name === e.target.value);
    if (pool) {
      setFormData(prev => ({ ...prev, selectedPool: pool }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Valid email is required';
    if (!formData.phone.trim() || !/^\+?254\d{9}$/.test(formData.phone.replace(/\s/g, '')))
      newErrors.phone = 'Valid Kenyan phone number required';
    if (!formData.idNumber.trim() || !/^\d{5,8}$/.test(formData.idNumber))
      newErrors.idNumber = 'Valid ID number required';
    if (!formData.password || formData.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters';
    if (!formData.mpesaPhone.trim() || !/^\+?254\d{9}$/.test(formData.mpesaPhone.replace(/\s/g, '')))
      newErrors.mpesaPhone = 'Valid M-Pesa phone number required';
    if (!formData.mpesaTransactionCode.trim())
      newErrors.mpesaTransactionCode = 'M-Pesa transaction code is required';
    if (!formData.digitalSignature.trim())
      newErrors.digitalSignature = 'Digital signature is required';
    if (formData.investmentAmount <= 0)
      newErrors.investmentAmount = 'Investment amount must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await onCreate({
        ...formData,
        agreementSignedAt: new Date()
      });
      onClose();
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        idNumber: '',
        password: '',
        selectedPool: pools[0],
        investmentAmount: 0,
        mpesaPhone: '',
        mpesaTransactionCode: '',
        digitalSignature: '',
        agreementSignedAt: new Date()
      });
    } catch (error) {
      console.error('Failed to create transaction:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">New Investment</h2>
                <p className="text-xs text-gray-500">Create a new investment manually</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* User Details Section */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User size={16} className="text-[#ff444f]" />
                User Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent"
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent"
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent"
                    placeholder="254712345678"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID Number *
                  </label>
                  <input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent"
                    placeholder="12345678"
                  />
                  {errors.idNumber && <p className="text-red-500 text-xs mt-1">{errors.idNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent"
                    placeholder="••••••••"
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
              </div>
            </div>

            {/* Investment Details Section */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <DollarSign size={16} className="text-[#ff444f]" />
                Investment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pool *
                  </label>
                  <select
                    name="selectedPool"
                    value={formData.selectedPool.name}
                    onChange={handlePoolChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent"
                  >
                    {pools.map(pool => (
                      <option key={pool.name} value={pool.name}>{pool.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Investment Amount (KES) *
                  </label>
                  <input
                    type="number"
                    name="investmentAmount"
                    value={formData.investmentAmount}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent"
                    placeholder="0"
                  />
                  {errors.investmentAmount && <p className="text-red-500 text-xs mt-1">{errors.investmentAmount}</p>}
                </div>
              </div>
            </div>

            {/* Payment Details Section */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Phone size={16} className="text-[#ff444f]" />
                Payment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    M-Pesa Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="mpesaPhone"
                    value={formData.mpesaPhone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent"
                    placeholder="254712345678"
                  />
                  {errors.mpesaPhone && <p className="text-red-500 text-xs mt-1">{errors.mpesaPhone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    M-Pesa Transaction Code *
                  </label>
                  <input
                    type="text"
                    name="mpesaTransactionCode"
                    value={formData.mpesaTransactionCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent"
                    placeholder="QAL123456789"
                  />
                  {errors.mpesaTransactionCode && <p className="text-red-500 text-xs mt-1">{errors.mpesaTransactionCode}</p>}
                </div>
              </div>
            </div>

            {/* Signature Section */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText size={16} className="text-[#ff444f]" />
                Digital Signature
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Signature (Full Name) *
                </label>
                <input
                  type="text"
                  name="digitalSignature"
                  value={formData.digitalSignature}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent"
                  placeholder="John Doe"
                />
                {errors.digitalSignature && <p className="text-red-500 text-xs mt-1">{errors.digitalSignature}</p>}
              </div>
            </div>

            {/* Info Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle size={16} className="text-blue-500 mt-0.5" />
              <p className="text-xs text-blue-700">
                This will create a new user and investment. The user will receive an email notification once approved.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-[#ff444f] text-white px-4 py-2 rounded-lg hover:bg-[#d43b44] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Investment'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NewTransactionModal;