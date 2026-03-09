import { useState, useEffect } from 'react';
import { authService, type User } from '../services/auth';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await authService.getCurrentUser();
      setUser(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching user:', err);
      setError(err.message || 'Failed to load user data');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return { user, loading, error, refreshUser, logout };
};