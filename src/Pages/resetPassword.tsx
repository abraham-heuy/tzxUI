import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { authService } from '../services/auth';
import resetBg from '../assets/register.jpg';

const ResetPassword = () => {
  const navigate = useNavigate(); 
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenError, setTokenError] = useState('');

  useEffect(() => {
    if (!token) {
      setTokenError('Invalid or missing reset token');
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setTokenError('Invalid reset token');
      return;
    }
    
    if (!validateForm()) {
      const newTouched: Record<string, boolean> = {};
      ['password', 'confirmPassword'].forEach(field => newTouched[field] = true);
      setTouched(newTouched);
      return;
    }
    
    setIsLoading(true);
    
    try {
      await authService.resetPassword({
        token,
        newPassword: formData.password
      });
      setSuccess(true);
    } catch (err: any) {
      setErrors({ form: err.message || 'Failed to reset password' });
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid Token</h2>
          <p className="text-gray-600 mb-4">{tokenError}</p>
          <button
            onClick={() => navigate('/forgot-password')}
            className="text-[#ff444f] font-semibold hover:underline"
          >
            Request new reset link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter,_sans-serif']">
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button 
              onClick={() => navigate('/login')} 
              className="flex items-center gap-2 text-gray-700 hover:text-[#ff444f] transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Login</span>
            </button>
            <div className="flex-shrink-0 ml-auto">
              <h1 className="text-2xl font-bold text-[#ff444f]">
                TZX<span className="text-gray-900">Trading</span>
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        <section 
          className="relative py-20 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${resetBg})` }}
        >
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative max-w-4xl mx-auto px-4 text-center z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Reset <span className="text-[#ff444f]">Password</span>
              </h1>
              <p className="text-gray-200">Enter your new password</p>
            </motion.div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="max-w-md mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
            >
              {success ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Password Reset!</h2>
                  <p className="text-gray-600 mb-6">
                    Your password has been successfully reset.
                  </p>
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-[#ff444f] text-white px-6 py-3 rounded-xl hover:bg-[#d43b44] transition-all font-semibold"
                  >
                    Login Now
                  </button>
                </div>
              ) : (
                <>
                  {errors.form && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-red-600">{errors.form}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
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
                          onChange={handleChange}
                          onBlur={() => setTouched(prev => ({ ...prev, confirmPassword: true }))}
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

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#ff444f] text-white py-4 rounded-xl hover:bg-[#d43b44] transition-all font-semibold flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Resetting...
                        </>
                      ) : (
                        'Reset Password'
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ResetPassword;