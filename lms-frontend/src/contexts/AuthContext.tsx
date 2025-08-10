import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserDTO } from '../types';
import axios from 'axios';

const API_URL = 'http://localhost:8082/api';

interface AuthContextType {
  user: UserDTO | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginSuperAdminWith2FA: (userCode: string, generatedCode: string) => Promise<boolean>;
  addUniversity: (universityData: any) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:8082/api/auth/login',
        null,
        { params: { email, password } }
      );
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return true;
      
    } catch (err) {
      console.error('Login failed', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginSuperAdminWith2FA = async (userCode: string, generatedCode: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await axios.post('/auth/superadmin-login', { userCode, generatedCode });
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      localStorage.setItem('superAdmin2FA', userCode);
      return true;
    } catch (error) {
      console.error('2FA Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const addUniversity = async (universityData: any): Promise<boolean> => {
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/universities/adduniversity`, universityData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      return true;
    } catch (error) {
      console.error('Add university error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('superAdmin2FA');
  };

  return (
    <AuthContext.Provider value={{ user, login, loginSuperAdminWith2FA, addUniversity, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};