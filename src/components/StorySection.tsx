import React, { useState, useEffect } from 'react';
import { useTrendSell } from '../context/TrendSellContext';
import { Plus, X, Heart, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const StorySection: React.FC = () => {
  const { statuses, uploadStatus, user, deleteStatus, userProfile } = useTrendSell();
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');

  // Auto progression for stories
  useEffect(() => {
    if (selectedStoryIndex === null) return;
    const interval = setTimeout(() => {
      if (selectedStoryIndex < statuses.length - 1) {
        setSelectedStoryIndex(selectedStoryIndex + 1);
      } else {
        setSelectedStoryIndex(null);
      }
    }, 4500); // 4.5 seconds per story
    return () => clearTimeout(interval);
  }, [selectedStoryIndex, statuses.length]);

  const handleCreateStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;

    // Use default premium preset images if they just write a plain keyword
    let finalUrl = imageUrl;
    if (!imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
      finalUrl = `https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80`;
    }

    uploadStatus(finalUrl, caption);
    setImageUrl('');
    setCaption('');
    setUploadOpen(false);
  };

  const handleSampleSelect = (url: string) => {
    setImageUrl(url);
  };

  const SAMPLE_STORY_IMAGES = [
    { name: 'Red Accent Coat', url: 'https://images.unsplash.com/photo-1539109132314-3477524c8595?auto=format&fit=crop&w=500&q=80' },
    { name: 'Active wear', url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=500&q=80' },
    { name: 'Monochrome Tee', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80' },
    { name: 'Accessories', url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=500&q=80' }
  ];

  return (
    <div className="bg-white border-b border-zinc-100 py-5 px-6">
      <div className="max-w-7xl mx-auto flex items-center space-x-6 overflow-x-auto no-scrollbar">
        {/* User own Status Creator */}
        <div className="flex flex-col items-center flex-shrink-0 space-y-1.5 group cursor-pointer" onClick={() => setUploadOpen(true)}>
          <div className="relative w-15 h-15 rounded-full border-2 border-dashed border-zinc-300 p-0.5 group-hover:border-red-600 transition-colors duration-300">
            <div className="w-full h-full rounded-full bg-zinc-50 flex items-center justify-center border border-zinc-200">
              <Plus className="w-5 h-5 text-zinc-500 group-hover:text-red-600 transition-colors" />
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Post Story</span>
        </div>

        {/* Existing Statuses */}
        {statuses.map((story, idx) => (
          <div 
            key={story.id} 
            className="flex flex-col items-center flex-shrink-0 space-y-1.5 cursor-pointer"
            onClick={() => setSelectedStoryIndex(idx)}
          >
            <div className="w-15 h-15 rounded-full border-2 border-red-600 p-0.5 transform tracking-tight active:scale-95 transition-all duration-300">
              <img 
                src={story.imageUrl} 
                alt={story.userName} 
                className="w-full h-full rounded-full object-cover grayscale select-none"
              />
            </div>
            <span className="text-[10px] font-medium text-zinc-700 tracking-tight truncate max-w-[65px]">
              {story.userName}
            </span>
          </div>
        ))}
      </div>

      {/* Upload Story Modal */}
      <AnimatePresence>
        {uploadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md border border-zinc-200 p-6 md:p-8"
            >
              <div className="flex justify-between items-center pb-4 border-b border-zinc-100">
                <h3 className="text-lg font-black tracking-tighter uppercase font-display">Create Fashion Status</h3>
                <button onClick={() => setUploadOpen(false)} className="text-zinc-400 hover:text-black">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateStory} className="mt-4 space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1">Image URL</label>
                  <input 
                    type="url" 
                    placeholder="https://images.unsplash.com/..." 
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    required
                    className="w-full border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:border-black"
                  />
                  <p className="text-[9px] text-zinc-500 mt-1">Or click one of our curated style presets below:</p>
                  
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {SAMPLE_STORY_IMAGES.map((sample, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSampleSelect(sample.url)}
                        className={`border rounded p-1 text-[9px] truncate hover:border-black text-center ${imageUrl === sample.url ? 'border-red-600 bg-red-50/50 text-red-700' : 'border-zinc-200'}`}
                      >
                        {sample.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1">Caption</label>
                  <input 
                    type="text" 
                    placeholder="E.g., Winter knitted street style look 🍂" 
                    maxLength={80}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:border-black"
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full bg-black text-white hover:bg-zinc-900 active:bg-zinc-800 text-xs font-bold uppercase py-3 tracking-widest transition-colors"
                  >
                    Publish Status
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Story Slide Viewer Lightbox */}
      <AnimatePresence>
        {selectedStoryIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 select-none touch-none">
            {/* Background click */}
            <div className="absolute inset-0" onClick={() => setSelectedStoryIndex(null)} />
            
            <div className="relative w-full max-w-md h-full md:h-[80vh] bg-zinc-950 flex flex-col justify-center overflow-hidden">
              
              {/* Progress bars */}
              <div className="absolute top-4 left-4 right-4 z-20 flex space-x-1">
                {statuses.map((_, i) => (
                  <div key={i} className="h-1 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-white transition-all`}
                      style={{
                        width: i < selectedStoryIndex ? '100%' : i === selectedStoryIndex ? '100%' : '0%',
                        transitionDuration: i === selectedStoryIndex ? '4.5s' : '0s',
                        transitionTimingFunction: 'linear'
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Story Header */}
              <div className="absolute top-8 left-4 right-4 z-20 flex justify-between items-center text-white">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full border border-red-500 overflow-hidden">
                    <img 
                      src={statuses[selectedStoryIndex].imageUrl} 
                      alt="avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider">{statuses[selectedStoryIndex].userName}</h4>
                    <p className="text-[8px] text-zinc-400 font-mono">posted recently</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {userProfile?.role === 'admin' && (
                    <button 
                      onClick={() => {
                        deleteStatus(statuses[selectedStoryIndex].id);
                        setSelectedStoryIndex(null);
                      }}
                      className="text-red-500 hover:text-red-700 bg-red-950/40 p-1 rounded font-bold text-[10px]"
                    >
                      DELETE
                    </button>
                  )}
                  <button onClick={() => setSelectedStoryIndex(null)} className="text-zinc-300 hover:text-white bg-black/40 p-1.5 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Left/Right click triggers */}
              <button 
                onClick={() => {
                  if (selectedStoryIndex > 0) setSelectedStoryIndex(selectedStoryIndex - 1);
                }} 
                className="absolute left-0 top-16 bottom-16 w-1/4 z-10 cursor-w-resize"
              />
              <button 
                onClick={() => {
                  if (selectedStoryIndex < statuses.length - 1) {
                    setSelectedStoryIndex(selectedStoryIndex + 1);
                  } else {
                    setSelectedStoryIndex(null);
                  }
                }} 
                className="absolute right-0 top-16 bottom-16 w-1/4 z-10 cursor-e-resize"
              />

              {/* Core visual image */}
              <img 
                src={statuses[selectedStoryIndex].imageUrl} 
                alt="Story content" 
                className="w-full h-auto max-h-full object-contain md:max-h-[70vh]"
              />

              {/* Footer caption */}
              {statuses[selectedStoryIndex].caption && (
                <div className="absolute bottom-6 left-4 right-4 text-center bg-black/60 backdrop-blur-md py-3 px-4 rounded text-white text-xs tracking-wide">
                  {statuses[selectedStoryIndex].caption}
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
