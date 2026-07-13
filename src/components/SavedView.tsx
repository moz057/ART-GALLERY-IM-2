import React from 'react';
import { motion } from 'motion/react';
import { Bookmark, Compass, Heart, Eye } from 'lucide-react';
import { Artwork } from '../types';

interface SavedViewProps {
  artworks: Artwork[];
  onArtworkClick: (id: string) => void;
  onArtistClick: (id: string) => void;
  onExploreClick: () => void;
}

export default function SavedView({
  artworks,
  onArtworkClick,
  onArtistClick,
  onExploreClick
}: SavedViewProps) {

  // Filter artworks where hasFavorited is true
  const savedArtworks = artworks.filter(art => art.hasFavorited);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Page Header info panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <p className="text-xs font-mono tracking-wider text-violet-400 font-semibold uppercase">YOUR BOOKMARKS</p>
          <h3 className="text-xl md:text-2xl font-display font-bold text-white mt-1">Saved Collections</h3>
          <p className="text-sm text-gray-400 mt-1">
            Access and inspect your favorite designs, conceptual sheets, and photos offline.
          </p>
        </div>
        <p className="text-xs text-gray-500 font-mono self-end">
          {savedArtworks.length} bookmarked items
        </p>
      </div>

      {/* Grid gallery */}
      {savedArtworks.length > 0 ? (
        <div id="saved-gallery-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedArtworks.map((art, idx) => (
            <motion.div
              key={art.id}
              id={`saved-card-${art.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: Math.min(idx * 0.02, 0.35) }}
              onClick={() => onArtworkClick(art.id)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer border border-white/5 bg-[#121218] aspect-[3/4] shadow-lg shadow-black/20"
            >
              {/* Image */}
              <img
                src={art.imageUrl}
                alt={art.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Hover overlay metadata */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-mono tracking-wider uppercase bg-violet-600 text-white px-2.5 py-1 rounded-full">
                    {art.category}
                  </span>
                  
                  {/* Bookmark badge indicator */}
                  <div className="w-7 h-7 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500">
                    <Bookmark className="w-3.5 h-3.5 fill-yellow-500" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-display font-medium text-base text-white truncate">
                      {art.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">by {art.artistName}</p>
                  </div>

                  <div className="flex items-center gap-4 text-[10px] font-mono text-gray-400 border-t border-white/10 pt-2.5">
                    <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500/10" /> {art.likesCount}</span>
                    <span className="flex items-center gap-1"><Bookmark className="w-3.5 h-3.5 text-yellow-500" /> {art.favoritesCount}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Empty Saved state placeholder */
        <div className="py-24 text-center max-w-sm mx-auto space-y-5" id="empty-saved-placeholder">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 mx-auto">
            <Bookmark className="w-6 h-6 text-violet-400" />
          </div>
          <div className="space-y-1.5">
            <h4 className="font-display font-semibold text-white">No Saved Artworks</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              When browsing the Feed or Explore pages, tap the bookmark icon to save stunning visual artwork here.
            </p>
          </div>
          <button
            id="btn-saved-go-explore"
            onClick={onExploreClick}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 text-white text-xs font-semibold shadow-md shadow-violet-600/15 inline-flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Go Explore Gallery</span>
          </button>
        </div>
      )}
    </div>
  );
}
