import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Bookmark, Share2, Eye, Calendar, MessageSquare, ChevronLeft, Send, Check, AlertTriangle, X } from 'lucide-react';
import { Artwork, Artist } from '../types';

interface ArtworkDetailViewProps {
  artwork: Artwork;
  allArtworks: Artwork[];
  onArtistClick: (id: string) => void;
  onArtworkClick: (id: string) => void;
  onToggleLike: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onBackClick: () => void;
  onAddComment: (artworkId: string, commentText: string) => void;
  onReportArtwork: (id: string, reason: string) => void;
}

export default function ArtworkDetailView({
  artwork,
  allArtworks,
  onArtistClick,
  onArtworkClick,
  onToggleLike,
  onToggleFavorite,
  onBackClick,
  onAddComment,
  onReportArtwork
}: ArtworkDetailViewProps) {

  const [commentText, setCommentText] = useState('');
  const [copied, setCopied] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const isLiked = artwork.hasLiked;
  const isFaved = artwork.hasFavorited;

  // Filter related artworks: same category, excluding itself, up to 4 items
  const relatedArtworks = allArtworks
    .filter(art => art.category === artwork.category && art.id !== artwork.id)
    .slice(0, 4);

  const handleShareClick = () => {
    setCopied(true);
    navigator.clipboard.writeText(`${window.location.origin}/artwork/${artwork.id}`);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    onAddComment(artwork.id, commentText);
    setCommentText('');
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) return;
    onReportArtwork(artwork.id, reportReason);
    setReportReason('');
    setIsReporting(false);
    alert('Report submitted to moderators successfully.');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Back button header navigation */}
      <div className="flex items-center">
        <button
          id="btn-back-to-feed"
          onClick={onBackClick}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-gray-300 hover:text-white border border-white/5 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </button>
      </div>

      {/* Main split details panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="artwork-showcase-container">
        
        {/* Left column: Visual display (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#101015]/40 border border-white/5 rounded-3xl overflow-hidden p-3 shadow-2xl" id="artwork-showcase-image-card">
            <div className="rounded-2xl overflow-hidden bg-[#0d0d12]">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-auto max-h-[70vh] mx-auto object-contain block"
              />
            </div>
          </div>

          {/* Quick core actions bar */}
          <div className="flex justify-between items-center bg-[#111116]/60 border border-white/5 rounded-2xl p-5 shadow-lg select-none" id="artwork-action-bar">
            <div className="flex items-center gap-5">
              
              {/* Like action */}
              <button
                id="btn-detail-like"
                onClick={() => onToggleLike(artwork.id)}
                className={`flex items-center gap-2 text-xs font-mono transition-colors ${
                  isLiked ? 'text-pink-500 font-semibold' : 'text-gray-400 hover:text-pink-500'
                }`}
              >
                <span className="text-xl">🔥</span>
                <span>{artwork.likesCount} Likes</span>
              </button>

              {/* Comments count indicator */}
              <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                <span>{artwork.commentsCount} Comments</span>
              </div>

              {/* Views count */}
              <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                <Eye className="w-5 h-5 text-emerald-400" />
                <span>{artwork.viewsCount.toLocaleString()} Views</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Favorite toggle */}
              <button
                id="btn-detail-fave"
                onClick={() => onToggleFavorite(artwork.id)}
                className={`p-2.5 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all ${
                  isFaved ? 'text-yellow-500 bg-yellow-500/5' : 'text-gray-400 hover:text-white'
                }`}
                title="Save to Collections"
              >
                <Bookmark className={`w-5 h-5 ${isFaved ? 'fill-yellow-500 text-yellow-500' : ''}`} />
              </button>

              {/* Copy URL trigger */}
              <button
                id="btn-detail-share"
                onClick={handleShareClick}
                className="relative p-2.5 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/5 text-gray-400 hover:text-white transition-all"
                title="Copy Artwork link"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
                {copied && (
                  <span className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 px-2 py-1 bg-cyan-600 text-white text-[10px] rounded font-mono shadow-lg whitespace-nowrap z-20">
                    Link Copied!
                  </span>
                )}
              </button>

              {/* Report trigger */}
              <button
                id="btn-detail-report"
                onClick={() => setIsReporting(true)}
                className="p-2.5 rounded-xl border border-white/5 hover:border-red-500/20 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all"
                title="Report Artwork"
              >
                <AlertTriangle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Artist & Comments details (5 cols) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between" id="artwork-details-meta-column">
          <div className="space-y-6">
            
            {/* Artist Info Row */}
            <div className="bg-[#111116]/60 border border-white/5 rounded-2xl p-5 flex items-center justify-between" id="artwork-artist-card">
              <div 
                onClick={() => onArtistClick(artwork.artistId)}
                className="flex items-center gap-3.5 cursor-pointer group"
              >
                <img
                  src={artwork.artistAvatar}
                  alt={artwork.artistName}
                  className="w-11 h-11 rounded-full object-cover border border-white/10 group-hover:border-cyan-500 transition-colors"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors truncate">
                    {artwork.artistName}
                  </h4>
                  <p className="text-xs text-gray-500 font-mono truncate">@{artwork.artistUsername}</p>
                </div>
              </div>

              {/* Profile Shortcut button */}
              <button
                id="btn-view-artist-portfolio"
                onClick={() => onArtistClick(artwork.artistId)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold rounded-xl transition-all border border-white/5"
              >
                Portfolio
              </button>
            </div>

            {/* Description card */}
            <div className="bg-[#111116]/60 border border-white/5 rounded-2xl p-6 space-y-4" id="artwork-meta-card">
              <div className="flex items-start justify-between border-b border-white/5 pb-4">
                <div>
                  <h1 className="font-display font-semibold text-lg text-white">
                    {artwork.title}
                  </h1>
                  <span className="text-[10px] font-mono uppercase text-cyan-400 mt-1 block tracking-wider font-semibold">
                    {artwork.category}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{artwork.createdAt}</span>
                </div>
              </div>

              <p className="text-sm text-gray-400 leading-relaxed">
                {artwork.description}
              </p>

              {/* Tag links */}
              <div className="flex flex-wrap gap-2 pt-2" id="artwork-tag-list">
                {artwork.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs font-mono text-gray-400 bg-white/5 border border-white/5 hover:border-cyan-500/20 px-3 py-1.5 rounded-xl cursor-pointer hover:text-white transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Related/Suggested Artworks */}
          {relatedArtworks.length > 0 && (
            <div className="space-y-3" id="artwork-related-section">
              <h5 className="text-xs font-mono text-gray-500 uppercase tracking-widest font-semibold">Related In Category</h5>
              <div className="grid grid-cols-4 gap-3">
                {relatedArtworks.map(art => (
                  <div
                    key={art.id}
                    id={`related-thumb-${art.id}`}
                    onClick={() => onArtworkClick(art.id)}
                    className="group aspect-square rounded-xl overflow-hidden bg-[#181822] cursor-pointer border border-white/5"
                    title={art.title}
                  >
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Broad comment list row bottom */}
      <div className="bg-[#111116]/40 border border-white/5 rounded-3xl p-6 md:p-8 space-y-6" id="artwork-comments-container">
        <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-violet-400" /> Comments ({artwork.commentsCount})
        </h3>

        {/* Comment input form */}
        <form onSubmit={handleCommentSubmit} className="flex gap-3 items-start border-b border-white/5 pb-6">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
            alt="Current User"
            className="w-10 h-10 rounded-full object-cover border border-white/10"
          />
          <div className="flex-1 relative">
            <textarea
              id="artwork-comment-input"
              rows={2}
              placeholder="Join the discussion... write your thoughts or ask questions about the process..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 resize-none pr-12"
            />
            <button
              type="submit"
              id="btn-submit-comment"
              className="absolute right-3.5 bottom-4 p-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Past Comments */}
        <div className="space-y-6" id="artwork-comments-list">
          {artwork.comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 items-start" id={`comment-row-${comment.id}`}>
              <img
                src={comment.artistAvatar}
                alt={comment.artistName}
                onClick={() => onArtistClick(comment.artistId)}
                className="w-9 h-9 rounded-full object-cover cursor-pointer border border-white/10 hover:border-violet-500"
              />
              <div className="space-y-1 bg-white/[0.01] border border-white/5 rounded-2xl p-4 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span 
                      onClick={() => onArtistClick(comment.artistId)}
                      className="text-xs font-bold text-gray-200 hover:text-violet-400 cursor-pointer transition-colors"
                    >
                      {comment.artistName}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">@{comment.artistUsername}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">{comment.timestamp}</span>
                </div>
                <p className="text-sm text-gray-400 font-sans leading-relaxed pt-1">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}

          {artwork.comments.length === 0 && (
            <p className="text-gray-600 text-xs italic">No comments have been posted yet. Be the first to start the discussion!</p>
          )}
        </div>
      </div>

      {/* Reporting Modal */}
      {isReporting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#121218] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setIsReporting(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-display font-semibold text-white flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Report Artwork
            </h3>
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-2">Reason for reporting</label>
                <textarea
                  required
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Please describe why this artwork violates community guidelines..."
                  className="w-full bg-[#1a1a24] border border-white/5 rounded-xl p-3 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-red-500/50 resize-none h-24"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsReporting(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-red-600/20 transition-colors"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
