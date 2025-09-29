import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, X, Loader2, Mail, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types/api';

interface IntegratedEmailAuthScreenProps {
  onBack: () => void;
  onSuccess: () => void;
  mode?: 'login' | 'register';
  userType?: UserRole;
}

export function IntegratedEmailAuthScreen({ 
  onBack, 
  onSuccess, 
  mode = 'login',
  userType = UserRole.CONSUMER 
}: IntegratedEmailAuthScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [currentMode, setCurrentMode] = useState(mode);

  const { login, register, isLoading, error, clearError } = useAuth();

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    const emailValid = emailRegex.test(email);
    const passwordValid = password.length >= 6;
    
    if (currentMode === 'login') {
      setIsValid(emailValid && passwordValid);
    } else {
      const nameValid = firstName.trim().length > 0 && lastName.trim().length > 0;
      setIsValid(emailValid && passwordValid && nameValid);
    }

    if (email.length > 0 && !emailValid) {
      setHasError(true);
    } else {
      setHasError(false);
    }
  }, [email, password, firstName, lastName, currentMode]);

  useEffect(() => {
    if (error) {
      setHasError(true);
    }
  }, [error]);

  const handleSubmit = async () => {
    if (!isValid) return;
    
    try {
      clearError();
      
      if (currentMode === 'login') {
        await login(email, password);
      } else {
        await register({
          email,
          password,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim() || undefined,
          role: userType,
        });
      }
      
      onSuccess();
    } catch (err: any) {
      console.error('Authentication error:', err);
      setHasError(true);
      
      // If user already exists during registration, suggest switching to login
      if (currentMode === 'register' && err.error === 'User already exists') {
        setTimeout(() => {
          if (window.confirm('This email is already registered. Would you like to switch to login instead?')) {
            setCurrentMode('login');
            setHasError(false);
            clearError();
          }
        }, 1000);
      }
    }
  };

  const getInputBorderColor = () => {
    if (hasError) return '#DC2626';
    if (isFocused) return '#007AFF';
    return '#E5E7EB';
  };

  const getInputBoxShadow = () => {
    if (hasError) return '0 0 0 3px rgba(220, 38, 38, 0.1)';
    if (isFocused) return '0 0 0 3px rgba(0, 122, 255, 0.1)';
    return 'none';
  };

  const toggleMode = () => {
    setCurrentMode(currentMode === 'login' ? 'register' : 'login');
    clearError();
    setHasError(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">
          {currentMode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          {/* Title and Description */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentMode === 'login' ? 'Sign In' : 'Create Your Account'}
            </h2>
            <p className="text-gray-600">
              {currentMode === 'login' 
                ? 'Enter your credentials to access your account'
                : `Join FixRx as a ${userType.toLowerCase()}`
              }
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-red-600 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <div className="space-y-4">
            {/* Name fields for registration */}
            {currentMode === 'register' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none transition-all"
                    style={{
                      borderColor: getInputBorderColor(),
                      boxShadow: getInputBoxShadow(),
                    }}
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none transition-all"
                    style={{
                      borderColor: getInputBorderColor(),
                      boxShadow: getInputBoxShadow(),
                    }}
                    placeholder="Doe"
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none transition-all"
                style={{
                  borderColor: getInputBorderColor(),
                  boxShadow: getInputBoxShadow(),
                }}
                placeholder="john@example.com"
              />
              {hasError && email.length > 0 && !emailRegex.test(email) && (
                <p className="text-red-500 text-sm mt-1">Please enter a valid email address</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none transition-all"
                  style={{
                    borderColor: getInputBorderColor(),
                    boxShadow: getInputBoxShadow(),
                  }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {password.length > 0 && password.length < 6 && (
                <p className="text-red-500 text-sm mt-1">Password must be at least 6 characters</p>
              )}
            </div>

            {/* Phone field for registration */}
            {currentMode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none transition-all"
                  style={{
                    borderColor: getInputBorderColor(),
                    boxShadow: getInputBoxShadow(),
                  }}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            onClick={handleSubmit}
            disabled={!isValid || isLoading}
            className={`w-full mt-8 py-4 rounded-lg font-semibold text-white transition-all ${
              isValid && !isLoading
                ? 'bg-blue-600 hover:bg-blue-700 shadow-lg'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            whileHover={isValid && !isLoading ? { scale: 1.02 } : {}}
            whileTap={isValid && !isLoading ? { scale: 0.98 } : {}}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                {currentMode === 'login' ? 'Signing In...' : 'Creating Account...'}
              </div>
            ) : (
              currentMode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </motion.button>

          {/* Mode Toggle */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              {currentMode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={toggleMode}
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                {currentMode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          {/* Forgot Password */}
          {currentMode === 'login' && (
            <div className="text-center mt-4">
              <button className="text-blue-600 text-sm hover:text-blue-700">
                Forgot your password?
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
