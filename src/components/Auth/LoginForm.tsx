import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import SuperAdminCodeLogin from './SuperAdminCodeLogin';

const LoginForm: React.FC = () => {
  const [showSuperAdminCodeLogin, setShowSuperAdminCodeLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(email, password);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const demoAccounts = [
    { email: 'admin@iitd.ac.in', role: 'University Admin (IIT Delhi)' },
    { email: 'admin@iitb.ac.in', role: 'University Admin (IIT Bombay)' },
    { email: 'admin@iisc.ac.in', role: 'University Admin (IISc Bangalore)' },
    { email: 'student@iitd.ac.in', role: 'Student (IIT Delhi)' },
    { email: 'student@iitb.ac.in', role: 'Student (IIT Bombay)' }
  ];

  if (showSuperAdminCodeLogin) {
    return <SuperAdminCodeLogin onBackToLogin={() => setShowSuperAdminCodeLogin(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center">
            <LogIn size={32} className="text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Learning Management System
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} className="text-gray-400" />
                  ) : (
                    <Eye size={20} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Demo Accounts</h3>
          <div className="space-y-3">
            {demoAccounts.map((account, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{account.role}</p>
                  <p className="text-sm text-gray-600">{account.email}</p>
                </div>
                <button
                  onClick={() => {
                    setEmail(account.email);
                    setPassword('password');
                  }}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Use
                </button>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-500">
            Password for all demo accounts: <code className="bg-gray-100 px-1 py-0.5 rounded">password</code>
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={() => setShowSuperAdminCodeLogin(true)}
            className="inline-flex items-center space-x-2 text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
          >
            <Shield size={16} />
            <span>Super Admin Access</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;