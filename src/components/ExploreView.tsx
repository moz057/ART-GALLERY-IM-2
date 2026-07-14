import React from 'react';
import { motion } from 'motion/react';
import { Heart, MessageSquare, Eye } from 'lucide-react';
import { Artwork } from '../types';

interface ExploreViewProps {
  artworks: Artwork[];
  onArtworkClick: (id: string) => void;
  onArtistClick: (id: string) => void;
}

export default function ExploreView({
  artworks,
  onArtworkClick,
  onArtistClick
}: ExploreViewProps) {
  
  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Intro info bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <p className="text-xs font-mono tracking-wider text-violet-400 font-semibold uppercase">CURATED HUB</p>
          <h3 className="text-xl md:text-2xl font-display font-bold text-white mt-1">Discover Limitless Vision</h3>
        </div>
        <p className="text-xs text-gray-500 font-mono self-end">
          Browse through all {artworks.length} masterpiece records
        </p>
      </div>

      {/* Masonry-Style Grid */}
      <div 
        id="explore-masonry-grid" 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {artworks.map((art, index) => {
          return (
            <motion.div
              key={art.id}
              id={`explore-card-${art.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.3) }}
              onClick={() => onArtworkClick(art.id)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-[#121218] border border-white/5 aspect-[3/4] shadow-lg shadow-black/20"
            >
              {/* Image */}
              <img
                src={art.imageUrl}
                alt={art.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Glassmorphic Hover Overlay */}
              <div 
                id={`explore-overlay-${art.id}`}
                className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5"
              >
                {/* Top Overlay Actions */}
                <div className="flex justify-end">
                  <span className="text-[9px] font-mono tracking-wider uppercase bg-violet-600 text-white px-2.5 py-1 rounded-full">
                    {art.category}
                  </span>
                </div>

                {/* Bottom Artist/Title Info */}
                <div className="space-y-3">
                  <div>
                    <h4 className="font-display font-medium text-base text-white truncate drop-shadow">
                      {art.title}
                    </h4>
                    
                    {/* Artist avatar/name row */}
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        onArtistClick(art.artistId);
                      }}
                      className="flex items-center gap-2 mt-1.5 hover:text-violet-300 transition-colors"
                    >
                      <img
                        src={art.artistAvatar}
                        alt={art.artistName}
                        className="w-5.5 h-5.5 rounded-full object-cover border border-white/20"
                      />
                      <span className="text-[12px] text-gray-300 font-medium truncate">
                        {art.artistName}
                      </span>
                    </div>
                  </div>

                  {/* Core Tally Statistics */}
                  <div className="flex items-center gap-4 text-[11px] font-mono text-gray-400 border-t border-white/10 pt-2.5">
                    <span className="flex items-center gap-1">
                      <span className="text-lg w-3.5 h-3.5 text-pink-500 fill-pink-500/10"  >🔥</span> {art.likesCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-400" /> {art.commentsCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-emerald-400" /> {art.viewsCount}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
