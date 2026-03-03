export interface FormData {
    fullName: string;
    email: string;
    phone: string;
    idNumber: string;
    password: string;
    confirmPassword: string;
    selectedPool: string;
    investmentAmount: number;
    mpesaPhone: string;
    mpesaCode: string;
  }
  
  export interface Pool {
    id: string;
    name: string;
    minAmount: number;
    maxAmount: number;
    risk: string;
    returns: string;
    icon: any;
    color: string;
    description: string;
    fee: number;
  }
  
  export interface Step {
    id: number;
    name: string;
    icon: any;
  }