import React, { useState, useEffect } from 'react';
import { useTrendSell } from '../context/TrendSellContext';
import { X, Plus, Info, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductUploadModal: React.FC<ProductUploadModalProps> = ({ isOpen, onClose }) => {
  const { addProduct, addCategory, user, userProfile } = useTrendSell();

  // Inputs
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number>(999);
  const [quantity, setQuantity] = useState<number>(5);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [sellerPhone, setSellerPhone] = useState('919876543210');
  
  // Multiple image URLs
  const [imageInputs, setImageInputs] = useState<string[]>(['']);

  const handleAddImageInput = () => {
    if (imageInputs.length < 4) {
      setImageInputs([...imageInputs, '']);
    }
  };

  const handleImageInputChange = (index: number, val: string) => {
    const updated = [...imageInputs];
    updated[index] = val;
    setImageInputs(updated);
  };

  const handleRemoveImageInput = (index: number) => {
    const updated = imageInputs.filter((_, i) => i !== index);
    setImageInputs(updated.length ? updated : ['']);
  };

  const handleSelectPreset = (index: number, url: string) => {
    const updated = [...imageInputs];
    updated[index] = url;
    setImageInputs(updated);
  };

  const PRESET_MOCK_IMAGES = [
    { label: 'Hoodie', url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=500&q=80' },
    { label: 'Sneakers', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80' },
    { label: 'Sweater', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80' },
    { label: 'Classic Dress', url: 'https://images.unsplash.com/photo-1539109132314-3477524c8595?auto=format&fit=crop&w=500&q=80' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedCategory = category.trim();
    if (!title.trim() || !trimmedCategory) {
      alert("Please fill in both the title and the category name.");
      return;
    }

    // Register category dynamically in context so standard tags are kept
    try {
      await addCategory(trimmedCategory);
    } catch (err) {
      console.log("Category creation complete / already present", err);
    }

    // Filter empty images, if all empty use a standard preset
    const validImages = imageInputs.filter(img => img.trim() !== '');
    const finalImages = validImages.length 
      ? validImages 
      : ['https://images.unsplash.com/photo-1539109132314-3477524c8595?auto=format&fit=crop&w=600&q=80'];

    await addProduct({
      title,
      price: Number(price),
      quantity: Number(quantity),
      description,
      category: trimmedCategory,
      images: finalImages,
      sellerPhone
    });

    // Reset
    setTitle('');
    setPrice(999);
    setQuantity(5);
    setDescription('');
    setCategory('');
    setSellerPhone('919876543210');
    setImageInputs(['']);
    
    alert("Listing submitted successfully! Note: Listings from users are submitted to the approval process to ensure high marketplace quality under the Admin Dashboard.");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
      <div className="absolute inset-0" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="relative bg-white w-full max-w-2xl border border-zinc-200 p-6 md:p-8 z-10 max-h-[90vh] overflow-y-auto"
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-zinc-400 hover:text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="border-b border-zinc-100 pb-4 mb-5">
          <h2 className="text-2xl font-black tracking-tighter uppercase font-display italic">
            List your <span className="text-red-600">Product</span>
          </h2>
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-1">
            Fill in the details to submit your apparel to the marketplace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left Col - General Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-500 mb-1">Product Title</label>
                <input 
                  type="text" 
                  placeholder="E.g., Oversized Heavyweight Cotton Tee" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full border border-zinc-200 px-3 py-2 text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-500 mb-1">Price (INR)</label>
                  <input 
                    type="number" 
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                    className="w-full border border-zinc-200 px-3 py-2 text-xs focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-500 mb-1">Stock pieces</label>
                  <input 
                    type="number" 
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    required
                    className="w-full border border-zinc-200 px-3 py-2 text-xs focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-500 mb-1">
                  Category / Type of Apparel (e.g., Kurti Set, Jeans, T-Shirt)
                </label>
                <input 
                  type="text" 
                  placeholder="E.g., Kurti Set, Jeans, Saree, Basic Tee..." 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full border border-zinc-200 px-3 py-2 text-xs focus:outline-none focus:border-black font-semibold text-zinc-900"
                />
                <p className="text-[9px] text-zinc-400 mt-1 uppercase font-semibold">
                  Whatever you write here will automatically create a real category tab in the filter section!
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-500 mb-1">WhatsApp phone number (including country code, no space)</label>
                <input 
                  type="text" 
                  placeholder="E.g., 919876543210" 
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  required
                  className="w-full border border-zinc-200 px-3 py-2 text-xs focus:outline-none focus:border-black"
                />
                <p className="text-[9px] text-zinc-400 mt-0.5">WhatsApp button will redirect clients here.</p>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-500 mb-1">Description / Condition</label>
                <textarea 
                  rows={3}
                  placeholder="Mention sizing, fabric feel, or wear conditions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-zinc-200 px-3 py-2 text-xs focus:outline-none focus:border-black resize-none"
                />
              </div>
            </div>

            {/* Right Col - Multiple Image Inputs */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-500">
                  Multiple Product Images (Up to 4)
                </label>
                {imageInputs.length < 4 && (
                  <button 
                    type="button" 
                    onClick={handleAddImageInput}
                    className="text-red-600 hover:text-black hover:underline text-[9px] font-bold uppercase tracking-widest flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Image URL</span>
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {imageInputs.map((input, idx) => (
                  <div key={idx} className="flex gap-2">
                    <div className="flex-1">
                      <input 
                        type="url" 
                        placeholder={`https://unsplash.com/photo-... (Image ${idx + 1})`}
                        value={input}
                        onChange={(e) => handleImageInputChange(idx, e.target.value)}
                        className="w-full border border-zinc-200 px-3 py-1.5 text-[11px] focus:outline-none focus:border-black"
                      />
                    </div>
                    {imageInputs.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => handleRemoveImageInput(idx)}
                        className="text-zinc-400 hover:text-black border border-zinc-200 px-2 flex items-center justify-center transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Sample high quality image shortcuts */}
              <div className="mt-4 p-3 bg-zinc-50 border border-zinc-100">
                <div className="flex items-center space-x-1 mb-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Quick-choose Unsplash preset</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {PRESET_MOCK_IMAGES.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectPreset(imageInputs.length - 1, preset.url)}
                      className="border border-zinc-200 bg-white hover:border-black py-1 px-1.5 rounded text-[9px] truncate text-left flex items-center space-x-1"
                    >
                      <span className="w-2 h-2 rounded-full bg-red-600"></span>
                      <span className="truncate">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tip info box */}
              <div className="mt-4 bg-red-50/50 border border-red-200/50 p-3 rounded text-[10px] text-red-950 flex gap-2">
                <Info className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p>
                  To prevent inappropriate content, listings go directly to the 
                  <strong> Admin Dashboard</strong> pending review. Admins can approve or reject listings immediately.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-100 flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="border border-zinc-200 text-zinc-500 hover:text-black px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="bg-black text-white hover:bg-zinc-900 active:bg-zinc-800 px-8 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors"
            >
              Submit Apparel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
