// src/services/registrationService.ts

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

export interface VerifyTransactionData {
  transactionCode: string;
  phoneNumber: string;
  amount: number;
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
      // ✅ Changed: removed /register prefix since routes are at /api/mpesa/initiate
      const response = await api.post('/mpesa/initiate', data);
      return response.data;
    } catch (error: any) {
      console.error('M-Pesa initiation failed:', error);
      throw new Error(getErrorMessage(error));
    }
  },

  // Step 4: Verify M-Pesa transaction
  verifyTransaction: async (data: VerifyTransactionData) => {
    try {
      // ✅ Changed: removed /register prefix
      const response = await api.post('/mpesa/verify', data);
      return response.data;
    } catch (error: any) {
      console.error('Transaction verification failed:', error);
      throw new Error(getErrorMessage(error));
    }
  },

  // Step 5: Complete registration
  completeRegistration: async (data: RegistrationData) => {
    try {
      // ✅ Kept as /register (since route is POST /api/register)
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
      // ✅ Changed: removed /register prefix, now /status/:reference
      const response = await api.get(`/status/${reference}`);
      return response.data;
    } catch (error: any) {
      console.error('Status check failed:', error);
      throw new Error(getErrorMessage(error));
    }
  }, 

  // Check if user exists and has investments
checkUserExists: async (data: { email?: string; phone?: string; idNumber?: string }) => {
  try {
    const response = await api.post('/check-user', data);
    return response.data;
  } catch (error: any) {
    console.error('User check failed:', error);
    throw new Error(getErrorMessage(error));
  }
},
};