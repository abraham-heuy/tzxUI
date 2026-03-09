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
export interface CreateTransactionData {
  selectedPool: {
    name: string;
    fee: number;
  };
  investmentAmount: number;
  mpesaPhone: string;
  mpesaTransactionCode: string;
  digitalSignature: string;
  agreementSignedAt?: Date;
}

export interface Transaction {
  id: string;
  investmentReference: string;
  poolName: string;
  investmentAmount: number;
  fee: number;
  totalAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  mpesaTransactionCode: string;
  mpesaPhoneNumber: string;
  digitalSignature: string;
  agreementSignedAt: string;
  adminNotes?: string;
  approvedAt?: string;
}

export interface TransactionListItem {
  id: string;
  investmentReference: string;
  poolName: string;
  investmentAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  mpesaTransactionCode: string;
}

export interface CreateTicketData {
  subject: string;
  message: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  investmentId?: string;
  investmentReference?: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
  adminResponse?: string;
  investmentReference?: string;
  user?: {
    fullName: string;
    email: string;
  };
}

export const userService = {
  /**
   * Create a new transaction (for logged-in users)
   */
  createTransaction: async (data: CreateTransactionData): Promise<{ success: boolean; message: string; data: Transaction }> => {
    const response = await api.post('/other/transactions', data);
    return response.data;
  },

  /**
   * Get user's own transactions (list view)
   */
  getMyTransactions: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<{ success: boolean; data: TransactionListItem[]; pagination: any }> => {
    const response = await api.get('/other/transactions/my', { params });
    return response.data;
  },

  /**
   * Create a support ticket (public version - for guests)
   */
  createTicket: async (data: CreateTicketData): Promise<{ success: boolean; message: string; data: any }> => {
    const response = await api.post('/other', data);
    return response.data;
  },

  /**
   * Get user's own tickets (for logged-in users)
   */
  getMyTickets: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<{ success: boolean; data: Ticket[]; pagination: any }> => {
    const response = await api.get('/other/tickets/my', { params });
    return response.data;
  },

  /**
   * Create a ticket for logged-in user (protected version)
   */
  createUserTicket: async (data: CreateTicketData): Promise<{ success: boolean; message: string; data: Ticket }> => {
    const response = await api.post('/other/tickets/user', data);
    return response.data;
  },

  /**
   * Get specific ticket details (user can only access their own)
   */
  getMyTicketDetails: async (id: string): Promise<{ success: boolean; data: Ticket }> => {
    const response = await api.get(`/other/tickets/my/${id}`);
    return response.data;
  },

  /**
   * Get dashboard stats for user
   */
  getDashboardStats: async (): Promise<{ success: boolean; data: any }> => {
    const response = await api.get('/other/dashboard/user');
    return response.data;
  },

  /**
   * Get transaction details by ID (full details)
   */
  getTransactionDetails: async (id: string): Promise<{ success: boolean; data: Transaction }> => {
    const response = await api.get(`/other/transactions/${id}`);
    return response.data;
  },
};