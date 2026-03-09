import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Frown } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-['Inter,_sans-serif'] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Header with gradient */}
          <div className="h-32 bg-gradient-to-r from-[#ff444f] to-[#d43b44] relative">
            <div className="absolute inset-0 bg-black/10" />
          </div>

          {/* Content */}
          <div className="px-6 py-8 sm:p-10 text-center">
            {/* Sad Face Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative -mt-20 mb-6"
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-2xl shadow-xl flex items-center justify-center mx-auto border-4 border-[#ff444f]/20">
                <Frown className="w-12 h-12 sm:w-16 sm:h-16 text-[#ff444f]" />
              </div>
            </motion.div>

            {/* Error Code */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-4"
            >
              <span className="text-sm font-semibold text-[#ff444f] bg-[#ff444f]/10 px-4 py-1.5 rounded-full">
                404 Error
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3"
            >
              Oops! Page Not Found
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 mb-8 text-sm sm:text-base"
            >
              The page you're looking for doesn't exist or has been moved. 
              Let's get you back on track!
            </motion.p>

            {/* Illustration */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                  <span className="w-2 h-2 bg-[#ff444f] rounded-full"></span>
                  <span className="w-2 h-2 bg-[#ff444f]/60 rounded-full"></span>
                  <span className="w-2 h-2 bg-[#ff444f]/30 rounded-full"></span>
                  <span className="mx-2">→</span>
                  <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                  <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                  <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  The page you requested could not be found
                </p>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all transform hover:scale-105"
              >
                <ArrowLeft size={18} />
                Go Back
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#ff444f] text-white rounded-xl hover:bg-[#d43b44] transition-all transform hover:scale-105 font-semibold shadow-lg hover:shadow-xl"
              >
                <Home size={18} />
                Back to Home
              </button>
            </motion.div>

            {/* Help Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-xs text-gray-400 mt-6"
            >
              If you believe this is a mistake, please contact our support team.
            </motion.p>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500">
              © {new Date().getFullYear()} TZX Trading. All rights reserved.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;