import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertCircle, Loader2, ExternalLink } from 'lucide-react';

const DerivViewer = () => {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [, setLoading] = useState(true);

  const token = searchParams.get('token');
  const reference = searchParams.get('ref');

  useEffect(() => {
    if (!token) {
      setError('No token provided');
      setLoading(false);
      return;
    }

    // Decode the token
    const decodedToken = decodeURIComponent(token);
    
    // Redirect to Deriv with the token
    // This is the actual redirect - the token is passed via URL but encoded
    window.location.href = `https://app.deriv.com/?token=${decodedToken}`;
    
    // If the redirect doesn't work (popup blocker), show a button
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [token]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = '/dashboard/trading-monitor'}
            className="bg-[#ff444f] text-white px-6 py-2 rounded-lg hover:bg-[#d43b44] transition-colors"
          >
            Back to Trading Monitor
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-[#ff444f] animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Redirecting to your trading account...</p>
        {reference && (
          <p className="text-sm text-gray-500 mt-2">Reference: {reference}</p>
        )}
        <button
          onClick={() => {
            if (token) {
              window.location.href = `https://app.deriv.com/?token=${decodeURIComponent(token)}`;
            }
          }}
          className="mt-6 inline-flex items-center gap-2 text-[#ff444f] hover:underline"
        >
          <ExternalLink size={16} />
          Click here if not redirected automatically
        </button>
      </div>
    </div>
  );
};

export default DerivViewer;