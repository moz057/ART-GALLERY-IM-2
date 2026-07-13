import React from 'react';
import { motion } from 'motion/react';
import { Search, Compass, TrendingUp, Sparkles, User, RefreshCw, X } from 'lucide-react';
import { Artwork, Artist } from '../types';
import { RECENT_SEARCHES, TRENDING_TAGS } from '../data/dummyData';

interface SearchViewProps {
  artworks: Artwork[];
  artists: Artist[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onArtworkClick: (id: string) => void;
  onArtistClick: (id: string) => void;
  onAddSearchHistory?: (query: string) => void;
  recentSearches: string[];
  onClearRecentSearches: () => void;
  onRemoveSearchItem: (item: string) => void;
}

export default function SearchView({
  artworks,
  artists,
  searchQuery,
  onSearchChange,
  onArtworkClick,
  onArtistClick,
  onAddSearchHistory,
  recentSearches,
  onClearRecentSearches,
  onRemoveSearchItem
}: SearchViewProps) {

  // Dynamic filter for matching artworks
  const matchingArtworks = artworks.filter(art => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase();
    return (
      art.title.toLowerCase().includes(q) ||
      art.category.toLowerCase().includes(q) ||
      art.artistName.toLowerCase().includes(q) ||
      art.artistUsername.toLowerCase().includes(q) ||
      art.tags.some(tag => tag.toLowerCase().includes(q))
    );
  });

  // Dynamic filter for matching artists
  const matchingArtists = artists.filter(art => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase();
    return (
      art.name.toLowerCase().includes(q) ||
      art.username.toLowerCase().includes(q) ||
      art.bio.toLowerCase().includes(q)
    );
  });

  const handleSelection = (term: string) => {
    onSearchChange(term);
    if (onAddSearchHistory) {
      onAddSearchHistory(term);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Primary Search Input for Page context */}
      <div id="search-bar-page-container" className="flex flex-col gap-4">
        <div className="relative flex items-center">
          <Search className="absolute left-5 text-gray-500 w-5 h-5" />
          <input
            id="search-page-input"
            type="text"
            placeholder="Search matching tags, title keywords, medium types, or artist handles..."
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
            }}
            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4.5 pl-14 pr-5 text-[14px] text-gray-100 placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all"
          />
          {searchQuery && (
            <button 
              id="clear-search-query-btn"
              onClick={() => onSearchChange('')}
              className="absolute right-5 p-1.5 rounded-full hover:bg-white/5 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {!searchQuery.trim() ? (
        /* Empty/Idle Search suggestions screen */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="search-recommendations-grid">
          
          {/* Left: Recent Searches */}
          <div className="space-y-4" id="recent-searches-box">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-semibold text-sm text-gray-300 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-violet-400" /> Recent Queries
              </h4>
              {recentSearches.length > 0 && (
                <button 
                  id="btn-clear-recents"
                  onClick={onClearRecentSearches}
                  className="text-[10px] font-mono text-gray-500 hover:text-red-400 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              {recentSearches.map((search, idx) => (
                <div 
                  key={`${search}-${idx}`}
                  className="flex items-center justify-between bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 group transition-all"
                >
                  <span 
                    onClick={() => handleSelection(search)}
                    className="text-xs text-gray-400 group-hover:text-violet-400 transition-colors cursor-pointer flex-1"
                  >
                    {search}
                  </span>
                  <button 
                    id={`btn-remove-recent-${idx}`}
                    onClick={() => onRemoveSearchItem(search)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-white/5 text-gray-500 hover:text-white transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {recentSearches.length === 0 && (
                <p className="text-xs text-gray-600 italic">No search history recorded.</p>
              )}
            </div>
          </div>

          {/* Center: Trending Tags */}
          <div className="space-y-4" id="trending-tags-box">
            <h4 className="font-display font-semibold text-sm text-gray-300 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-pink-500" /> Trending Tags
            </h4>

            <div className="flex flex-wrap gap-2.5">
              {TRENDING_TAGS.map((tag) => (
                <button
                  key={tag}
                  id={`trending-tag-${tag}`}
                  onClick={() => handleSelection(tag)}
                  className="px-3.5 py-2 rounded-xl text-xs bg-white/[0.02] border border-white/5 text-gray-400 hover:text-white hover:border-violet-500/20 transition-all font-mono"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Suggested Artists */}
          <div className="space-y-4" id="suggested-artists-box">
            <h4 className="font-display font-semibold text-sm text-gray-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" /> Suggested Artists
            </h4>

            <div className="space-y-3">
              {artists.slice(5, 9).map((artist) => (
                <div
                  key={artist.id}
                  id={`suggested-artist-${artist.id}`}
                  onClick={() => onArtistClick(artist.id)}
                  className="flex items-center gap-3 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 rounded-xl p-3 cursor-pointer transition-all hover:border-white/10 group"
                >
                  <img
                    src={artist.avatar}
                    alt={artist.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/10 group-hover:border-violet-500 transition-colors"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-gray-200 group-hover:text-white truncate">
                      {artist.name}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate">@{artist.username}</p>
                  </div>
                  <User className="w-4 h-4 text-gray-500 group-hover:text-violet-400 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Search results screen */
        <div className="space-y-8" id="search-results-section">
          
          {/* Artists Matching Header */}
          {matchingArtists.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-display font-semibold text-sm text-gray-400 uppercase tracking-widest">
                Artists Matching ({matchingArtists.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {matchingArtists.slice(0, 4).map(artist => (
                  <div
                    key={artist.id}
                    id={`search-artist-result-${artist.id}`}
                    onClick={() => onArtistClick(artist.id)}
                    className="flex items-center gap-3 bg-[#111116] border border-white/5 rounded-xl p-4.5 cursor-pointer hover:border-violet-500/20 transition-all group"
                  >
                    <img
                      src={artist.avatar}
                      alt={artist.name}
                      className="w-11 h-11 rounded-full object-cover border border-white/10 group-hover:border-violet-500 transition-colors"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-white group-hover:text-violet-400 truncate">
                        {artist.name}
                      </p>
                      <p className="text-[10px] text-gray-500 truncate">@{artist.username}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Artworks Matching Grid */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-sm text-gray-400 uppercase tracking-widest">
              Artworks Matching ({matchingArtworks.length})
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {matchingArtworks.map((art) => (
                <div
                  key={art.id}
                  id={`search-artwork-result-${art.id}`}
                  onClick={() => onArtworkClick(art.id)}
                  className="group relative cursor-pointer overflow-hidden rounded-xl bg-[#121218] border border-white/5 aspect-square"
                >
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Quick Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col justify-end p-4">
                    <p className="text-white text-[13px] font-semibold truncate">{art.title}</p>
                    <p className="text-gray-400 text-[10px] truncate">by {art.artistName}</p>
                  </div>
                </div>
              ))}
            </div>

            {matchingArtworks.length === 0 && matchingArtists.length === 0 && (
              <div className="py-20 text-center space-y-2">
                <p className="text-gray-400 font-display text-lg">No matches found for "{searchQuery}"</p>
                <p className="text-gray-600 text-sm">Try typing alternative tags like 'Sci-Fi', 'Nature', 'Traditional Art' or handles.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
