// Get role names from environment variables with fallbacks
export const ROLES = {
  ADMIN: import.meta.env.VITE_ADMIN_ROLE_NAME || 'nicetry',
  INVESTOR: import.meta.env.VITE_INVESTOR_ROLE_NAME || 'nicetry'
} as const;

// Type for role values - this will be either 'bossy' or 'investor' (or whatever you set in .env)
export type RoleType = typeof ROLES[keyof typeof ROLES];

// Helper function to check if a role matches
export const isRole = (userRole: string | undefined, allowedRole: RoleType): boolean => {
  return userRole === allowedRole;
};

// Helper to check if user is admin
export const isAdmin = (role: string | undefined): boolean => {
  return role === ROLES.ADMIN;
};

// Helper to check if user is investor
export const isInvestor = (role: string | undefined): boolean => {
  return role === ROLES.INVESTOR;
};