import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { mockUsers, mockUniversities } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginSuperAdminWith2FA: (userCode: string, generatedCode: string) => Promise<boolean>;
  addUniversity: (universityData: any) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const loginSuperAdminWith2FA = async (userCode: string, generatedCode: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validate 2FA code
    if (userCode === generatedCode) {
      const superAdminUser: User = {
        id: '1',
        email: 'superadmin@lms.com',
        name: 'Super Administrator',
        role: 'super_admin',
        createdAt: new Date().toISOString()
      };
      
      setUser(superAdminUser);
      localStorage.setItem('currentUser', JSON.stringify(superAdminUser));
      localStorage.setItem('superAdmin2FA', userCode);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const addUniversity = async (universityData: any): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would make an API call to create the university
    // For now, we'll just simulate success
    setIsLoading(false);
    return true;
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