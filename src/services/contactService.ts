import api from './api';

export interface ContactMessageData {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactMessage {
  id: string;
  messageReference: string;
  fullName: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  adminResponse: string | null;
  createdAt: string;
  readAt: string | null;
  respondedAt: string | null;
}

export interface ContactStats {
  total: number;
  unread: number;
  read: number;
  replied: number;
  archived: number;
}

export const contactService = {
  /**
   * Submit a contact form (public)
   */
  submitContact: async (data: ContactMessageData): Promise<{ success: boolean; message: string; data: any }> => {
    const response = await api.post('/contact', data);
    return response.data;
  },

  /**
   * Get all contact messages (admin)
   */
  getMessages: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<{ success: boolean; data: ContactMessage[]; pagination: any }> => {
    const response = await api.get('/contact', { params });
    return response.data;
  },

  /**
   * Get a single contact message (admin)
   */
  getMessage: async (id: string): Promise<{ success: boolean; data: ContactMessage }> => {
    const response = await api.get(`/contact/${id}`);
    return response.data;
  },

  /**
   * Reply to a contact message (admin)
   */
  replyToMessage: async (id: string, response: string): Promise<{ success: boolean; message: string; data: ContactMessage }> => {
    const res = await api.post(`/contact/${id}/reply`, { response });
    return res.data;
  },

  /**
   * Mark message as read (admin)
   */
  markAsRead: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch(`/contact/${id}/read`);
    return response.data;
  },

  /**
   * Archive message (admin)
   */
  archiveMessage: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch(`/contact/${id}/archive`);
    return response.data;
  },

  /**
   * Delete message (admin)
   */
  deleteMessage: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/contact/${id}`);
    return response.data;
  },

  /**
   * Get contact statistics (admin)
   */
  getStats: async (): Promise<{ success: boolean; data: ContactStats }> => {
    const response = await api.get('/contact/stats');
    return response.data;
  }
};