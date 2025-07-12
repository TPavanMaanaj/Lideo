import React, { useState, useEffect } from 'react';
import { Shield, Key, ArrowLeft, Clock, RefreshCw, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SuperAdminTwoFactorAuthProps {
  onBackToCodeLogin: () => void;
  adminId: string;
}

const SuperAdminTwoFactorAuth: React.FC<SuperAdminTwoFactorAuthProps> = ({ 
  onBackToCodeLogin, 
  adminId 
}) => {
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [generatedCode, setGeneratedCode] = useState('');
  const { loginSuperAdminWith2FA, isLoading } = useAuth();

  // Generate unique 2FA code based on admin ID and timestamp
  const generateTwoFactorCode = () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const baseCode = `${adminId}-${timestamp}`;
    
    // Simple hash function to create 6-digit code
    let hash = 0;
    for (let i = 0; i < baseCode.length; i++) {
      const char = baseCode.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Convert to 6-digit code
    const code = Math.abs(hash % 1000000).toString().padStart(6, '0');
    return code;
  };

  useEffect(() => {
    // Generate initial 2FA code
    const code = generateTwoFactorCode();
    setGeneratedCode(code);

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time expired, go back to code login
          onBackToCodeLogin();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [adminId, onBackToCodeLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!twoFactorCode.trim()) {
      setError('2FA code is required');
      return;
    }

    if (twoFactorCode.length !== 6) {
      setError('2FA code must be 6 digits');
      return;
    }

    const success = await loginSuperAdminWith2FA(twoFactorCode, generatedCode);
    if (!success) {
      setError('Invalid 2FA code. Please check your code and try again.');
      setTwoFactorCode('');
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setTwoFactorCode(value);
  };

  const regenerateCode = () => {
    const newCode = generateTwoFactorCode();
    setGeneratedCode(newCode);
    setTimeLeft(300); // Reset timer
    setTwoFactorCode('');
    setError('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
            <Key size={40} className="text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Two-Factor Authentication
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the 6-digit verification code to complete login
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          {/* Timer Display */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-red-600" />
                <span className="text-sm font-medium text-red-800">Code expires in:</span>
              </div>
              <span className="text-lg font-bold text-red-600">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Generated Code Display (for demo purposes) */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-sm font-medium text-green-800">Your 2FA Code:</span>
                </div>
                <p className="text-2xl font-bold font-mono text-green-900 tracking-wider">
                  {generatedCode}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Use this code in the form below
                </p>
              </div>
              <button
                onClick={regenerateCode}
                className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-colors"
                title="Generate new code"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                <Shield size={16} className="text-red-500" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="twoFactorCode" className="block text-sm font-medium text-gray-700 mb-2">
                6-Digit Verification Code
              </label>
              <div className="relative">
                <input
                  id="twoFactorCode"
                  name="twoFactorCode"
                  type="text"
                  required
                  value={twoFactorCode}
                  onChange={handleCodeChange}
                  maxLength={6}
                  className="appearance-none relative block w-full px-4 py-4 pl-12 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:z-10 text-center font-mono text-2xl tracking-widest"
                  placeholder="000000"
                />
                <Key size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <p className="mt-2 text-xs text-gray-500 text-center">
                Enter the 6-digit code shown above
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || twoFactorCode.length !== 6}
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
                    <span>Complete Login</span>
                  </div>
                )}
              </button>
            </div>
          </form>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <button
                onClick={regenerateCode}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors flex items-center space-x-1"
              >
                <RefreshCw size={14} />
                <span>Generate New Code</span>
              </button>
              <span className="text-xs text-gray-500">
                Admin ID: {adminId}
              </span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onBackToCodeLogin}
            className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Access Code</span>
          </button>
        </div>

        <div className="text-center">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Security Information</h4>
            <p className="text-xs text-gray-600">
              This 2FA code is unique to your admin session and expires in 5 minutes. 
              Each code can only be used once for security purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminTwoFactorAuth;