import React from 'react';
import { motion } from 'motion/react';
import { Heart, MessageSquare, UserPlus, Bookmark, Eye, CheckCheck, Trash2 } from 'lucide-react';
import { Notification } from '../types';

interface NotificationsViewProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
  onArtworkClick: (id: string) => void;
  onArtistClick: (id: string) => void;
  onMarkAllRead: () => void;
}

export default function NotificationsView({
  notifications,
  onMarkRead,
  onClearAll,
  onArtworkClick,
  onArtistClick,
  onMarkAllRead
}: NotificationsViewProps) {

  const getIconForType = (type: Notification['type']) => {
    switch (type) {
      case 'like': return <Heart className="w-4 h-4 text-pink-500 fill-pink-500/10" />;
      case 'comment': return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'follow': return <UserPlus className="w-4 h-4 text-emerald-400" />;
      case 'save': return <Bookmark className="w-4 h-4 text-yellow-500 fill-yellow-500/10" />;
      default: return null;
    }
  };

  const getLabelForType = (type: Notification['type']) => {
    switch (type) {
      case 'like': return 'liked your artwork';
      case 'comment': return 'commented on';
      case 'follow': return 'started following you';
      case 'save': return 'saved your artwork';
      default: return 'interacted with your portfolio';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-3xl mx-auto">
      
      {/* Notifications Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <p className="text-xs font-mono tracking-wider text-violet-400 font-semibold uppercase">ACTIVITY MONITOR</p>
          <h3 className="text-xl md:text-2xl font-display font-bold text-white mt-1">Notifications ({unreadCount} unread)</h3>
        </div>
        
        <div className="flex items-center gap-3">
          {notifications.length > 0 && (
            <>
              <button
                id="btn-mark-all-read"
                onClick={onMarkAllRead}
                className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-gray-300 hover:text-white transition-all select-none"
              >
                <CheckCheck className="w-4 h-4 text-violet-400" />
                <span>Mark All Read</span>
              </button>

              <button
                id="btn-clear-notifications"
                onClick={onClearAll}
                className="flex items-center gap-1.5 px-3 py-2 bg-red-500/5 hover:bg-red-500/10 rounded-xl text-xs font-semibold text-red-400 transition-all select-none"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Notifications Cards Lists */}
      <div className="space-y-3.5" id="notifications-list">
        {notifications.map((notif, idx) => {
          return (
            <motion.div
              key={notif.id}
              id={`notification-card-${notif.id}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: Math.min(idx * 0.02, 0.3) }}
              onClick={() => onMarkRead(notif.id)}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer relative ${
                notif.read 
                  ? 'bg-[#101015]/40 border-white/5' 
                  : 'bg-[#141421]/70 border-violet-500/10 hover:border-violet-500/25'
              }`}
            >
              {/* Left hand details */}
              <div className="flex items-center gap-4 min-w-0 flex-1">
                {/* Visual Action Indicator Badge */}
                <div className="relative">
                  <img
                    src={notif.senderAvatar}
                    alt={notif.senderName}
                    onClick={(e) => {
                      e.stopPropagation();
                      onArtistClick(notif.senderUsername);
                    }}
                    className="w-11 h-11 rounded-full object-cover border border-white/10 hover:border-violet-500"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-black/90 border border-white/10 flex items-center justify-center">
                    {getIconForType(notif.type)}
                  </div>
                </div>

                <div className="min-w-0 flex-1 text-sm text-gray-400">
                  <p className="leading-snug">
                    <span 
                      onClick={(e) => {
                        e.stopPropagation();
                        onArtistClick(notif.senderUsername);
                      }}
                      className="font-semibold text-white hover:text-violet-400 cursor-pointer"
                    >
                      {notif.senderName}
                    </span>{' '}
                    <span>{getLabelForType(notif.type)}</span>{' '}
                    {notif.artworkTitle && (
                      <span 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (notif.artworkId) onArtworkClick(notif.artworkId);
                        }}
                        className="font-medium text-violet-400 hover:underline cursor-pointer"
                      >
                        "{notif.artworkTitle}"
                      </span>
                    )}
                  </p>
                  <span className="text-[10px] text-gray-500 font-mono mt-1 block">{notif.timestamp}</span>
                </div>
              </div>

              {/* Right hand preview thumbnail (if linked to an artwork) */}
              {notif.artworkImage && (
                <div 
                  onClick={() => notif.artworkId && onArtworkClick(notif.artworkId)}
                  className="w-12 h-12 rounded-xl overflow-hidden cursor-pointer border border-white/10 hover:border-violet-500 shrink-0 ml-4 shadow"
                >
                  <img
                    src={notif.artworkImage}
                    alt={notif.artworkTitle || 'Artwork'}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Unread dot indicator marker */}
              {!notif.read && (
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-violet-500" />
              )}
            </motion.div>
          );
        })}

        {notifications.length === 0 && (
          <div className="py-20 text-center space-y-2 bg-[#101015]/20 border border-white/5 rounded-3xl" id="empty-notifications-placeholder">
            <p className="text-gray-400 font-display text-lg">No notifications right now.</p>
            <p className="text-gray-600 text-sm">When artists like, comment, or follow your profile, they will appear here!</p>
          </div>
        )}
      </div>
    </div>
  );
}
