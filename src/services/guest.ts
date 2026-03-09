import api from './api';

export interface GuestTicketData {
  subject: string;
  message: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  investmentReference?: string;
}

export const guestService = {
  /**
   * Create a support ticket as a guest (no account)
   */
  createGuestTicket: async (data: GuestTicketData): Promise<{ success: boolean; message: string; data: any }> => {
    const response = await api.post('/other', data);
    return response.data;
  },

  /**
   * Get tickets by guest email
   */
  getTicketsByEmail: async (email: string): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get(`/other/tickets/guest/${encodeURIComponent(email)}`);
    return response.data;
  }
};