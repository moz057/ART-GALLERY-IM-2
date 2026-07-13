import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, LogIn, Palette, AlertCircle } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: () => void;
  onRegisterClick: () => void;
}

export default function LoginView({
  onLoginSuccess,
  onRegisterClick
}: LoginViewProps) {

  const [email, setEmail] = useState('demo_artist@vivid.gallery');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorText('Please fill in both email and password fields.');
      return;
    }
    
    setErrorText('');
    setLoading(true);

    // Simulate login delay
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 1200);
  };

  return (
    <div className="max-w-md mx-auto py-12 animate-fade-in" id="login-form-container">
      <div className="bg-[#101015]/80 border border-white/5 rounded-3xl p-8 md:p-10 space-y-6 shadow-2xl shadow-black/80 backdrop-blur-xl">
        
        {/* Top Logo branding display */}
        <div className="text-center select-none space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-600 to-pink-500 flex items-center justify-center glow-accent mx-auto">
            <Palette className="w-6.5 h-6.5 text-white" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-white">Sign In to Vivid</h3>
            <p className="text-xs text-gray-500 mt-1">Access personalized feed recommendations and save visual art.</p>
          </div>
        </div>

        {/* Inputs form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider font-display">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 w-4 h-4 text-gray-500" />
              <input
                id="login-email-input"
                type="email"
                placeholder="artist@vivid.gallery"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-violet-500/50"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider font-display">Password</label>
              <a href="#forgot" className="text-[10px] font-mono text-violet-400 hover:underline">Forgot password?</a>
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 w-4 h-4 text-gray-500" />
              <input
                id="login-password-input"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-violet-500/50"
              />
            </div>
          </div>

          {/* Form Warning messages */}
          {errorText && (
            <div className="flex items-center gap-2 p-3 bg-red-950/40 border border-red-500/10 text-red-400 rounded-xl text-xs" id="login-error-box">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorText}</span>
            </div>
          )}

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              id="login-btn-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-95 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl text-xs tracking-wide transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4.5 h-4.5" />
                  <span>Sign In as Alex Mercer</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Toggle Switch */}
        <div className="text-center text-xs text-gray-500 border-t border-white/5 pt-5">
          <span>Don't have an account?</span>{' '}
          <button 
            id="login-btn-switch-register"
            onClick={onRegisterClick}
            className="text-violet-400 hover:underline font-semibold"
          >
            Create artist account
          </button>
        </div>
      </div>
    </div>
  );
}
