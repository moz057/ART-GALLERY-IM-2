import React from 'react';
import { Search, Bell, MessageSquare, Upload, Sparkles, LogIn, User } from 'lucide-react';
import { UserSettings } from '../types';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentUser: UserSettings;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  unreadNotifications: number;
}

export default function Header({
  currentView,
  onViewChange,
  searchQuery,
  onSearchChange,
  currentUser,
  isLoggedIn,
  onLoginClick,
  unreadNotifications
}: HeaderProps) {

  const getViewTitle = () => {
    switch (currentView) {
      case 'home': return 'For You';
      case 'explore': return 'Explore Gallery';
      case 'categories': return 'Art Categories';
      case 'search': return 'Search Art & Artists';
      case 'upload': return 'Upload New Masterpiece';
      case 'profile':
      case 'artist-profile': return 'Artist Portfolio';
      case 'notifications': return 'Your Notifications';
      case 'messages': return 'Conversations';
      case 'saved': return 'Saved Collections';
      case 'settings': return 'Account Settings';
      case 'artwork-detail': return 'Artwork Showcase';
      case 'login': return 'Welcome Back';
      case 'register': return 'Create Artist Account';
      default: return 'Explore';
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onViewChange('search');
    }
  };

  return (
    <header id="main-header" className="sticky top-0 right-0 left-0 h-20 bg-[#07070a]/75 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 lg:px-10 z-30 select-none">
      {/* Title / Current view label */}
      <div className="flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-cyan-400 hidden sm:block animate-pulse" />
        <h2 className="font-display font-semibold text-lg md:text-xl text-white tracking-wide">
          {getViewTitle()}
        </h2>
      </div>

      {/* Center Search Bar */}
      <div id="header-search-container" className="hidden md:flex items-center max-w-md w-full mx-6 relative">
        <div className="absolute left-4 text-gray-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          id="header-search-input"
          type="text"
          placeholder="Search for tags, artwork names, or artist usernames..."
          value={searchQuery}
          onChange={(e) => {
            onSearchChange(e.target.value);
            if (currentView !== 'search') {
              onViewChange('search');
            }
          }}
          onKeyDown={handleSearchKeyDown}
          className="w-full bg-white/[0.03] border border-white/5 rounded-full py-2.5 pl-11 pr-5 text-[13px] text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.05] transition-all"
        />
      </div>

      {/* Right User Panel / CTA */}
      <div className="flex items-center gap-4" id="header-right-panel">
        {/* Mobile Search Button (Quick jump to search view) */}
        <button
          id="btn-mobile-search-jump"
          onClick={() => onViewChange('search')}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.03] border border-white/5 text-gray-400 hover:text-white"
        >
          <Search className="w-4.5 h-4.5" />
        </button>

        {isLoggedIn ? (
          <>
            {/* Quick Upload CTA */}
            <button
              id="header-btn-upload"
              onClick={() => onViewChange('upload')}
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-cyan-600/10 to-teal-600/10 hover:from-cyan-600/20 hover:to-teal-600/20 text-cyan-400 border border-cyan-500/20 hover:border-cyan-500/40 rounded-full px-4 py-2 text-[12px] font-semibold tracking-wide transition-all duration-200"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload</span>
            </button>

            {/* Notification Badge Shortcut */}
            <button
              id="header-btn-notifications"
              onClick={() => onViewChange('notifications')}
              className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.03] border border-white/5 text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-pink-500 ring-2 ring-[#07070a]" />
              )}
            </button>

            {/* Profile Avatar Trigger */}
            <div 
              id="header-profile-avatar"
              onClick={() => onViewChange('profile')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-cyan-500/20 group-hover:border-cyan-500 transition-all shadow-md shadow-cyan-500/5"
              />
              <div className="hidden lg:block text-left select-none">
                <p className="text-[13px] font-semibold text-white group-hover:text-cyan-400 transition-colors">{currentUser.name}</p>
                <p className="text-[10px] text-gray-500">@{currentUser.username}</p>
              </div>
            </div>
          </>
        ) : (
          <button
            id="header-btn-login"
            onClick={onLoginClick}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-600 to-teal-600 text-white hover:opacity-90 transition-all text-[12px] font-semibold shadow-md shadow-cyan-600/20"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
