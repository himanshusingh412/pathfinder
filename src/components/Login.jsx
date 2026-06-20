import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { addHistory } from '../utils/history';

export default function Login() {
  const { login, signup, loginWithGoogle } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [uiError, setUiError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (uiError) setUiError('');
  };

  const validate = () => {
    if (isSignup && !formData.name.trim()) {
      setUiError('Name is required for sign up.');
      return false;
    }
    if (!formData.email.trim()) {
      setUiError('Email address is required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setUiError('Please enter a valid email address.');
      return false;
    }
    if (!formData.password) {
      setUiError('Password is required.');
      return false;
    }
    if (formData.password.length < 6) {
      setUiError('Password must be at least 6 characters long.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || loading) return;

    setLoading(true);
    setUiError('');

    try {
      if (isSignup) {
        await signup(formData.email.trim(), formData.password, formData.name.trim());
        // Log action
        await addHistory('signup', `Signed up with email: ${formData.email.trim()}`);
      } else {
        await login(formData.email.trim(), formData.password);
        // Log action
        await addHistory('login', `Logged in via email`);
      }
    } catch (err) {
      console.error(err);
      // Map common Firebase auth errors to readable messages
      let message = err.message || 'Authentication failed. Please try again.';
      if (message.includes('auth/email-already-in-use')) {
        message = 'This email is already registered. Please login instead.';
      } else if (message.includes('auth/invalid-credential')) {
        message = 'Invalid email or password. Please check your credentials.';
      } else if (message.includes('auth/weak-password')) {
        message = 'Password is too weak. Please use at least 6 characters.';
      } else if (message.includes('auth/user-not-found')) {
        message = 'No account found with this email. Please sign up.';
      } else if (message.includes('auth/wrong-password')) {
        message = 'Incorrect password. Please try again.';
      }
      setUiError(message);
      // Log failed action
      await addHistory(isSignup ? 'signup_failed' : 'login_failed', `Failed auth for ${formData.email.trim()}: ${message}`, 'failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (loading) return;
    setLoading(true);
    setUiError('');

    try {
      await loginWithGoogle();
      await addHistory('login_google', 'Logged in via Google Sign-In');
    } catch (err) {
      console.error(err);
      let message = err.message || 'Google Sign-In failed.';
      if (message.includes('auth/popup-closed-by-user')) {
        message = 'Sign-In popup closed before completion. Please try again.';
      }
      setUiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl p-8 sm:p-10 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Title Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl text-indigo-400 font-extrabold text-2xl mb-3 shadow-inner">
            P
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {isSignup ? 'Create your Account' : 'Welcome to PathfinderAI'}
          </h2>
          <p className="text-slate-400 text-xs mt-1.5">
            {isSignup 
              ? 'Join to discover personalized career roadmaps' 
              : 'Sign in to access your dashboard and roadmap history'}
          </p>
        </div>

        {/* Error Banner */}
        {uiError && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-300 p-3.5 rounded-xl flex items-start space-x-2 text-xs font-medium leading-relaxed animate-fade-in">
            <svg className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{uiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field (Only for signup) */}
          {isSignup && (
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Aarav Sharma"
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl py-3 px-4 text-white text-sm placeholder-slate-700 focus:outline-none transition-all"
                disabled={loading}
              />
            </div>
          )}

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="name@example.com"
              className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl py-3 px-4 text-white text-sm placeholder-slate-700 focus:outline-none transition-all"
              disabled={loading}
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl py-3 px-4 text-white text-sm placeholder-slate-700 focus:outline-none transition-all"
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center mt-6 shadow-lg shadow-indigo-600/20 disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none border border-transparent disabled:border-slate-800"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Processing...</span>
              </div>
            ) : (
              isSignup ? 'Sign Up' : 'Sign In'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <span className="relative px-3 bg-slate-900 text-xs font-semibold text-slate-550 uppercase tracking-wider">Or continue with</span>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          disabled={loading}
          className="w-full bg-slate-950/40 hover:bg-slate-900 border border-slate-800 hover:border-slate-750 active:scale-[0.98] text-slate-350 hover:text-white font-medium py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center space-x-2.5 shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Google Sign In</span>
        </button>

        {/* Toggle link */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-400">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setUiError('');
              }}
              className="text-indigo-450 hover:text-indigo-400 font-semibold focus:outline-none underline decoration-indigo-500/30 hover:decoration-indigo-500 transition-colors"
            >
              {isSignup ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
