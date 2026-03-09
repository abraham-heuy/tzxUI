import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { authService } from '../../services/auth'; // Change from userService to authService

const UserSettings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError(null);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      setTouched({
        currentPassword: true,
        newPassword: true,
        confirmPassword: true
      });
      return;
    }

    setIsLoading(true);
    setApiError(null);
    
    try {
      // Use authService instead of userService
      await authService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      setSuccess(true);
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTouched({});
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      setApiError(error.message || 'Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Account <span className="text-[#ff444f]">Settings</span>
        </h1>
        <p className="text-gray-600 mt-1">Change your password and manage account</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg border border-gray-100">
        {/* Error Message */}
        {apiError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-600">{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>

          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                onBlur={() => setTouched(prev => ({ ...prev, currentPassword: true }))}
                required
                className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent outline-none ${
                  touched.currentPassword && errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {touched.currentPassword && errors.currentPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type={showConfirm ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                onBlur={() => setTouched(prev => ({ ...prev, newPassword: true }))}
                required
                minLength={8}
                className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent outline-none ${
                  touched.newPassword && errors.newPassword ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {touched.newPassword && errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={() => setTouched(prev => ({ ...prev, confirmPassword: true }))}
                required
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent outline-none ${
                  touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg">
              <CheckCircle size={16} />
              <span className="text-sm">Password changed successfully!</span>
            </div>
          )}

          {/* Password Requirements */}
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <p className="font-medium mb-1">Password requirements:</p>
            <ul className="list-disc list-inside space-y-1">
              <li className={formData.newPassword.length >= 8 ? 'text-green-600' : ''}>
                At least 8 characters long
              </li>
              <li className={/[A-Z]/.test(formData.newPassword) ? 'text-green-600' : ''}>
                At least one uppercase letter
              </li>
              <li className={/[0-9]/.test(formData.newPassword) ? 'text-green-600' : ''}>
                At least one number
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#ff444f] text-white py-3 rounded-lg hover:bg-[#d43b44] transition-colors disabled:bg-gray-300 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save size={16} />
                Change Password
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default UserSettings;