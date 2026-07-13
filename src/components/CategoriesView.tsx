import React from 'react';
import { motion } from 'motion/react';
import { Grid, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { Artwork } from '../types';
import { CATEGORIES } from '../data/dummyData';

interface CategoriesViewProps {
  artworks: Artwork[];
  onSelectCategory: (category: string) => void;
}

// Custom curated descriptions for each category
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'Digital Art': 'Futuristic paintings, vector landscapes, and computational artwork created with modern design suites.',
  'Anime': 'Stunning illustrations, character concepts, and manga scenes heavily inspired by modern and classic anime.',
  'Photography': 'Breathtaking landscape, street portrait, and architectural shots capturing cinematic moments in time.',
  'Traditional Art': 'Fascinating scans of offline oil canvases, graphite sketches, acrylic layers, and realistic water paints.',
  'Character Design': 'In-depth conceptual model sheets, anatomy sheets, armor variants, and expressive visual blueprints.',
  'Landscape': 'Stunning nature, alien horizons, majestic mountains, silent waterfalls, and immersive environment paintings.',
  'Fan Art': 'Creative reimagined illustrations paying homage to video game legends, film sagas, and pop culture.',
  'Pixel Art': 'Aesthetic grid-based retro illustrations, detailed isometric structures, and game-inspired sprites.',
  '3D Art': 'Stunning procedural renders, volumetric textures, low-poly environments, and highly polished models.',
  'Architecture': 'Inspiring urban constructs, minimalist futuristic villas, brutalist spaces, and structural drafts.',
  'Vehicles': 'Fierce sportscars, modular sci-fi starfighters, retro locomotive mechanics, and custom cruiser layouts.',
  'Fantasy': 'Ethereal forest spirits, ancient castles, legendary rune circles, griffins, and magical creatures.',
  'Sci-Fi': 'Stunning cybernetic colonies, deep-space stations, stargate machinery, singularity orbits, and android units.',
  'Nature': 'Delicate flora blossom studies, deep-sea coral reefs, macro moss, and high-contrast season shifts.',
  'Food': 'Mouth-watering desserts, rustic dining displays, traditional baking assemblies, and comforting infusions.',
  'Fashion': 'Highly aesthetic vogue silhouettes, haute-couture fabrics, avant-garde draping, and garment portraits.'
};

export default function CategoriesView({
  artworks,
  onSelectCategory
}: CategoriesViewProps) {
  
  // Exclude 'For You' and 'All'
  const activeCategories = CATEGORIES.slice(2);

  const getCountForCategory = (catName: string) => {
    return artworks.filter(art => art.category.toLowerCase() === catName.toLowerCase()).length;
  };

  const getCategoryImage = (catName: string) => {
    const arts = artworks.filter(art => art.category.toLowerCase() === catName.toLowerCase());
    if (arts.length > 0) {
      return arts[0].imageUrl;
    }
    // Fallback beautiful image
    return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500';
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <div>
        <p className="text-xs font-mono tracking-wider text-violet-400 font-semibold uppercase">ART ARCHIVE</p>
        <h3 className="text-xl md:text-2xl font-display font-bold text-white mt-1">Browse by Medium</h3>
        <p className="text-sm text-gray-400 mt-1 max-w-xl">
          Dive directly into specialized galleries curated by our visual community of artists and creators.
        </p>
      </div>

      {/* Grid Layout */}
      <div id="categories-grid" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {activeCategories.map((cat, idx) => {
          const count = getCountForCategory(cat);
          const bgImg = getCategoryImage(cat);
          const desc = CATEGORY_DESCRIPTIONS[cat] || 'Explore gorgeous custom illustrations and artwork representations in our community archive.';

          return (
            <motion.div
              key={cat}
              id={`category-box-${cat.toLowerCase().replace(' ', '-')}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.35) }}
              onClick={() => onSelectCategory(cat)}
              className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer bg-[#101015] border border-white/5 shadow-md hover:border-violet-500/30 transition-all duration-300"
            >
              {/* Background Image with Overlay */}
              <div className="absolute inset-0 z-0">
                <img
                  src={bgImg}
                  alt={cat}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-25 group-hover:opacity-35"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-[#0d0d12]/90 to-transparent" />
              </div>

              {/* Content Panel */}
              <div className="absolute inset-0 z-10 p-5 flex flex-col justify-between" id={`category-panel-body-${cat}`}>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-all">
                    <Grid className="w-4.5 h-4.5" />
                  </div>
                  <span className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400 bg-white/5 border border-white/5 rounded-full px-2.5 py-1">
                    <ImageIcon className="w-3 h-3" /> {count} Artworks
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-display font-semibold text-lg text-white group-hover:text-violet-400 transition-colors flex items-center gap-1">
                    <span>{cat}</span>
                    <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-violet-400" />
                  </h4>
                  <p className="text-[12px] text-gray-400 leading-relaxed line-clamp-2">
                    {desc}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
