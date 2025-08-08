import React, { useState } from 'react';
import { Shield, Key, ArrowLeft, Lock } from 'lucide-react';
import SuperAdminTwoFactorAuth from './SuperAdminTwoFactorAuth';

interface SuperAdminCodeLoginProps {
  onBackToLogin: () => void;
}

const SuperAdminCodeLogin: React.FC<SuperAdminCodeLoginProps> = ({ onBackToLogin }) => {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [showTwoFactorAuth, setShowTwoFactorAuth] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!accessCode.trim()) {
      setError('Access code is required');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call to validate access code
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validate access code (demo code: SUPERADMIN2024KEY)
    if (accessCode === 'SUPERADMIN2024KEY') {
      // Generate unique admin ID for this session
      const uniqueAdminId = `SA-${Date.now().toString().slice(-6)}`;
      setAdminId(uniqueAdminId);
      setShowTwoFactorAuth(true);
      setIsLoading(false);
    } else {
      setError('Invalid access code. Please check your code and try again.');
      setAccessCode('');
      setIsLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setAccessCode(value);
  };

  // Show 2FA page if access code was valid
  if (showTwoFactorAuth) {
    return (
      <SuperAdminTwoFactorAuth 
        onBackToCodeLogin={() => {
          setShowTwoFactorAuth(false);
          setAccessCode('');
          setAdminId('');
        }}
        adminId={adminId}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
            <Shield size={40} className="text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Super Admin Access
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your secure access code to continue
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                <Lock size={16} className="text-red-500" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-2">
                Super Admin Access Code
              </label>
              <div className="relative">
                <input
                  id="accessCode"
                  name="accessCode"
                  type="text"
                  required
                  value={accessCode}
                  onChange={handleCodeChange}
                  maxLength={16}
                  className="appearance-none relative block w-full px-4 py-3 pl-12 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:z-10 text-center font-mono text-lg tracking-widest"
                  placeholder="ENTER-ACCESS-CODE"
                />
                <Key size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <p className="mt-2 text-xs text-gray-500 text-center">
                Enter the 16-character access code provided by the system administrator
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || !accessCode.trim()}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Shield size={16} />
                    <span>Access Dashboard</span>
                  </div>
                )}
              </button>
            </div>
          </form>

          <div className="border-t border-gray-200 pt-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Demo Access Code</h3>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div>
                  <p className="text-sm font-mono text-gray-900">SUPERADMIN2024KEY</p>
                  <p className="text-xs text-gray-500">Demo access code for testing</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAccessCode('SUPERADMIN2024KEY')}
                  className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
                >
                  Use
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onBackToLogin}
            className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Regular Login</span>
          </button>
        </div>

        <div className="text-center">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Security Notice</h4>
            <p className="text-xs text-gray-600">
              This is a secure area. All access attempts are logged and monitored. 
              Unauthorized access is strictly prohibited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminCodeLogin;