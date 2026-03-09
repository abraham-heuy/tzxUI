import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string; 
  idNumber: string;
  role: {
    id: number;
    name: string;
  };
  isApproved: boolean;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  totalInvestments?: number;
  totalTickets?: number;
  totalInvested?: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tokens: {
      accessToken: string;
      expiresIn: string;
    };
  };
}

export const authService = {
  /**
   * Login user
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  /**
   * Request password reset email
   */
  forgotPassword: async (data: ForgotPasswordData): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data: ResetPasswordData): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (): Promise<{ success: boolean; data: { accessToken: string; expiresIn: string } }> => {
    const response = await api.post('/auth/refresh-token');
    return response.data;
  },

  /**
   * Get current logged-in user
   */
  getCurrentUser: async (): Promise<{ success: boolean; data: User }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Check authentication status
   */
  checkAuthStatus: async (): Promise<{ success: boolean; authenticated: boolean; data?: User }> => {
    const response = await api.get('/auth/status');
    return response.data;
  },
  changePassword: async (data: ChangePasswordData): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/auth/change-password', data);
    return response.data;
  },
};

export interface ChangePasswordData{
   currentPassword: string;
   newPassword: string

}
