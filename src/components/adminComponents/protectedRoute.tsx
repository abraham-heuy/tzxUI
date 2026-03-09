import { Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authService } from '../../services/auth';
import { ROLES, type RoleType } from '../../config/roles';

interface ProtectedRouteProps {
  allowedRoles?: RoleType[];
  requireApproved?: boolean;
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  allowedRoles = [], 
  requireApproved = false,
  redirectTo = '/login' 
}: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean | null;
    user: any | null;
    error: string | null;
  }>({
    isAuthenticated: null,
    user: null,
    error: null
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Use getCurrentUser instead of checkAuthStatus to get full user data including isApproved
      const response = await authService.getCurrentUser();
      
      setAuthState({
        isAuthenticated: true,
        user: response.data,
        error: null
      });
    } catch (error: any) {
      console.error('Auth check failed:', error);
      
      let errorMessage = 'Authentication failed';
      if (error.message?.includes('expired')) {
        errorMessage = 'Your session has expired. Please login again.';
      } else if (error.message?.includes('401')) {
        errorMessage = 'Unauthorized access. Please login again.';
      }
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        error: errorMessage
      });
    }
  };

  // Handle logout and redirect to home
  const handleLogoutAndRedirect = async (path: string) => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      navigate(path);
    }
  };

  // Still loading
  if (authState.isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#ff444f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show error and redirect
  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Session Expired</h2>
          <p className="text-gray-600 mb-6">{authState.error || 'Please login again to continue.'}</p>
          <button
            onClick={() => window.location.href = redirectTo}
            className="w-full bg-[#ff444f] text-white py-3 rounded-lg hover:bg-[#d43b44] transition-colors font-semibold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Check role-based access using env roles
  if (allowedRoles.length > 0) {
    const userRole = authState.user?.role;
    let hasAccess = false;
    
    if (allowedRoles.includes(ROLES.ADMIN) && userRole === ROLES.ADMIN) {
      hasAccess = true;
    }
    else if (allowedRoles.includes(ROLES.INVESTOR) && userRole === ROLES.INVESTOR) {
      hasAccess = true;
    }
    
    if (!hasAccess) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Unauthorized Access</h2>
            <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
            <button
              onClick={() => handleLogoutAndRedirect('/')}
              className="w-full bg-[#ff444f] text-white py-3 rounded-lg hover:bg-[#d43b44] transition-colors font-semibold"
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }
  }

  // Check if user is approved (for investor routes)
  if (requireApproved && !authState.user?.isApproved) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Account Pending Approval</h2>
          <p className="text-gray-600 mb-6">
            Your account is still pending approval. You'll be able to access your dashboard once an administrator approves your account.
          </p>
          <button
            onClick={() => handleLogoutAndRedirect('/')}
            className="w-full bg-[#ff444f] text-white py-3 rounded-lg hover:bg-[#d43b44] transition-colors font-semibold"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // Authenticated and authorized - render the route
  return <Outlet />;
};

export default ProtectedRoute;