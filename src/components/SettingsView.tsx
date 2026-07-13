import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Eye, Shield, CheckCircle, Mail, AlertTriangle, LogOut } from 'lucide-react';
import { UserSettings } from '../types';

interface SettingsViewProps {
  currentUser: UserSettings;
  onSaveSettings: (updated: UserSettings) => void;
  onLogout: () => void;
}

export default function SettingsView({
  currentUser,
  onSaveSettings,
  onLogout
}: SettingsViewProps) {

  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio);
  const [email, setEmail] = useState(currentUser.email);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [banner, setBanner] = useState(currentUser.banner);
  const [isMatureEnabled, setIsMatureEnabled] = useState(currentUser.isMatureEnabled);
  const [visibility, setVisibility] = useState(currentUser.visibility);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      name,
      username,
      bio,
      email,
      avatar,
      banner,
      isMatureEnabled,
      visibility
    });
    
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Mock avatar options for demo swapping
  const avatarPresets = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-16">
      
      {/* Settings Saved Success Toast */}
      {showToast && (
        <div id="settings-toast" className="fixed top-24 right-6 lg:right-10 bg-violet-950/90 border border-violet-500/30 text-violet-300 px-5 py-4 rounded-xl shadow-2xl backdrop-blur flex items-center gap-3 animate-fade-in z-50">
          <CheckCircle className="w-5 h-5 text-violet-400" />
          <div>
            <p className="text-sm font-semibold">Settings Saved!</p>
            <p className="text-xs text-violet-400/80">Your artist profile has been successfully updated in real-time.</p>
          </div>
        </div>
      )}

      <div>
        <p className="text-xs font-mono tracking-wider text-violet-400 font-semibold uppercase">PREFERENCES MANAGER</p>
        <h3 className="text-xl md:text-2xl font-display font-bold text-white mt-1">User Settings</h3>
        <p className="text-sm text-gray-400 mt-1">
          Customize your display biography, change profile credentials, or manage visual mature filter preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="settings-form">
        
        {/* Left Form: fields (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#101015]/60 border border-white/5 rounded-2xl p-6 md:p-8 space-y-5" id="settings-main-card">
            
            {/* Display name + Username */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-display">Display Name</label>
                <input
                  id="settings-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-display">Username Handle</label>
                <input
                  id="settings-username-input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/50"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-display">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-4 h-4 text-gray-500" />
                <input
                  id="settings-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-violet-500/50"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-display">Short Bio</label>
              <textarea
                id="settings-bio-textarea"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/50 resize-none"
              />
            </div>

            {/* Avatar Swapper */}
            <div className="space-y-3 border-t border-white/5 pt-5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-display block">Swappable Avatar Presets</label>
              <div className="flex gap-4">
                {avatarPresets.map((imgUrl, idx) => {
                  const isActive = avatar === imgUrl;
                  return (
                    <img
                      key={idx}
                      id={`preset-avatar-${idx}`}
                      src={imgUrl}
                      alt="Preset avatar option"
                      onClick={() => setAvatar(imgUrl)}
                      className={`w-14 h-14 rounded-full object-cover cursor-pointer border-2 transition-all ${
                        isActive ? 'border-violet-500 scale-105' : 'border-transparent hover:border-white/25'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Form: Safety preferences (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#101015]/60 border border-white/5 rounded-2xl p-6 space-y-5" id="settings-safety-card">
            
            <h4 className="font-display font-semibold text-sm text-white flex items-center gap-2 border-b border-white/5 pb-3">
              <Shield className="w-4 h-4 text-violet-400" /> Privacy & Filters
            </h4>

            {/* Private Visibility Toggle */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-300">Profile Visibility</p>
              <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/5" id="settings-visibility-pill">
                {(['public', 'private'] as const).map(option => (
                  <button
                    key={option}
                    type="button"
                    id={`btn-settings-visibility-${option}`}
                    onClick={() => setVisibility(option)}
                    className={`flex-1 px-3 py-1.5 text-[11px] font-medium capitalize rounded-md transition-all ${visibility === option ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Mature Filters Toggle */}
            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <div>
                <p className="text-xs font-semibold text-gray-300">Visual Mature content</p>
                <p className="text-[10px] text-gray-500">Enable mature card previews</p>
              </div>
              <button
                type="button"
                id="settings-btn-mature"
                onClick={() => setIsMatureEnabled(!isMatureEnabled)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${isMatureEnabled ? 'bg-pink-500' : 'bg-white/10'}`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${isMatureEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Submit button */}
            <div className="pt-4 border-t border-white/5">
              <button
                type="submit"
                id="settings-btn-submit"
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 text-white font-semibold py-3.5 rounded-xl text-xs transition-all shadow-lg"
              >
                Save Settings Preferences
              </button>
            </div>
          </div>

          {/* Quick Signout action panel */}
          <button
            type="button"
            id="settings-btn-logout"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 rounded-2xl text-red-400 font-semibold text-xs transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Alex Mercer</span>
          </button>
        </div>
      </form>
    </div>
  );
}
