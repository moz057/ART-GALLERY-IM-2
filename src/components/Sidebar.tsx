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
  Palette,
  ShieldAlert
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  unreadNotificationsCount: number;
  unreadMessagesCount: number;
  isLoggedIn: boolean;
  onLogout: () => void;
  onLoginClick: () => void;
  isModerator?: boolean;
  pendingReportsCount?: number;
}

export default function Sidebar({
  currentView,
  onViewChange,
  unreadNotificationsCount,
  unreadMessagesCount,
  isLoggedIn,
  onLogout,
  onLoginClick,
  isModerator,
  pendingReportsCount
}: SidebarProps) {
  
  const navItems: { id: string; label: string; icon: any; authRequired?: boolean; badge?: number }[] = [
    { id: 'home', label: 'Home Feed', icon: Home },
    { id: 'categories', label: 'Categories', icon: Grid },
    { id: 'saved', label: 'Saved Art', icon: Bookmark, authRequired: true },
  ];

  if (isModerator) {
    navItems.push({ 
      id: 'moderator', 
      label: 'Moderator Queue', 
      icon: ShieldAlert, 
      badge: pendingReportsCount,
      authRequired: true 
    });
  }

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
      <aside id="desktop-sidebar" className="hidden lg:flex flex-col w-20 h-screen fixed left-0 top-0 bg-[#0c0c11]/90 backdrop-blur-xl border-r border-white/5 py-6 items-center z-40 select-none">
        {/* Brand Logo */}
        <div 
          id="brand-logo"
          onClick={() => onViewChange('home')} 
          className="cursor-pointer group mb-10"
          title="VIVID Gallery"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-500 flex items-center justify-center glow-accent transition-all duration-300 group-hover:scale-105">
            <Palette className="w-5.5 h-5.5 text-white" />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-3 w-full px-3 flex flex-col items-center" id="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || (item.id === 'profile' && currentView === 'artist-profile');
            
            return (
              <button
                key={item.id}
                id={`sidebar-item-${item.id}`}
                onClick={() => handleNavClick(item.id, item.authRequired)}
                title={item.label}
                className={`w-12 h-12 flex items-center justify-center rounded-xl font-sans text-[14px] font-medium transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-gradient-to-r from-cyan-600/15 to-teal-600/5 text-cyan-400 border border-cyan-500/10 shadow-sm shadow-cyan-500/5' 
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                <Icon className={`w-5.5 h-5.5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-cyan-400' : 'text-gray-400 group-hover:text-white'}`} />
                
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-cyan-600 text-white text-[10px] font-mono font-bold w-5 h-5 flex flex-col justify-center items-center rounded-full ring-2 ring-[#0c0c11]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav id="mobile-bottom-nav" className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0c0c11]/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-4 z-40 select-none pb-safe">
        {navItems.map((item) => {
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
