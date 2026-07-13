import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, Palette, AlertCircle } from 'lucide-react';

interface RegisterViewProps {
  onRegisterSuccess: () => void;
  onLoginClick: () => void;
}

export default function RegisterView({
  onRegisterSuccess,
  onLoginClick
}: RegisterViewProps) {

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setErrorText('Please fill in all requested fields.');
      return;
    }
    
    setErrorText('');
    setLoading(true);

    // Simulate signup latency
    setTimeout(() => {
      setLoading(false);
      onRegisterSuccess();
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto py-8 animate-fade-in" id="register-form-container">
      <div className="bg-[#101015]/80 border border-white/5 rounded-3xl p-8 md:p-10 space-y-6 shadow-2xl shadow-black/80 backdrop-blur-xl">
        
        {/* Top Header branding info */}
        <div className="text-center select-none space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-600 to-pink-500 flex items-center justify-center glow-accent mx-auto">
            <Palette className="w-6.5 h-6.5 text-white" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-white">Join Vivid Gallery</h3>
            <p className="text-xs text-gray-500 mt-1">Publish artworks, follow artists, and explore design concepts.</p>
          </div>
        </div>

        {/* Inputs form fields */}
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          
          {/* Display Name */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider font-display">Display Name</label>
            <div className="relative flex items-center">
              <User className="absolute left-4 w-4 h-4 text-gray-500" />
              <input
                id="register-name-input"
                type="text"
                placeholder="Elena Rostova"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-violet-500/50"
              />
            </div>
          </div>

          {/* Username Handle */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider font-display">Username handle</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-xs font-mono text-gray-500">@</span>
              <input
                id="register-username-input"
                type="text"
                placeholder="elenarostova_art"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 pl-8 pr-4 text-sm text-white focus:outline-none focus:border-violet-500/50 font-mono"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider font-display">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 w-4 h-4 text-gray-500" />
              <input
                id="register-email-input"
                type="email"
                placeholder="elena@rostova.design"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-violet-500/50"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider font-display">Create Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 w-4 h-4 text-gray-500" />
              <input
                id="register-password-input"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-violet-500/50"
              />
            </div>
          </div>

          {/* Warning Messages */}
          {errorText && (
            <div className="flex items-center gap-2 p-3 bg-red-950/40 border border-red-500/10 text-red-400 rounded-xl text-xs" id="register-error-box">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorText}</span>
            </div>
          )}

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              id="register-btn-submit"
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Register Artist Account</span>
              )}
            </button>
          </div>
        </form>

        {/* Switch toggle back to login */}
        <div className="text-center text-xs text-gray-500 border-t border-white/5 pt-5">
          <span>Already have an account?</span>{' '}
          <button 
            id="register-btn-switch-login"
            onClick={onLoginClick}
            className="text-violet-400 hover:underline font-semibold"
          >
            Sign In here
          </button>
        </div>
      </div>
    </div>
  );
}
