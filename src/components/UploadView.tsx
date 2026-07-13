import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Upload, Image as ImageIcon, X, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';
import { Artwork, Artist } from '../types';
import { CATEGORIES } from '../data/dummyData';

interface UploadViewProps {
  onPublish: (newArtwork: Omit<Artwork, 'id' | 'artistId' | 'artistName' | 'artistAvatar' | 'artistUsername' | 'likesCount' | 'commentsCount' | 'favoritesCount' | 'viewsCount' | 'comments' | 'createdAt' | 'imageUrl'> & { localImage: string }) => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
}

export default function UploadView({
  onPublish,
  isLoggedIn,
  onLoginClick
}: UploadViewProps) {

  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Digital Art');
  const [tagInput, setTagInput] = useState('');
  const [matureContent, setMatureContent] = useState(false);
  const [visibility, setVisibility] = useState<'public' | 'private' | 'unlisted'>('public');
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [errorText, setErrorText] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeCategories = CATEGORIES.slice(2);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorText('File must be an image (PNG, JPG, WEBP, etc.)');
      return;
    }
    setErrorText('');
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImagePreview(null);
  };

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imagePreview) {
      setErrorText('Please select or upload an artwork image first.');
      return;
    }
    if (!title.trim()) {
      setErrorText('Please specify a title for your artwork.');
      return;
    }

    setIsPublishing(true);
    setErrorText('');

    // Simulate small backend network upload latency
    setTimeout(() => {
      // Split tags by space or comma and clean them up
      const tags = tagInput
        .split(/[ ,]+/)
        .map(t => t.trim().toLowerCase().replace('#', ''))
        .filter(t => t.length > 0);

      onPublish({
        title,
        description: description || `Original ${category.toLowerCase()} design published by @alexmercer_art.`,
        category,
        tags: tags.length > 0 ? tags : [category.toLowerCase()],
        localImage: imagePreview
      });

      setIsPublishing(false);
      setShowSuccessToast(true);

      // Reset Form
      setTitle('');
      setDescription('');
      setCategory('Digital Art');
      setTagInput('');
      setImagePreview(null);
      setMatureContent(false);
      setVisibility('public');

      // Clear Toast after delay
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 4000);

    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 relative">
      
      {/* Toast Notification */}
      {showSuccessToast && (
        <div id="upload-toast" className="fixed top-24 right-6 lg:right-10 bg-emerald-950/90 border border-emerald-500/30 text-emerald-300 px-5 py-4 rounded-xl shadow-2xl shadow-emerald-900/10 backdrop-blur flex items-center gap-3 animate-fade-in z-50">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-sm font-semibold">Artwork Published Successfully!</p>
            <p className="text-xs text-emerald-400/80">Your new piece is now live on the feed and your portfolio.</p>
          </div>
        </div>
      )}

      <div>
        <p className="text-xs font-mono tracking-wider text-cyan-400 font-semibold uppercase">CREATION HUB</p>
        <h3 className="text-xl md:text-2xl font-display font-bold text-white mt-1">Publish Your Art</h3>
        <p className="text-sm text-gray-400 mt-1">
          Share your designs, photography, traditional renders, and illustrations with other artists.
        </p>
      </div>

      <form onSubmit={handlePublishSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="upload-form">
        
        {/* Left: Drag Drop Container */}
        <div className="lg:col-span-7 space-y-6">
          <div 
            id="drag-drop-zone"
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileSelect}
            className={`relative border-2 border-dashed rounded-3xl aspect-[4/3] flex flex-col items-center justify-center p-8 text-center cursor-pointer overflow-hidden transition-all duration-300 ${
              dragActive 
                ? 'border-cyan-500 bg-cyan-600/5' 
                : imagePreview 
                  ? 'border-white/10 bg-[#0e0e14]' 
                  : 'border-white/5 hover:border-cyan-500/30 bg-white/[0.01] hover:bg-white/[0.02]'
            }`}
          >
            {imagePreview ? (
              /* Preview State */
              <div className="absolute inset-0 w-full h-full" id="image-upload-preview">
                <img
                  src={imagePreview}
                  alt="Artwork Preview"
                  className="w-full h-full object-contain"
                />
                
                {/* Clear Overlay button */}
                <button
                  type="button"
                  id="btn-clear-preview"
                  onClick={clearImage}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/70 backdrop-blur border border-white/10 text-gray-300 hover:text-white transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Instructions State */
              <div className="space-y-4" id="upload-instructions">
                <div className="w-14 h-14 rounded-2xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Drag & Drop your artwork here</p>
                  <p className="text-xs text-gray-500 mt-1">or click to browse local folders</p>
                </div>
                <div className="pt-2">
                  <span className="text-[10px] font-mono uppercase bg-white/5 border border-white/5 text-gray-400 px-3 py-1 rounded-full">
                    PNG, JPG, WEBP, GIF up to 25MB
                  </span>
                </div>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Form validation warning */}
          {errorText && (
            <div className="flex items-center gap-2 p-4 bg-red-950/50 border border-red-500/20 text-red-400 rounded-xl text-xs font-medium" id="upload-error-box">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>{errorText}</span>
            </div>
          )}
        </div>

        {/* Right: Meta Details fields */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#101015]/60 border border-white/5 rounded-2xl p-6 space-y-5" id="upload-details-card">
            
            {/* Title field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-display">Artwork Title</label>
              <input
                id="upload-title-input"
                type="text"
                placeholder="Give your masterpiece an epic name..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {/* Description field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-display">Description</label>
              <textarea
                id="upload-desc-textarea"
                rows={4}
                placeholder="Describe the mood, story, process, or inspiration..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 resize-none"
              />
            </div>

            {/* Medium Category Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-display">Category Medium</label>
              <select
                id="upload-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50"
              >
                {activeCategories.map(cat => (
                  <option key={cat} value={cat} className="bg-[#121218] text-gray-200">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags multiple Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-display">Tags</label>
              <input
                id="upload-tags-input"
                type="text"
                placeholder="cyberpunk, stylized, keysketches (separated by space or comma)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {/* Toggles */}
            <div className="border-t border-white/5 pt-5 space-y-4">
              
              {/* Mature Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-300">Mature Content Toggle</p>
                  <p className="text-[10px] text-gray-500">Requires age verification from visitors</p>
                </div>
                <button
                  type="button"
                  id="btn-mature-toggle"
                  onClick={() => setMatureContent(!matureContent)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${matureContent ? 'bg-pink-500' : 'bg-white/10'}`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${matureContent ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Visibility Selector */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-300">Visibility</p>
                  <p className="text-[10px] text-gray-500">Who can browse your upload</p>
                </div>
                <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/5" id="upload-visibility-pill">
                  {(['public', 'private', 'unlisted'] as const).map(option => (
                    <button
                      key={option}
                      type="button"
                      id={`btn-visibility-${option}`}
                      onClick={() => setVisibility(option)}
                      className={`px-3 py-1 text-[11px] font-medium capitalize rounded-md transition-all ${visibility === option ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                id="btn-publish-artwork"
                disabled={isPublishing}
                className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:opacity-90 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-cyan-600/15 flex items-center justify-center gap-2"
              >
                {isPublishing ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Publishing Masterpiece...</span>
                  </>
                ) : (
                  <span>Publish Masterpiece</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
