import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Bookmark, MessageSquare, Share2, Eye, UserPlus, Check, MoreHorizontal } from 'lucide-react';
import { Artwork, Artist } from '../types';
import { CATEGORIES } from '../data/dummyData';

interface HomeViewProps {
  artworks: Artwork[];
  artists: Artist[];
  onArtworkClick: (id: string) => void;
  onArtistClick: (id: string) => void;
  onToggleLike: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onCategoryFilterChange: (category: string) => void;
  selectedCategory: string;
  onAddComment?: (artworkId: string, commentText: string) => void;
  onToggleFollow?: (artistId: string) => void;
  onEditArtwork?: (id: string, updatedFields: Partial<Artwork>) => void;
  onDeleteArtwork?: (id: string) => void;
}

export default function HomeView({
  artworks,
  artists,
  onArtworkClick,
  onArtistClick,
  onToggleLike,
  onToggleFavorite,
  onCategoryFilterChange,
  selectedCategory,
  onAddComment,
  onToggleFollow,
  onEditArtwork,
  onDeleteArtwork
}: HomeViewProps) {
  
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showHeartPop, setShowHeartPop] = useState<{ [id: string]: boolean }>({});
  const [expandedCaptions, setExpandedCaptions] = useState<{ [id: string]: boolean }>({});
  const [commentInputs, setCommentInputs] = useState<{ [id: string]: string }>({});
  
  // Options action dropdown state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Edit artwork modal state
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editTags, setEditTags] = useState('');

  // Close menus on outside click
  useEffect(() => {
    const handleCloseMenu = () => {
      setActiveMenuId(null);
    };
    window.addEventListener('click', handleCloseMenu);
    return () => window.removeEventListener('click', handleCloseMenu);
  }, []);

  // Filter artworks based on selected chip
  const filteredArtworks = artworks.filter(artwork => {
    if (selectedCategory === 'For You' || selectedCategory === 'All') {
      return true; // Show all for core feed simulation
    }
    return artwork.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleShare = (artworkId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCopiedId(artworkId);
    navigator.clipboard.writeText(`${window.location.origin}/artwork/${artworkId}`);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleImageDoubleClick = (artId: string, isLiked: boolean) => {
    if (!isLiked) {
      onToggleLike(artId);
    }
    
    // Trigger pop animation
    setShowHeartPop(prev => ({ ...prev, [artId]: true }));
    setTimeout(() => {
      setShowHeartPop(prev => ({ ...prev, [artId]: false }));
    }, 800);
  };

  const handleCommentSubmit = (e: React.FormEvent, artworkId: string) => {
    e.preventDefault();
    const text = commentInputs[artworkId]?.trim();
    if (!text || !onAddComment) return;
    
    onAddComment(artworkId, text);
    setCommentInputs(prev => ({ ...prev, [artworkId]: '' }));
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArtwork || !onEditArtwork) return;
    
    const splitTags = editTags
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean);

    onEditArtwork(editingArtwork.id, {
      title: editTitle,
      description: editDescription,
      category: editCategory,
      tags: splitTags
    });

    setEditingArtwork(null);
  };

  const renderCaption = (art: Artwork) => {
    const text = art.description || '';
    const isExpanded = expandedCaptions[art.id];
    const threshold = 120;
    const isLong = text.length > threshold;

    return (
      <p className="text-sm text-gray-300 leading-relaxed">
        <span 
          onClick={() => onArtistClick(art.artistId)}
          className="font-bold text-white mr-2 hover:text-cyan-400 cursor-pointer"
        >
          {art.artistUsername}
        </span>
        <span className="font-semibold text-cyan-300 mr-2">"{art.title}"</span>
        <span>
          {isLong && !isExpanded ? `${text.slice(0, threshold)}...` : text}
        </span>
        {isLong && (
          <button
            onClick={() => setExpandedCaptions(prev => ({ ...prev, [art.id]: !isExpanded }))}
            className="text-xs text-gray-500 hover:text-cyan-400 font-semibold ml-1.5 transition-colors"
          >
            {isExpanded ? 'show less' : 'more'}
          </button>
        )}
      </p>
    );
  };

  // Find user-current details to use as inline comment avatar
  const currentUserArtist = artists.find(a => a.id === 'user-current');

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-xl mx-auto">
      
      {/* Horizontal Filter Chips Section */}
      <div id="category-filter-bar" className="relative select-none">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-mono tracking-wider text-cyan-400 font-semibold uppercase">PERSONALIZED FEED</span>
          <span className="text-[11px] text-gray-500 font-mono">Showing {filteredArtworks.length} artworks</span>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 px-1 scroll-smooth no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                id={`filter-chip-${cat.toLowerCase().replace(' ', '-')}`}
                onClick={() => onCategoryFilterChange(cat)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium border transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white border-transparent shadow-md shadow-cyan-600/25 scale-105'
                    : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Instagram-style Feed Container */}
      <div id="home-feed-grid" className="space-y-10">
        <AnimatePresence mode="popLayout">
          {filteredArtworks.slice(0, 32).map((art, index) => { // limit to 32 items to guarantee speed
            const isLiked = art.hasLiked;
            const isFaved = art.hasFavorited;

            // Find if current user follows this artist
            const artistObj = artists.find(a => a.id === art.artistId);
            const isFollowing = artistObj?.isFollowing || false;
            const isMe = art.artistId === 'user-current';

            return (
              <motion.article
                key={art.id}
                id={`artwork-card-${art.id}`}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.25) }}
                className="group flex flex-col bg-[#0d0d12]/90 border border-white/5 rounded-2xl overflow-hidden shadow-2xl shadow-black/40"
              >
                {/* 1. Header: Artist Metadata & Follow CTA */}
                <div className="flex items-center justify-between p-4 border-b border-white/[0.02] select-none bg-[#0e0e14]/50">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={art.artistAvatar}
                      alt={art.artistName}
                      onClick={() => onArtistClick(art.artistId)}
                      className="w-9 h-9 rounded-full object-cover border border-white/10 hover:border-cyan-500 transition-colors cursor-pointer"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p 
                          onClick={() => onArtistClick(art.artistId)}
                          className="text-xs font-bold text-white hover:text-cyan-400 transition-colors cursor-pointer truncate"
                        >
                          {art.artistName}
                        </p>
                        <span className="text-[10px] font-mono tracking-wider bg-cyan-600/10 text-cyan-400 border border-cyan-500/10 px-2 py-0.5 rounded-full shrink-0">
                          {art.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 truncate">@{art.artistUsername}</p>
                    </div>
                  </div>

                  {/* Follow button or options icon */}
                  <div className="flex items-center gap-2 relative">
                    {!isMe && onToggleFollow && (
                      <button
                        onClick={() => onToggleFollow(art.artistId)}
                        className={`text-[11px] font-semibold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 border ${
                          isFollowing 
                            ? 'bg-white/5 border-white/5 hover:bg-white/10 text-gray-300' 
                            : 'bg-cyan-600 hover:bg-cyan-500 border-transparent text-white shadow shadow-cyan-600/20'
                        }`}
                      >
                        {isFollowing ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Following</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3 h-3" />
                            <span>Follow</span>
                          </>
                        )}
                      </button>
                    )}
                    
                    {/* More options button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === art.id ? null : art.id);
                      }}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {/* Simple sleek dropdown */}
                    <AnimatePresence>
                      {activeMenuId === art.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -5 }}
                          className="absolute right-0 top-full mt-1 w-36 bg-[#0f0f15] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 py-1"
                        >
                          {isMe ? (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingArtwork(art);
                                  setEditTitle(art.title);
                                  setEditDescription(art.description || '');
                                  setEditCategory(art.category);
                                  setEditTags(art.tags.join(', '));
                                  setActiveMenuId(null);
                                }}
                                className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors border-b border-white/[0.03]"
                              >
                                Edit Post
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm('Are you sure you want to delete this post?')) {
                                    if (onDeleteArtwork) onDeleteArtwork(art.id);
                                  }
                                  setActiveMenuId(null);
                                }}
                                className="w-full text-left px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                              >
                                Delete Post
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                alert("Artwork reported successfully.");
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              Report post
                            </button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* 2. Image: Full-Width Cinematic aspect-ratio with double-tap like trigger */}
                <div 
                  id={`card-img-container-${art.id}`}
                  onDoubleClick={() => handleImageDoubleClick(art.id, !!isLiked)}
                  className="relative aspect-[4/5] cursor-pointer overflow-hidden bg-[#13131b]"
                >
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    loading="lazy"
                    onClick={() => onArtworkClick(art.id)}
                    className="w-full h-full object-cover transition-transform duration-700 cubic-bezier(0.15, 0.85, 0.45, 1) hover:scale-[1.02]"
                  />
                  
                  {/* Big Heart Overlay Pop on double tap */}
                  <AnimatePresence>
                    {showHeartPop[art.id] && (
                      <motion.div
                        initial={{ scale: 0.3, opacity: 0 }}
                        animate={{ scale: [0.3, 1.25, 1], opacity: [0, 1, 1] }}
                        exit={{ scale: 1.6, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                      >
                        <Heart className="w-24 h-24 text-pink-500 fill-pink-500 filter drop-shadow-2xl" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 3. Interactive Actions Toolbar */}
                <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-white/[0.02]" id={`card-footer-${art.id}`}>
                  <div className="flex items-center gap-4">
                    {/* Like Action */}
                    <button
                      id={`btn-like-${art.id}`}
                      onClick={() => onToggleLike(art.id)}
                      className="p-1 rounded-lg hover:bg-white/5 text-gray-400 hover:text-pink-500 transition-colors"
                      title={isLiked ? "Unlike" : "Like"}
                    >
                      <Heart className={`w-5.5 h-5.5 transition-transform duration-200 active:scale-125 ${isLiked ? 'fill-pink-500 text-pink-500' : ''}`} />
                    </button>

                    {/* Comment Shortcut: Autofocus the inline input box */}
                    <button
                      id={`btn-comment-trigger-${art.id}`}
                      onClick={() => {
                        document.getElementById(`comment-input-${art.id}`)?.focus();
                      }}
                      className="p-1 rounded-lg hover:bg-white/5 text-gray-400 hover:text-blue-400 transition-colors"
                      title="Comment"
                    >
                      <MessageSquare className="w-5.5 h-5.5" />
                    </button>

                    {/* Share Action */}
                    <button
                      id={`btn-share-${art.id}`}
                      onClick={(e) => handleShare(art.id, e)}
                      className="relative p-1 rounded-lg hover:bg-white/5 text-gray-400 hover:text-cyan-400 transition-colors"
                      title="Copy Link"
                    >
                      {copiedId === art.id ? (
                        <Check className="w-5.5 h-5.5 text-emerald-400 animate-bounce" />
                      ) : (
                        <Share2 className="w-5.5 h-5.5" />
                      )}
                      {copiedId === art.id && (
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-cyan-600 text-white text-[10px] rounded font-mono shadow-xl whitespace-nowrap z-20">
                          Copied Link!
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Bookmark Save Action */}
                  <button
                    id={`btn-fav-${art.id}`}
                    onClick={() => onToggleFavorite(art.id)}
                    className="p-1 rounded-lg hover:bg-white/5 text-gray-400 hover:text-yellow-500 transition-colors"
                    title="Save"
                  >
                    <Bookmark className={`w-5.5 h-5.5 transition-transform duration-200 active:scale-125 ${isFaved ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                  </button>
                </div>

                {/* 4. Captions, Tags, Views & Comments Section */}
                <div className="p-4 pt-3 space-y-2.5" id={`card-body-${art.id}`}>
                  {/* Likes and Views counter */}
                  <div className="flex justify-between items-center text-xs font-semibold text-white select-none">
                    <span>{art.likesCount.toLocaleString()} likes</span>
                    <span className="text-gray-500 font-medium flex items-center gap-1 text-[11px]">
                      <Eye className="w-3.5 h-3.5" /> {art.viewsCount.toLocaleString()} views
                    </span>
                  </div>

                  {/* Caption */}
                  <div className="space-y-1">
                    {renderCaption(art)}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5" id={`card-tags-${art.id}`}>
                    {art.tags.map(tag => (
                      <span 
                        key={tag} 
                        onClick={() => onCategoryFilterChange(tag)}
                        className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Comments Preview */}
                  {art.comments && art.comments.length > 0 && (
                    <div className="space-y-1 pt-1.5 border-t border-white/[0.02]">
                      {art.comments.slice(0, 2).map(comment => (
                        <div key={comment.id} className="text-xs text-gray-300">
                          <span 
                            onClick={() => onArtistClick(comment.artistId)}
                            className="font-bold text-white mr-1.5 hover:text-cyan-400 cursor-pointer"
                          >
                            {comment.artistUsername}
                          </span>
                          <span>{comment.content}</span>
                        </div>
                      ))}

                      {art.comments.length > 2 && (
                        <button
                          onClick={() => onArtworkClick(art.id)}
                          className="text-xs font-semibold text-gray-500 hover:text-cyan-400 transition-colors block pt-0.5"
                        >
                          View all {art.commentsCount} comments
                        </button>
                      )}
                    </div>
                  )}

                  {/* Time Stamp label */}
                  <span className="text-[9px] text-gray-500 font-mono uppercase tracking-wider block pt-1">{art.createdAt}</span>
                </div>

                {/* 5. Quick Inline Comment Input Form */}
                {onAddComment && (
                  <form 
                    onSubmit={(e) => handleCommentSubmit(e, art.id)}
                    className="flex items-center gap-3 p-3 border-t border-white/5 bg-[#0e0e14]/30"
                  >
                    <img
                      src={currentUserArtist?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                      alt="Me"
                      className="w-6 h-6 rounded-full object-cover border border-white/10 shrink-0"
                    />
                    <div className="flex-1 relative flex items-center">
                      <input
                        id={`comment-input-${art.id}`}
                        type="text"
                        placeholder="Add a comment..."
                        value={commentInputs[art.id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [art.id]: e.target.value }))}
                        className="w-full bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none pr-8"
                      />
                      <button
                        type="submit"
                        disabled={!commentInputs[art.id]?.trim()}
                        className={`absolute right-1 text-xs font-bold transition-all ${
                          commentInputs[art.id]?.trim() 
                            ? 'text-cyan-400 hover:text-cyan-300' 
                            : 'text-gray-600 pointer-events-none'
                        }`}
                      >
                        Post
                      </button>
                    </div>
                  </form>
                )}
              </motion.article>
            );
          })}
        </AnimatePresence>

        {filteredArtworks.length === 0 && (
          <div className="col-span-full py-20 text-center" id="empty-feed-placeholder">
            <p className="text-gray-400 font-display text-lg mb-2">No artworks found in this category.</p>
            <p className="text-gray-600 text-sm">Please check back later or explore other categories!</p>
          </div>
        )}
      </div>

      {/* Edit Artwork Modal */}
      <AnimatePresence>
        {editingArtwork && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#0f0f14] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <h3 className="text-sm font-display font-bold text-white">Edit Artwork Details</h3>
                <button
                  onClick={() => setEditingArtwork(null)}
                  className="text-xs text-gray-500 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-semibold">Title</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-semibold">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full bg-[#121218] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                  >
                    {CATEGORIES.filter(c => c !== 'For You' && c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-semibold">Description</label>
                  <textarea
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 resize-none"
                    placeholder="Describe your artwork..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-semibold">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                    placeholder="e.g. futuristic, cyberpunk, abstract"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white text-xs font-bold shadow-md shadow-cyan-600/10 hover:opacity-95 transition-all mt-2"
                >
                  Save Changes
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
