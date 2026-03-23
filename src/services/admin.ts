import api from './api';

export interface DashboardStats {
  investments: {
    total: number;
    monthly: number;
    count: {
      pending: number;
      approved: number;
      rejected: number;
      total: number;
    };
  };
  users: {
    total: number;
    newThisMonth: number;
  };
  tickets: {
    open: number;
    inProgress: number;
    resolved: number;
    total: number;
  };
}

export interface ActivityItem {
  id: string;
  type: 'investment' | 'ticket' | 'user';
  action: string;
  reference: string;
  status: string;
  user: string;
  time: string;
  amount?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface DerivTokenTransaction {
  id: string;
  investmentReference: string;
  user: {
    fullName: string;
    email: string;
  };
  investmentAmount: number;
  poolName: string;
  derivToken: string | null;
  tokenAssignedAt: string | null;
  tokenNotes: string | null;
  createdAt: string;
}

export interface AssignDerivTokenResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    investmentReference: string;
    derivToken: string;
    tokenAssignedAt: string;
  };
}

export const adminService = {
  /**
   * Get dashboard statistics
   */
  getDashboardStats: async (): Promise<{ success: boolean; data: DashboardStats }> => {
    const response = await api.get('/other/dashboard/stats');
    return response.data;
  },

  /**
   * Get recent activity
   */
  getRecentActivity: async (): Promise<{ success: boolean; data: ActivityItem[] }> => {
    const response = await api.get('/other/dashboard/activity');
    return response.data;
  },

  /**
   * Get all transactions (admin)
   */
  getTransactions: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<PaginatedResponse<any>> => {
    const response = await api.get('/other/transactions', { params });
    return response.data;
  },

  /**
   * Get transaction details
   */
  getTransactionDetails: async (id: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.get(`/other/transactions/${id}`);
    return response.data;
  },

  /**
   * Approve transaction
   */
  approveTransaction: async (id: string, adminNotes?: string): Promise<{ success: boolean; message: string; data: any }> => {
    const response = await api.patch(`/other/transactions/${id}/approve`, { adminNotes });
    return response.data;
  },

  /**
   * Reject transaction
   */
  rejectTransaction: async (id: string, adminNotes?: string): Promise<{ success: boolean; message: string; data: any }> => {
    const response = await api.patch(`/other/transactions/${id}/reject`, { adminNotes });
    return response.data;
  },

  /**
   * Get all tickets (admin)
   */
  getTickets: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<PaginatedResponse<any>> => {
    const response = await api.get('/other/tickets', { params });
    return response.data;
  },

  /**
   * Get ticket details
   */
  getTicketDetails: async (id: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.get(`/other/tickets/${id}`);
    return response.data;
  },

  /**
   * Respond to ticket
   */
  respondToTicket: async (id: string, response: string): Promise<{ success: boolean; message: string; data: any }> => {
    const res = await api.post(`/other/tickets/${id}/respond`, { response });
    return res.data;
  },

  /**
   * Resolve ticket
   */
  resolveTicket: async (id: string): Promise<{ success: boolean; message: string; data: any }> => {
    const response = await api.patch(`/other/tickets/${id}/resolve`);
    return response.data;
  },

  /**
   * Close ticket
   */
  closeTicket: async (id: string): Promise<{ success: boolean; message: string; data: any }> => {
    const response = await api.patch(`/other/tickets/${id}/close`);
    return response.data;
  },

  // ============ DERIV TOKEN ROUTES ============

  /**
   * Assign Deriv token to a transaction (Admin only)
   */
  assignDerivToken: async (transactionId: string, token: string, notes?: string): Promise<AssignDerivTokenResponse> => {
    const response = await api.patch(`/other/transactions/${transactionId}/deriv-token`, { token, notes });
    return response.data;
  },

  /**
   * Update Deriv token for a transaction (Admin only)
   */
  updateDerivToken: async (transactionId: string, token: string, notes?: string): Promise<AssignDerivTokenResponse> => {
    const response = await api.put(`/other/transactions/${transactionId}/deriv-token`, { token, notes });
    return response.data;
  },

  /**
   * Get all transactions with Deriv tokens (Admin only)
   */
  getTransactionsWithTokens: async (params?: {
    page?: number;
    limit?: number;
    hasToken?: boolean;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<PaginatedResponse<DerivTokenTransaction>> => {
    const response = await api.get('/other/transactions/tokens', { params });
    return response.data;
  },

  /**
   * Test Deriv token connection (Admin only)
   */
  testDerivToken: async (token: string): Promise<{ success: boolean; message: string; account?: any }> => {
    const response = await api.post('/other/deriv/test-token', { token });
    return response.data;
  }
};