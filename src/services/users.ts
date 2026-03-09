import api from './api';

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

export interface UserStats {
  overview: {
    totalUsers: number;
    approvedUsers: number;
    pendingUsers: number;
    investors: number;
    admins: number;
    newThisMonth: number;
    newThisWeek: number;
  };
  engagement: {
    usersWithInvestments: number;
    usersWithTickets: number;
    totalInvestments: number;
    totalInvestedAmount: number;
  };
  recentSignups: User[];
}

export interface UserDetails extends User {
  summary: {
    totalInvested: number;
    totalInvestments: number;
    totalTickets: number;
    investmentSummary: Array<{ status: string; count: string; total: string }>;
    ticketSummary: Array<{ status: string; count: string }>;
  };
  recentInvestments: any[];
  recentTickets: any[];
}

export const userService = {
  /**
   * Get all users with pagination
   */
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<{ success: boolean; data: User[]; pagination: any }> => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  /**
   * Get user statistics
   */
  getUserStats: async (): Promise<{ success: boolean; data: UserStats }> => {
    const response = await api.get('/users/stats');
    return response.data;
  },

  /**
   * Get user details by ID
   */
  getUserDetails: async (id: string): Promise<{ success: boolean; data: UserDetails }> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  /**
   * Get users by role
   */
  getUsersByRole: async (roleName: string): Promise<{ success: boolean; data: User[] }> => {
    const response = await api.get(`/users/role/${roleName}`);
    return response.data;
  },

  /**
   * Delete user
   */
  deleteUser: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  /**
   * Disable user
   */
  disableUser: async (id: string): Promise<{ success: boolean; message: string; data: User }> => {
    const response = await api.patch(`/users/${id}/disable`);
    return response.data;
  },
  /**
 * Approve user account
 */
approveUser: async (id: string, adminNotes?: string): Promise<{ success: boolean; message: string; data: User }> => {
  const response = await api.patch(`/users/${id}/approve`, { adminNotes });
  return response.data;
},
};