import React, { useState } from 'react';
import { Wallet, Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useAuth } from '../../context/AuthContext';

type AuthMode = 'login' | 'register' | 'forgot' | 'reset';

interface AuthViewProps {
  onBackToLanding: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onBackToLanding }) => {
  const { login, register } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (mode === 'register' && !name.trim()) {
      errs.name = 'Full name is required.';
    }

    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (mode !== 'forgot') {
      if (!password) {
        errs.password = 'Password is required.';
      } else if (password.length < 6) {
        errs.password = 'Password must be at least 6 characters.';
      }
    }

    if (mode === 'register' && password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    if (!validate()) return;

    setIsLoading(true);
    try {
      if (mode === 'login') {
        await login(email, 'Alex Morgan');
      } else if (mode === 'register') {
        await register(name, email);
      } else if (mode === 'forgot') {
        await new Promise((r) => setTimeout(r, 600));
        setSuccessMessage(`Password reset link sent to ${email} (Demo feature)`);
        setMode('reset');
      } else if (mode === 'reset') {
        await new Promise((r) => setTimeout(r, 600));
        setSuccessMessage('Password successfully updated! Please log in.');
        setMode('login');
      }
    } catch (err) {
      setErrors({ general: 'Authentication failed. Please check your inputs.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 light:bg-slate-50 flex items-center justify-center p-4 sm:p-6 bg-grid-pattern relative">
      {/* Back button */}
      <button
        onClick={onBackToLanding}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white light:hover:text-gray-900 transition-colors"
      >
        ← Back to Home
      </button>

      <div className="w-full max-w-md bg-gray-900/90 light:bg-white border border-gray-800 light:border-gray-200 rounded-3xl p-8 shadow-2xl backdrop-blur-xl animate-fade-in my-8">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 mb-3">
            <Wallet className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-white light:text-gray-900 tracking-tight">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'register' && 'Create Your Account'}
            {mode === 'forgot' && 'Reset Password'}
            {mode === 'reset' && 'Set New Password'}
          </h2>
          <p className="text-xs text-gray-400 light:text-gray-500 mt-1">
            {mode === 'login' && 'Enter your credentials to access your financial dashboard'}
            {mode === 'register' && 'Join thousands managing their money with SmartBudget'}
            {mode === 'forgot' && "Enter your email and we'll send reset instructions"}
            {mode === 'reset' && 'Choose a strong password for your account'}
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-6 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'register' && (
            <Input
              label="Full Name *"
              placeholder="e.g. Alex Morgan"
              icon={<User className="w-4 h-4" />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />
          )}

          <Input
            label="Email Address *"
            type="email"
            placeholder="alex@smartbudget.app"
            icon={<Mail className="w-4 h-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          {mode !== 'forgot' && (
            <Input
              label={mode === 'reset' ? 'New Password *' : 'Password *'}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              endIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />
          )}

          {mode === 'register' && (
            <Input
              label="Confirm Password *"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
            />
          )}

          {/* Remember Me & Forgot link for login */}
          {mode === 'login' && (
            <div className="flex items-center justify-between text-xs my-1">
              <label className="flex items-center gap-2 text-gray-400 light:text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-gray-800 border-gray-700 text-indigo-600 focus:ring-indigo-500"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => {
                  setMode('forgot');
                  setErrors({});
                  setSuccessMessage(null);
                }}
                className="text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            icon={<ArrowRight className="w-4 h-4" />}
            className="w-full mt-2"
          >
            {mode === 'login' && 'Log In'}
            {mode === 'register' && 'Create Account'}
            {mode === 'forgot' && 'Send Reset Link'}
            {mode === 'reset' && 'Update Password'}
          </Button>
        </form>

        {/* Switch Mode Footer */}
        <div className="mt-6 pt-6 border-t border-gray-800 light:border-gray-100 text-center text-xs text-gray-400">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => {
                  setMode('register');
                  setErrors({});
                  setSuccessMessage(null);
                }}
                className="text-indigo-400 font-bold hover:underline cursor-pointer"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => {
                  setMode('login');
                  setErrors({});
                  setSuccessMessage(null);
                }}
                className="text-indigo-400 font-bold hover:underline cursor-pointer"
              >
                Log In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
