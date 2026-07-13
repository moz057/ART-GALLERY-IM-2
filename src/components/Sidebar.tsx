import React from 'react';
import { 
  Home, 
  Compass, 
  Grid, 
  Upload, 
  MessageSquare, 
  Bell, 
  Bookmark, 
  User, 
  Settings, 
  LogOut, 
  LogIn, 
  Palette
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  unreadNotificationsCount: number;
  unreadMessagesCount: number;
  isLoggedIn: boolean;
  onLogout: () => void;
  onLoginClick: () => void;
}

export default function Sidebar({
  currentView,
  onViewChange,
  unreadNotificationsCount,
  unreadMessagesCount,
  isLoggedIn,
  onLogout,
  onLoginClick
}: SidebarProps) {
  
  const navItems = [
    { id: 'home', label: 'Home Feed', icon: Home },
    { id: 'explore', label: 'Explore Grid', icon: Compass },
    { id: 'categories', label: 'Categories', icon: Grid },
    { id: 'upload', label: 'Upload Art', icon: Upload, authRequired: true },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationsCount, authRequired: true },
    { id: 'saved', label: 'Saved Art', icon: Bookmark, authRequired: true },
    { id: 'profile', label: 'Artist Profile', icon: User, authRequired: true },
    { id: 'settings', label: 'User Settings', icon: Settings, authRequired: true },
  ];

  const handleNavClick = (id: string, authRequired?: boolean) => {
    if (authRequired && !isLoggedIn) {
      onLoginClick();
    } else {
      onViewChange(id);
    }
  };

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside id="desktop-sidebar" className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[#0c0c11]/90 backdrop-blur-xl border-r border-white/5 p-6 z-40 select-none">
        {/* Brand Logo */}
        <div 
          id="brand-logo"
          onClick={() => onViewChange('home')} 
          className="flex items-center gap-3 cursor-pointer group mb-10"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-500 flex items-center justify-center glow-accent transition-all duration-300 group-hover:scale-105">
            <Palette className="w-5.5 h-5.5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg leading-none bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              VIVID
            </h1>
            <span className="text-[10px] tracking-widest text-cyan-400 font-mono">GALLERY</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1.5" id="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || (item.id === 'profile' && currentView === 'artist-profile');
            
            return (
              <button
                key={item.id}
                id={`sidebar-item-${item.id}`}
                onClick={() => handleNavClick(item.id, item.authRequired)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-sans text-[14px] font-medium transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-gradient-to-r from-cyan-600/15 to-teal-600/5 text-cyan-400 border border-cyan-500/10 shadow-sm shadow-cyan-500/5' 
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-cyan-400' : 'text-gray-400 group-hover:text-white'}`} />
                <span>{item.label}</span>
                
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-auto bg-cyan-600 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ring-2 ring-[#0c0c11]">
                    {item.badge}
                  </span>
                )}

                {isActive && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-cyan-500 rounded-r-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Auth Footer */}
        <div className="pt-4 border-t border-white/5" id="sidebar-auth-footer">
          {isLoggedIn ? (
            <button
              id="sidebar-btn-logout"
              onClick={onLogout}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-sans text-[14px] font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          ) : (
            <button
              id="sidebar-btn-login"
              onClick={onLoginClick}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl font-sans text-[14px] font-semibold bg-gradient-to-r from-cyan-600 to-teal-600 text-white hover:opacity-90 transition-all duration-200 shadow-md shadow-cyan-600/20"
            >
              <LogIn className="w-4.5 h-4.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav id="mobile-bottom-nav" className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0c0c11]/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-4 z-40 select-none pb-safe">
        {navItems.filter(item => ['home', 'explore', 'upload', 'notifications'].includes(item.id)).map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => handleNavClick(item.id, item.authRequired)}
              className="relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-150"
            >
              <Icon className={`w-5.5 h-5.5 ${isActive ? 'text-cyan-400 scale-105' : 'text-gray-400'}`} />
              
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-2 right-2 bg-cyan-600 text-white text-[9px] font-mono font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-[#0c0c11]">
                  {item.badge}
                </span>
              )}

              {isActive && (
                <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-cyan-500" />
              )}
            </button>
          );
        })}
        
        {/* Additional Toggle button for Profile/Menu */}
        <button
          id="mobile-nav-profile-toggle"
          onClick={() => handleNavClick(isLoggedIn ? 'profile' : 'login')}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-150`}
        >
          <User className={`w-5.5 h-5.5 ${['profile', 'settings', 'saved', 'artist-profile', 'login', 'register'].includes(currentView) ? 'text-cyan-400 scale-105' : 'text-gray-400'}`} />
          {['profile', 'settings', 'saved', 'artist-profile', 'login', 'register'].includes(currentView) && (
            <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-cyan-500" />
          )}
        </button>
      </nav>
    </>
  );
}
