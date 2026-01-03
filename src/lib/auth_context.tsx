'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { apiClient } from './api_client';

interface StaffUser {
  id: string;
  username: string;
  name: string;
  role?: string;
}

interface AuthContextType {
  user: StaffUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StaffUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    // Redirect logic
    if (!isLoading) {
      if (pathname === '/login') {
        // If on login page and already authenticated, redirect to home
        if (user) {
          router.push('/');
        }
      } else {
        // If on any other page and not authenticated, redirect to login
        if (!user) {
          router.push('/login');
        }
      }
    }
  }, [user, isLoading, pathname, router]);

  const checkAuth = async () => {
    try {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('staff_auth_token');
        const userStr = localStorage.getItem('staff_user');

        if (token && userStr) {
          // Verify token is still valid (mock: just check if it exists)
          // In production, this would call an API to verify the token
          try {
            const userData = JSON.parse(userStr);
            setUser(userData);
          } catch (error) {
            // Invalid user data, clear and redirect to login
            localStorage.removeItem('staff_auth_token');
            localStorage.removeItem('staff_user');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.post<{ token: string; user: StaffUser }>('/auth/login', {
        username,
        password,
      });

      if (response.success && response.data) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('staff_auth_token', response.data.token);
          localStorage.setItem('staff_user', JSON.stringify(response.data.user));
        }
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('staff_auth_token');
      localStorage.removeItem('staff_user');
    }
    setUser(null);
    router.push('/login');
  };

  const refresh = async () => {
    try {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('staff_auth_token');
        if (token) {
          // Fetch updated user data from API
          const response = await apiClient.get<StaffUser>('/auth/me');
          if (response.success && response.data) {
            const userData = response.data;
            localStorage.setItem('staff_user', JSON.stringify(userData));
            setUser(userData);
          } else {
            // Fallback to localStorage if API fails
            await checkAuth();
          }
        } else {
          await checkAuth();
        }
      }
    } catch (error) {
      console.error('Refresh failed:', error);
      // Fallback to localStorage if API fails
      await checkAuth();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

