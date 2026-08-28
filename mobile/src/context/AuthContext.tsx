import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, UserRole } from '../types';
import { loginWithCredentials, loginAsGuest, fetchCurrentUser, logoutUser } from '../api/auth';
import { getStoredAuthToken, setAuthToken } from '../api/client';

interface AuthContextType extends AuthState {
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginGuest: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isOperator: boolean;
  isStaff: boolean;
  isVisitor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore stored session on launch
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = await getStoredAuthToken();
        if (storedToken) {
          setToken(storedToken);
          const res = await fetchCurrentUser();
          if (res.data?.user) {
            setUser(res.data.user);
          } else {
            // Token expired or invalid
            await setAuthToken(null);
            setToken(null);
          }
        }
      } catch (err) {
        console.warn('Failed to restore session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await loginWithCredentials(email, pass);
      if (res.data?.token && res.data?.user) {
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, error: res.error || 'Invalid credentials' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const loginGuest = async () => {
    setIsLoading(true);
    try {
      const res = await loginAsGuest();
      if (res.data?.token && res.data?.user) {
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, error: res.error || 'Guest login failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Guest login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
    } finally {
      setToken(null);
      setUser(null);
      setIsLoading(false);
    }
  };

  const isOperator = user?.role === 'OPERATOR';
  const isStaff = user?.role === 'STAFF';
  const isVisitor = user?.role === 'VISITOR' || !user;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token && !!user,
        isLoading,
        user,
        token,
        login,
        loginGuest,
        logout,
        isOperator,
        isStaff,
        isVisitor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
