import React, { useState } from 'react';
import { loginUser, signUpUser, loginWithSingpass } from '../services/api';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBack }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nric, setNric] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginUser(email, password);
      if (response.success) {
        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token || '');
        onLoginSuccess();
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await signUpUser(name, email, password, nric);
      if (response.success) {
        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token || '');
        onLoginSuccess();
      } else {
        setError(response.message || 'Sign up failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleSingpassLogin = async () => {
    setError('');
    setLoading(true);

    try {
      // Simulate Singpass OAuth flow
      const response = await loginWithSingpass();
      if (response.success) {
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token || '');
        onLoginSuccess();
      } else {
        setError(response.message || 'Singpass login failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during Singpass login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">MSIG</h1>
          <h2 className="text-xl text-gray-600">
            {isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </h2>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Sign In / Sign Up Form */}
        <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4 mb-6">
          {isSignUp && (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label htmlFor="nric" className="block text-sm font-medium text-gray-700 mb-1">
                  NRIC
                </label>
                <input
                  id="nric"
                  type="text"
                  value={nric}
                  onChange={(e) => setNric(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., S1234567D"
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Singpass Button */}
        <button
          onClick={handleSingpassLogin}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors mb-4 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Login with Singpass
        </button>

        {/* Toggle Sign In / Sign Up */}
        <div className="text-center text-sm">
          {isSignUp ? (
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => setIsSignUp(false)}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => setIsSignUp(true)}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Sign Up
              </button>
            </p>
          )}
        </div>

        {/* Back to Landing */}
        <div className="mt-6 text-center">
          <button
            onClick={onBack}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
