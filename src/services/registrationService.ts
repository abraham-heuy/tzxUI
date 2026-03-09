import api from './api';

export interface RegistrationData {
  fullName: string;
  email: string;
  phone: string;
  idNumber: string;
  password: string;
  selectedPool: {
    name: string;
    fee: number;
  };
  investmentAmount: number;
  mpesaPhone: string;
  mpesaTransactionCode: string;
  digitalSignature: string;
  agreementSignedAt: Date;
}

export interface MpesaInitiateData {
  phoneNumber: string;
  amount: number;
  reference: string;
}

// Clean error messages for frontend
const getErrorMessage = (error: any): string => {
  // If it's an axios error with response from backend
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  // If it's a network error
  if (error.code === 'ERR_NETWORK') {
    return 'Network error. Please check your connection.';
  }
  
  // If it's a timeout
  if (error.code === 'ECONNABORTED') {
    return 'Request timed out. Please try again.';
  }
  
  // Default message - don't expose internal details
  return 'Request failed. Please try again.';
};

export const registrationService = {
  // Step 3: Initiate M-Pesa payment
  initiateMpesaPayment: async (data: MpesaInitiateData) => {
    try {
      const response = await api.post('/register/mpesa/initiate', data);
      return response.data;
    } catch (error: any) {
      // Log the full error on backend only (not sent to frontend)
      console.error('M-Pesa initiation failed:', error);
      
      // Throw clean error message
      throw new Error(getErrorMessage(error));
    }
  },

  // Step 5: Complete registration
  completeRegistration: async (data: RegistrationData) => {
    try {
      const response = await api.post('/register', data);
      return response.data;
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw new Error(getErrorMessage(error));
    }
  },

  // Check registration status
  getRegistrationStatus: async (reference: string) => {
    try {
      const response = await api.get(`/register/status/${reference}`);
      return response.data;
    } catch (error: any) {
      console.error('Status check failed:', error);
      throw new Error(getErrorMessage(error));
    }
  }
};