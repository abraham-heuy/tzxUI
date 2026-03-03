import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, Eye, EyeOff, AlertCircle 
} from 'lucide-react';

interface BasicDetailsProps {
  formData: any;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BasicDetails = ({ formData, errors, touched, onChange }: BasicDetailsProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Basic <span className="text-[#ff444f]">Details</span>
      </h2>
      
      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={onChange}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#ff444f] focus:border-transparent transition-all outline-none ${
              touched.fullName && errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="John Doe"
          />
          {touched.fullName && errors.fullName && (
            <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#ff444f] focus:border-transparent transition-all outline-none ${
              touched.email && errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="john@example.com"
          />
          {touched.email && errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#ff444f] focus:border-transparent transition-all outline-none ${
              touched.phone && errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0712345678"
          />
          {touched.phone && errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        {/* ID Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="idNumber"
            value={formData.idNumber}
            onChange={onChange}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#ff444f] focus:border-transparent transition-all outline-none ${
              touched.idNumber && errors.idNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="12345678"
          />
          {touched.idNumber && errors.idNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.idNumber}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={onChange}
              className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-[#ff444f] focus:border-transparent transition-all outline-none ${
                touched.password && errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {touched.password && errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={onChange}
              className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-[#ff444f] focus:border-transparent transition-all outline-none ${
                touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {touched.confirmPassword && errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Password Reminder Note */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
            <p className="text-xs text-amber-700">
              <span className="font-semibold">Remember your password:</span> You'll need it to access your account later. 
              So do not forget it!
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BasicDetails;