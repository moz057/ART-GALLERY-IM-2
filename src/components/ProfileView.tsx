import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Grid, 
  FolderHeart, 
  Info, 
  UserPlus, 
  UserMinus, 
  MessageSquare, 
  Settings, 
  MapPin, 
  Globe, 
  Compass, 
  Wrench 
} from 'lucide-react';
import { Artist, Artwork } from '../types';

interface ProfileViewProps {
  artist: Artist;
  artworks: Artwork[];
  onArtworkClick: (id: string) => void;
  onToggleFollow: (artistId: string) => void;
  isCurrentUser: boolean;
  onEditSettingsClick: () => void;
  onMessageArtist: (artist: Artist) => void;
}

export default function ProfileView({
  artist,
  artworks,
  onArtworkClick,
  onToggleFollow,
  isCurrentUser,
  onEditSettingsClick,
  onMessageArtist
}: ProfileViewProps) {

  const [activeTab, setActiveTab] = useState<'gallery' | 'collections' | 'about'>('gallery');

  // Filter artworks that belong to this artist
  const artistArtworks = artworks.filter(art => art.artistId === artist.id);

  // Filter artworks that this artist has saved/favorited for "Collections"
  // For the demo: let's filter artworks that are marked as favorited
  const favoritedArtworks = artworks.filter(art => art.hasFavorited);

  interface TabItem {
    id: 'gallery' | 'collections' | 'about';
    label: string;
    icon: React.ComponentType<any>;
    count?: number;
  }

  const tabs: TabItem[] = [
    { id: 'gallery', label: 'Art Gallery', icon: Grid, count: artistArtworks.length },
    { id: 'collections', label: 'Collections', icon: FolderHeart, count: isCurrentUser ? favoritedArtworks.length : 3 },
    { id: 'about', label: 'About Artist', icon: Info },
  ];

  return (
    <div className="animate-fade-in pb-16 space-y-6">
      
      {/* Banner + Avatar Panel */}
      <div id="profile-hero-panel" className="relative rounded-3xl overflow-hidden bg-[#0d0d12] border border-white/5 select-none">
        
        {/* Banner */}
        <div className="h-44 md:h-60 w-full relative">
          <img
            src={artist.banner}
            alt="Artist Banner"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-[#0d0d12]/40 to-transparent" />
        </div>

        {/* Detailed Info row */}
        <div className="px-6 md:px-10 pb-8 flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-8 -mt-16 md:-mt-20 relative z-10" id="profile-avatar-row">
          {/* Circular Avatar */}
          <img
            src={artist.avatar}
            alt={artist.name}
            className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-[#0d0d12] shadow-2xl shadow-black/80"
          />

          {/* Bio info content */}
          <div className="flex-1 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 w-full">
            <div className="space-y-1">
              <h3 className="font-display font-bold text-xl md:text-3xl text-white tracking-wide">
                {artist.name}
              </h3>
              <p className="text-xs md:text-sm text-gray-500 font-mono">@{artist.username}</p>
              
              <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-cyan-400" /> Tokyo, JP</span>
                <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-cyan-400" /> portfolio.vivid</span>
              </div>
            </div>

            {/* Profile CTA buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 pt-2" id="profile-actions">
              {isCurrentUser ? (
                <button
                  id="btn-profile-edit-settings"
                  onClick={onEditSettingsClick}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-gray-200 text-xs font-semibold transition-all"
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <>
                  {/* Follow Toggle */}
                  <button
                    id="btn-profile-follow"
                    onClick={() => onToggleFollow(artist.id)}
                    className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg ${
                      artist.isFollowing 
                        ? 'bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 text-gray-300' 
                        : 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white hover:opacity-95 shadow-cyan-600/15'
                    }`}
                  >
                    {artist.isFollowing ? (
                      <>
                        <UserMinus className="w-4 h-4" />
                        <span>Unfollow</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Followers metrics panel */}
        <div id="profile-followers-row" className="border-t border-white/5 px-6 md:px-10 py-4 flex gap-8 text-xs font-mono text-gray-400">
          <div>
            <span className="font-semibold text-white text-sm">{artist.followersCount.toLocaleString()}</span> <span className="text-gray-500">followers</span>
          </div>
          <div>
            <span className="font-semibold text-white text-sm">{artist.followingCount.toLocaleString()}</span> <span className="text-gray-500">following</span>
          </div>
          <div>
            <span className="font-semibold text-white text-sm">{artist.artworksCount.toLocaleString()}</span> <span className="text-gray-500">artworks</span>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-white/5" id="profile-tabs-bar">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`profile-tab-btn-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 text-xs font-semibold font-sans tracking-wide transition-all ${
                isActive 
                  ? 'border-cyan-500 text-cyan-400' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="text-[10px] font-mono font-bold bg-white/5 px-1.5 py-0.5 rounded-full text-gray-400">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Dynamic Tabs Content */}
      <div className="pt-4" id="profile-tab-contents">
        <AnimatePresence mode="wait">
          {activeTab === 'gallery' && (
            /* Gallery grid */
            <motion.div
              key="gallery-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
              id="profile-gallery-grid"
            >
              {artistArtworks.map((art) => (
                <div
                  key={art.id}
                  id={`profile-artwork-${art.id}`}
                  onClick={() => onArtworkClick(art.id)}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer border border-white/5 bg-[#121218] aspect-square shadow"
                >
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  />
                  
                  {/* Quick overlay info */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
                    <p className="text-white text-sm font-semibold truncate">{art.title}</p>
                    <p className="text-[11px] font-mono text-cyan-400 mt-0.5">{art.category}</p>
                  </div>
                </div>
              ))}

              {artistArtworks.length === 0 && (
                <div className="col-span-full py-16 text-center space-y-1">
                  <p className="text-gray-400 text-sm">No artworks published yet.</p>
                  <p className="text-gray-600 text-xs">Share some of your designs to start!</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'collections' && (
            /* Collections grid */
            <motion.div
              key="collections-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              id="profile-collections-grid"
            >
              {isCurrentUser ? (
                /* Real saved favorites collection */
                <div 
                  className="group bg-[#111116]/60 border border-white/5 hover:border-cyan-500/20 rounded-2xl p-5 cursor-pointer transition-all space-y-4"
                  onClick={() => activeTab === 'collections'}
                >
                  {/* Preview Collages */}
                  <div className="grid grid-cols-2 gap-2 h-36 rounded-xl overflow-hidden bg-[#181822]">
                    {favoritedArtworks.slice(0, 4).map((art, i) => (
                      <img 
                        key={art.id} 
                        src={art.imageUrl} 
                        alt="" 
                        className="w-full h-full object-cover opacity-65"
                      />
                    ))}
                    {favoritedArtworks.length === 0 && (
                      <div className="col-span-full h-full flex items-center justify-center text-xs text-gray-500">
                        Folder is empty
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-white">My Favorites</h4>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">{favoritedArtworks.length} items</p>
                  </div>
                </div>
              ) : (
                /* Fake dummy collections */
                ['Character sheets', 'Visual concepts', 'Color studies'].map((folder, idx) => (
                  <div 
                    key={folder}
                    className="group bg-[#111116]/60 border border-white/5 rounded-2xl p-5 cursor-pointer transition-all space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-2 h-36 rounded-xl overflow-hidden bg-[#181822]">
                      {artworks.slice(idx * 4, idx * 4 + 4).map((art) => (
                        <img 
                          key={art.id} 
                          src={art.imageUrl} 
                          alt="" 
                          className="w-full h-full object-cover opacity-60"
                        />
                      ))}
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-white">{folder}</h4>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">4 items</p>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'about' && (
            /* Biography information panel */
            <motion.div
              key="about-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              id="profile-about-panel"
            >
              {/* Bio & Details Column */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#111116]/40 border border-white/5 rounded-2xl p-6 md:p-8 space-y-4">
                  <h4 className="font-display font-semibold text-white text-base">Biography</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {artist.bio}
                  </p>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Over 8 years of creating custom digital layouts, illustrations, and immersive landscapes. Specializing in highly detailed lighting and atmospheric color theories. Inspired by retro cyberpunk design and high-contrast nature themes.
                  </p>
                </div>

                <div className="bg-[#111116]/40 border border-white/5 rounded-2xl p-6 md:p-8 space-y-4">
                  <h4 className="font-display font-semibold text-white text-base">Professional Experience</h4>
                  <div className="space-y-4 text-sm text-gray-400">
                    <div className="border-l-2 border-cyan-500/30 pl-4 py-1">
                      <p className="font-semibold text-white">Lead Concept Illustrator</p>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">CyberEdge Studio • 2022 - Present</p>
                    </div>
                    <div className="border-l-2 border-white/10 pl-4 py-1">
                      <p className="font-semibold text-white">Senior Visual Designer</p>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">Voxel Labs Games • 2018 - 2022</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tools & Details Sidebar Column */}
              <div className="space-y-6">
                <div className="bg-[#111116]/40 border border-white/5 rounded-2xl p-6 space-y-4">
                  <h4 className="font-display font-semibold text-white text-sm flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-cyan-400" /> Software & Hardware
                  </h4>
                  <div className="flex flex-wrap gap-2 pt-1" id="profile-tools-list">
                    {['Photoshop CC', 'Blender 4.0', 'Procreate', 'Wacom Intuos Pro', 'Substance Painter', 'iPad Pro 12.9', 'Figma'].map(tool => (
                      <span key={tool} className="text-xs bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl text-gray-300">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-[#111116]/40 border border-white/5 rounded-2xl p-6 space-y-3 font-mono text-xs text-gray-500">
                  <p className="flex justify-between"><span>Member since:</span> <span className="text-gray-300">July 2023</span></p>
                  <p className="flex justify-between"><span>Profile views:</span> <span className="text-gray-300">452,109</span></p>
                  <p className="flex justify-between"><span>Total Favorites:</span> <span className="text-gray-300">12,492</span></p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
