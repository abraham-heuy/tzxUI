import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { authService } from '../services/auth';
import forgotBg from '../assets/register.jpg';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const validateEmail = () => {
    if (!email.trim()) {
      return 'Email is required';
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return 'Valid email is required';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailError = validateEmail();
    if (emailError) {
      setError(emailError);
      setTouched(true);
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await authService.forgotPassword({ email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

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
          style={{ backgroundImage: `url(${forgotBg})` }}
        >
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative max-w-4xl mx-auto px-4 text-center z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Forgot <span className="text-[#ff444f]">Password</span>
              </h1>
              <p className="text-gray-200">We'll send you a reset link</p>
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
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Check Your Email</h2>
                  <p className="text-gray-600 mb-6">
                    We've sent a password reset link to <strong>{email}</strong>
                  </p>
                  <button
                    onClick={() => navigate('/login')}
                    className="text-[#ff444f] font-semibold hover:underline"
                  >
                    Return to Login
                  </button>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setError('');
                          }}
                          onBlur={() => setTouched(true)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#ff444f] focus:border-transparent transition-all outline-none ${
                            touched && error ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="john@example.com"
                        />
                      </div>
                      {touched && error && (
                        <p className="text-red-500 text-xs mt-1">{error}</p>
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
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Reset Link
                          <Send size={18} />
                        </>
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

export default ForgotPassword;