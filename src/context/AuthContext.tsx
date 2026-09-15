import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import AuthService from '../services/authService';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      if (AuthService.isAuthenticated()) {
        return AuthService.getCurrentUser() ?? null;
      }
    } catch {
      console.error('Failed to initialize auth:');
      
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        if (AuthService.isAuthenticated()) {
          const currentUser = AuthService.getCurrentUser();
          if (currentUser && !user) {
            setUser(currentUser);
          }
        } else {
          AuthService.logout();
          setUser(null);
        }
      } catch {
        setUser(null);
      }
      setIsLoading(false);
    };

    const handleLogout = () => {
      setUser(null);
    };

    window.addEventListener('auth:logout', handleLogout);
    initializeAuth();

    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []);
const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await AuthService.login(email, password);

    if (response?.data?.token) {
      const { token, ...userData } = response.data;
      setUser(userData);
      return true;
    }

    return false;
  } catch (error: any) {
    
    throw new Error(error.message || 'Login failed. Please try again.');
  }
};

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};