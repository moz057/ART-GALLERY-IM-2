import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomeView from './components/HomeView';
import ExploreView from './components/ExploreView';
import CategoriesView from './components/CategoriesView';
import SearchView from './components/SearchView';
import UploadView from './components/UploadView';
import ProfileView from './components/ProfileView';
import ArtworkDetailView from './components/ArtworkDetailView';
import NotificationsView from './components/NotificationsView';
import MessagesView from './components/MessagesView';
import SavedView from './components/SavedView';
import SettingsView from './components/SettingsView';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import ModeratorView from './components/ModeratorView';

import { Artist, Artwork, Comment, Notification, Conversation, UserSettings, Message, Report } from './types';
import { 
  generateArtists, 
  generateArtworks, 
  generateNotifications, 
  generateConversations,
  RECENT_SEARCHES
} from './data/dummyData';

export default function App() {
  
  // Auth state - default to true to showcase the rich, stateful dashboard immediately
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentView, setCurrentView] = useState<string>('home');
  
  // Data State
  const [artists, setArtists] = useState<Artist[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(RECENT_SEARCHES);

  // Active item focus states
  const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(null);
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  
  // Reports
  const [reports, setReports] = useState<Report[]>([]);

  // Active filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('For You');

  // Current User settings mapping state
  const [currentUser, setCurrentUser] = useState<UserSettings>({
    name: 'Alex Mercer',
    username: 'alexmercer_art',
    bio: 'Visual artist, designer and storyteller. Seeking the poetic in futuristic, mechanical, and natural landscapes.',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    isMatureEnabled: false,
    visibility: 'public',
    email: 'alex.mercer@vivid.gallery',
    isModerator: true
  });

  // Initialize Data
  useEffect(() => {
    const initialArtists = generateArtists();
    const initialArtworks = generateArtworks(initialArtists);
    const initialNotifications = generateNotifications(initialArtists, initialArtworks);
    const initialConversations = generateConversations(initialArtists);

    setArtists(initialArtists);
    setArtworks(initialArtworks);
    setNotifications(initialNotifications);
    setConversations(initialConversations);
    
    if (initialConversations.length > 0) {
      setActiveConversationId(initialConversations[0].id);
    }
  }, []);

  // Update current view & reset relative state pointers
  const handleViewChange = (view: string) => {
    setCurrentView(view);
    // If we transition back from artwork-detail or profile, let's keep them in memory or wipe
    if (view === 'home' || view === 'explore' || view === 'categories') {
      setSelectedArtworkId(null);
      setSelectedArtistId(null);
    }
    // Set first convo active if switching to messages
    if (view === 'messages' && conversations.length > 0 && !activeConversationId) {
      setActiveConversationId(conversations[0].id);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Click an artwork
  const handleArtworkClick = (id: string) => {
    setSelectedArtworkId(id);
    handleViewChange('artwork-detail');
  };

  // Click an artist
  const handleArtistClick = (idOrUsername: string) => {
    // Check if it's a username (sometimes triggered from notification) or a specific artist ID
    const found = artists.find(a => a.id === idOrUsername || a.username === idOrUsername);
    if (found) {
      setSelectedArtistId(found.id);
    } else {
      setSelectedArtistId(idOrUsername);
    }
    handleViewChange('artist-profile');
  };

  // Toggle Like on an Artwork
  const handleToggleLike = (id: string) => {
    setArtworks(prev => prev.map(art => {
      if (art.id === id) {
        const hasLiked = !art.hasLiked;
        return {
          ...art,
          hasLiked,
          likesCount: art.likesCount + (hasLiked ? 1 : -1)
        };
      }
      return art;
    }));
  };

  // Toggle Save / Favorite on an Artwork
  const handleToggleFavorite = (id: string) => {
    setArtworks(prev => prev.map(art => {
      if (art.id === id) {
        const hasFavorited = !art.hasFavorited;
        
        // Dynamic notification simulator when favorited
        if (hasFavorited) {
          const newNotif: Notification = {
            id: `notif-dyn-${Date.now()}`,
            type: 'save',
            senderName: currentUser.name,
            senderAvatar: currentUser.avatar,
            senderUsername: currentUser.username,
            artworkId: art.id,
            artworkTitle: art.title,
            artworkImage: art.imageUrl,
            timestamp: 'Just now',
            read: false
          };
          setNotifications(prevNotif => [newNotif, ...prevNotif]);
        }

        return {
          ...art,
          hasFavorited,
          favoritesCount: art.favoritesCount + (hasFavorited ? 1 : -1)
        };
      }
      return art;
    }));
  };

  // Toggle Follow an Artist
  const handleToggleFollow = (artistId: string) => {
    setArtists(prev => prev.map(artist => {
      if (artist.id === artistId) {
        const isFollowing = !artist.isFollowing;
        
        // Add follow notification simulation
        if (isFollowing) {
          const newNotif: Notification = {
            id: `notif-dyn-${Date.now()}`,
            type: 'follow',
            senderName: currentUser.name,
            senderAvatar: currentUser.avatar,
            senderUsername: currentUser.username,
            timestamp: 'Just now',
            read: false
          };
          setNotifications(prevNotif => [newNotif, ...prevNotif]);
        }

        return {
          ...artist,
          isFollowing,
          followersCount: artist.followersCount + (isFollowing ? 1 : -1)
        };
      }
      return artist;
    }));
  };

  // Add Comment to an Artwork
  const handleAddComment = (artworkId: string, commentText: string) => {
    setArtworks(prev => prev.map(art => {
      if (art.id === artworkId) {
        const newComment: Comment = {
          id: `comment-dyn-${Date.now()}`,
          artistId: 'user-current',
          artistName: currentUser.name,
          artistAvatar: currentUser.avatar,
          artistUsername: currentUser.username,
          content: commentText,
          timestamp: 'Just now',
          likes: 0
        };

        // Add notification simulation for comment
        const newNotif: Notification = {
          id: `notif-dyn-${Date.now()}`,
          type: 'comment',
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          senderUsername: currentUser.username,
          artworkId: art.id,
          artworkTitle: art.title,
          artworkImage: art.imageUrl,
          timestamp: 'Just now',
          read: false
        };
        setNotifications(prevNotif => [newNotif, ...prevNotif]);

        return {
          ...art,
          commentsCount: art.commentsCount + 1,
          comments: [newComment, ...art.comments]
        };
      }
      return art;
    }));
  };

  // Send Direct Message
  const handleSendMessage = (convoId: string, text: string) => {
    const newMsg: Message = {
      id: `msg-dyn-${Date.now()}`,
      senderId: 'user-current',
      content: text,
      timestamp: 'Just now'
    };

    setConversations(prev => prev.map(convo => {
      if (convo.id === convoId) {
        const updatedMessages = [...convo.messages, newMsg];
        
        // Simulated automated response from the artist partner after 1.5s
        setTimeout(() => {
          const replies = [
            "Wow, I absolutely love that direction. Let's discuss this more tomorrow!",
            "Thanks for reaching out! I'm currently working on my next collection, but I'll check my schedule.",
            "That sounds like an amazing project, let's make it happen!",
            "Thank you Alex! Your support means the world to me.",
            "Let's jump on a virtual sketching workshop session this weekend!"
          ];
          const randomReply = replies[Math.floor(Math.random() * replies.length)];
          const replyMsg: Message = {
            id: `msg-dyn-reply-${Date.now()}`,
            senderId: convo.artist.id,
            content: randomReply,
            timestamp: 'Just now'
          };

          setConversations(currentConvos => currentConvos.map(c => {
            if (c.id === convoId) {
              return {
                ...c,
                messages: [...c.messages, replyMsg],
                unreadCount: activeConversationId === convoId ? 0 : c.unreadCount + 1
              };
            }
            return c;
          }));
        }, 1500);

        return {
          ...convo,
          messages: updatedMessages
        };
      }
      return convo;
    }));
  };

  // Initiate dynamic conversation with an artist from their profile
  const handleMessageArtist = (artist: Artist) => {
    // Check if conversation already exists
    const existingConvo = conversations.find(c => c.artist.id === artist.id);
    if (existingConvo) {
      setActiveConversationId(existingConvo.id);
    } else {
      // Create new conversation state
      const newConvo: Conversation = {
        id: `convo-dyn-${Date.now()}`,
        artist,
        messages: [
          {
            id: `msg-init-${Date.now()}`,
            senderId: artist.id,
            content: `Hey Alex! Thanks for dropping by my portfolio. Let's talk!`,
            timestamp: 'Just now'
          }
        ],
        unreadCount: 0
      };
      setConversations(prev => [newConvo, ...prev]);
      setActiveConversationId(newConvo.id);
    }
    handleViewChange('messages');
  };

  // Publish dynamic local upload artwork
  const handlePublishArtwork = (newArt: { title: string; description: string; category: string; tags: string[]; localImage: string }) => {
    const newRecord: Artwork = {
      id: `artwork-uploaded-${Date.now()}`,
      title: newArt.title,
      imageUrl: newArt.localImage,
      category: newArt.category,
      tags: newArt.tags,
      artistId: 'user-current',
      artistName: currentUser.name,
      artistAvatar: currentUser.avatar,
      artistUsername: currentUser.username,
      likesCount: 0,
      commentsCount: 0,
      favoritesCount: 0,
      viewsCount: 1,
      description: newArt.description,
      createdAt: 'Just now',
      comments: []
    };

    setArtworks(prev => [newRecord, ...prev]);
    
    // Auto redirect to Home Feed so they immediately see their published masterwork
    setTimeout(() => {
      setSelectedCategory('For You');
      handleViewChange('home');
    }, 500);
  };

  // Edit an Artwork
  const handleEditArtwork = (id: string, updatedFields: Partial<Artwork>) => {
    setArtworks(prev => prev.map(art => {
      if (art.id === id) {
        return {
          ...art,
          ...updatedFields
        };
      }
      return art;
    }));
  };

  // Delete an Artwork
  const handleDeleteArtwork = (id: string) => {
    setArtworks(prev => prev.filter(art => art.id !== id));
    if (selectedArtworkId === id) {
      setSelectedArtworkId(null);
      setCurrentView('home');
    }
  };

  // Save Settings Preferences in Real-time
  const handleSaveSettings = (updated: UserSettings) => {
    setCurrentUser(updated);

    // Sync stateful Alex Mercer's mock profile fields in artists list
    setArtists(prev => prev.map(art => {
      if (art.id === 'user-current') {
        return {
          ...art,
          name: updated.name,
          username: updated.username,
          avatar: updated.avatar,
          banner: updated.banner,
          bio: updated.bio
        };
      }
      return art;
    }));

    // Sync all comments and uploaded artworks created by Alex Mercer dynamically
    setArtworks(prev => prev.map(art => {
      let updatedArt = { ...art };
      if (art.artistId === 'user-current') {
        updatedArt.artistName = updated.name;
        updatedArt.artistAvatar = updated.avatar;
        updatedArt.artistUsername = updated.username;
      }
      // Update nested comments
      if (art.comments && art.comments.length > 0) {
        updatedArt.comments = art.comments.map(comment => {
          if (comment.artistId === 'user-current') {
            return {
              ...comment,
              artistName: updated.name,
              artistAvatar: updated.avatar,
              artistUsername: updated.username
            };
          }
          return comment;
        });
      }
      return updatedArt;
    }));
  };

  // Notifications toggles
  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  // Recent Search queries updates
  const handleAddSearchHistory = (query: string) => {
    if (!query.trim()) return;
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== query.toLowerCase());
      return [query, ...filtered].slice(0, 6);
    });
  };

  const handleRemoveSearchHistoryItem = (item: string) => {
    setRecentSearches(prev => prev.filter(s => s !== item));
  };

  const handleClearSearchHistory = () => {
    setRecentSearches([]);
  };

  // Quick logout shortcut helper
  const handleLogout = () => {
    setIsLoggedIn(false);
    handleViewChange('login');
  };

  // Reports Logic
  const handleReportArtwork = (artworkId: string, reason: string) => {
    const newReport: Report = {
      id: `report-${Date.now()}`,
      artworkId,
      reporterId: 'user-current',
      reason,
      timestamp: 'Just now',
      status: 'pending'
    };
    setReports(prev => [newReport, ...prev]);
  };

  const handleResolveReport = (reportId: string) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'resolved' } : r));
  };

  // Find targeted item metadata for detail cards safely
  const focusedArtwork = artworks.find(art => art.id === selectedArtworkId) || artworks[0];
  const focusedArtist = artists.find(art => art.id === selectedArtistId) || artists[0];

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <div className="min-h-screen bg-[#07070a] text-gray-300 font-sans flex" id="app-viewport-wrapper">
      
      {/* Desktop Sidebar + Mobile Bottom Nav */}
      <Sidebar
        currentView={currentView}
        onViewChange={handleViewChange}
        unreadNotificationsCount={unreadNotificationsCount}
        unreadMessagesCount={unreadMessagesCount}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onLoginClick={() => handleViewChange('login')}
        isModerator={currentUser.isModerator}
        pendingReportsCount={reports.filter(r => r.status === 'pending').length}
      />

      {/* Main Content Area Container */}
      <div className="flex-1 lg:pl-20 flex flex-col min-h-screen" id="main-content-scroll-container">
        
        {/* Header bar controls */}
        <Header
          currentView={currentView}
          onViewChange={handleViewChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentUser={currentUser}
          isLoggedIn={isLoggedIn}
          onLoginClick={() => handleViewChange('login')}
          unreadNotifications={unreadNotificationsCount}
          onLogout={handleLogout}
        />

        {/* Dynamic Pages viewport */}
        <main className="flex-1 px-6 lg:px-10 py-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12" id="main-viewport">
          
          {currentView === 'home' && (
            <HomeView
              artworks={artworks}
              artists={artists}
              onArtworkClick={handleArtworkClick}
              onArtistClick={handleArtistClick}
              onToggleLike={handleToggleLike}
              onToggleFavorite={handleToggleFavorite}
              onCategoryFilterChange={(cat) => {
                setSelectedCategory(cat);
                handleViewChange('home');
              }}
              selectedCategory={selectedCategory}
              onAddComment={handleAddComment}
              onToggleFollow={handleToggleFollow}
              onEditArtwork={handleEditArtwork}
              onDeleteArtwork={handleDeleteArtwork}
            />
          )}

          {currentView === 'explore' && (
            <ExploreView
              artworks={artworks}
              onArtworkClick={handleArtworkClick}
              onArtistClick={handleArtistClick}
            />
          )}

          {currentView === 'categories' && (
            <CategoriesView
              artworks={artworks}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                handleViewChange('home');
              }}
            />
          )}

          {currentView === 'search' && (
            <SearchView
              artworks={artworks}
              artists={artists}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onArtworkClick={handleArtworkClick}
              onArtistClick={handleArtistClick}
              onAddSearchHistory={handleAddSearchHistory}
              recentSearches={recentSearches}
              onClearRecentSearches={handleClearSearchHistory}
              onRemoveSearchItem={handleRemoveSearchHistoryItem}
            />
          )}

          {currentView === 'upload' && (
            <UploadView
              onPublish={handlePublishArtwork}
              isLoggedIn={isLoggedIn}
              onLoginClick={() => handleViewChange('login')}
            />
          )}

          {currentView === 'artist-profile' && (
            <ProfileView
              artist={focusedArtist}
              artworks={artworks}
              onArtworkClick={handleArtworkClick}
              onToggleFollow={handleToggleFollow}
              isCurrentUser={focusedArtist.id === 'user-current'}
              onEditSettingsClick={() => handleViewChange('settings')}
              onMessageArtist={handleMessageArtist}
            />
          )}

          {currentView === 'profile' && (
            <ProfileView
              artist={artists.find(a => a.id === 'user-current') || artists[0]}
              artworks={artworks}
              onArtworkClick={handleArtworkClick}
              onToggleFollow={handleToggleFollow}
              isCurrentUser={true}
              onEditSettingsClick={() => handleViewChange('settings')}
              onMessageArtist={handleMessageArtist}
            />
          )}

          {currentView === 'artwork-detail' && focusedArtwork && (
            <ArtworkDetailView
              artwork={focusedArtwork}
              allArtworks={artworks}
              onArtistClick={handleArtistClick}
              onArtworkClick={handleArtworkClick}
              onToggleLike={handleToggleLike}
              onToggleFavorite={handleToggleFavorite}
              onBackClick={() => handleViewChange('home')}
              onAddComment={handleAddComment}
              onReportArtwork={handleReportArtwork}
            />
          )}

          {currentView === 'notifications' && (
            <NotificationsView
              notifications={notifications}
              onMarkRead={handleMarkNotificationRead}
              onClearAll={handleClearAllNotifications}
              onArtworkClick={handleArtworkClick}
              onArtistClick={handleArtistClick}
              onMarkAllRead={handleMarkAllNotificationsRead}
            />
          )}

          {currentView === 'saved' && (
            <SavedView
              artworks={artworks}
              onArtworkClick={handleArtworkClick}
              onArtistClick={handleArtistClick}
              onExploreClick={() => handleViewChange('explore')}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              currentUser={currentUser}
              onSaveSettings={handleSaveSettings}
              onLogout={handleLogout}
            />
          )}

          {currentView === 'moderator' && currentUser.isModerator && (
            <ModeratorView
              reports={reports}
              artworks={artworks}
              onResolveReport={handleResolveReport}
              onArtworkClick={handleArtworkClick}
              onDeleteArtwork={handleDeleteArtwork}
            />
          )}

          {currentView === 'login' && (
            <LoginView
              onLoginSuccess={() => {
                setIsLoggedIn(true);
                handleViewChange('home');
              }}
              onRegisterClick={() => handleViewChange('register')}
            />
          )}

          {currentView === 'register' && (
            <RegisterView
              onRegisterSuccess={() => {
                setIsLoggedIn(true);
                handleViewChange('home');
              }}
              onLoginClick={() => handleViewChange('login')}
            />
          )}

        </main>
      </div>
    </div>
  );
}
