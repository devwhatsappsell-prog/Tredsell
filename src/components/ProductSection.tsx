import React, { useState } from 'react';
import { useTrendSell } from '../context/TrendSellContext';
import { Product } from '../types';
import { 
  Heart, 
  Share2, 
  ShoppingBag, 
  Search, 
  SlidersHorizontal, 
  Check, 
  Volume2, 
  MessageCircle, 
  X,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductSection: React.FC = () => {
  const { products, categories, likeProduct, user } = useTrendSell();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Multiple image view lightbox
  const [activeLightboxProduct, setActiveLightboxProduct] = useState<Product | null>(null);
  const [lightboxActiveIndex, setLightboxActiveIndex] = useState<number>(0);

  // Sharing feedback states
  const [sharedProductId, setSharedProductId] = useState<string | null>(null);

  // Handle Likes click
  const handleLikeClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!user) {
      alert("Please login/signup quickly using the button in the bar or bottom navigation to like awesome clothing listings!");
      return;
    }
    likeProduct(id);
  };

  // Handle Share copy
  const handleShareClick = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/#product/${product.id}`;
    
    // Attempt real Web Share API
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out this gorgeous item on TrendSell: ${product.title} for just ₹${product.price}!`,
        url: shareUrl,
      }).catch(err => console.log(err));
    } else {
      // Fallback: Copy link
      navigator.clipboard.writeText(shareUrl).then(() => {
        setSharedProductId(product.id);
        setTimeout(() => setSharedProductId(null), 2500);
      });
    }
  };

  // Handle WhatsApp Order Button
  const handleWhatsAppRedirect = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    // Normalize phone number (remove spaces, symbols)
    const phone = product.sellerPhone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello! I saw your luxury listing on TrendSell:\n\n*Product:* ${product.title}\n*Price:* ₹${product.price}\n*Link:* ${window.location.origin}/#product/${product.id}\n\nIs this item still available? I'd love to buy it!`
    );
    const waUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${message}`;
    window.open(waUrl, '_blank');
  };

  // Filtered approved products (or uploaded by the current logged-in user themselves)
  const liveApprovedProducts = products.filter(p => p.approved || (user && p.sellerId === user.uid));

  // Generate unique categories dynamically from approved products
  const dynamicCategories = React.useMemo(() => {
    const list = new Set<string>();
    
    // Add explicitly registered categories if any
    categories.forEach(c => {
      if (c && c.name) {
        list.add(c.name.trim());
      }
    });

    // Add categories from the approved products dynamically
    liveApprovedProducts.forEach(p => {
      if (p && p.category) {
        // Capitalize each word for visual excellence
        const formatted = p.category
          .split(/\s+/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
          .trim();
        if (formatted) {
          list.add(formatted);
        }
      }
    });

    return Array.from(list);
  }, [categories, liveApprovedProducts]);

  const filteredProducts = liveApprovedProducts.filter(p => {
    const matchesCategory = selectedCategory === 'all' || 
      p.category.toLowerCase().trim() === selectedCategory.toLowerCase().trim();
    
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Spotlight / Premium Featured Slide items (Featured pin from admin)
  const spotlightProducts = liveApprovedProducts.filter(p => p.featured);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      
      {/* 1. SEARH & FILTER SHELF */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div className="flex-1 max-w-lg relative">
          <input 
            type="text" 
            placeholder="Search minimal street wear, oversized tees, linen apparel..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-zinc-200 rounded-none py-3 px-11 text-xs focus:outline-none focus:border-black font-semibold text-zinc-900"
          />
          <Search className="absolute left-4 top-3.5 w-4.5 h-4.5 text-zinc-400" />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-3.5 text-zinc-400 hover:text-black">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories Bar */}
        <div className="flex items-center space-x-2.5 overflow-x-auto no-scrollbar py-1">
          <button 
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-wider transition-all duration-200 border ${selectedCategory === 'all' ? 'bg-black text-white border-black' : 'bg-white text-zinc-500 border-zinc-200 hover:border-black hover:text-black'}`}
          >
            All Apparel
          </button>
          {dynamicCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all duration-200 border ${selectedCategory.toLowerCase().trim() === cat.toLowerCase().trim() ? 'bg-red-600 text-white border-red-600 font-bold' : 'bg-white text-zinc-600 border-zinc-200 hover:border-black hover:text-black'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2. SPOTLIGHT FEATURED PROMOTIONS (Myntra premium slider section) */}
      {spotlightProducts.length > 0 && searchQuery === '' && selectedCategory === 'all' && (
        <div className="mb-14">
          <div className="flex items-center space-x-2 mb-5">
            <span className="w-1.5 h-6 bg-red-600"></span>
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 font-display">THE SPOTLIGHT COLLAB</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spotlightProducts.map(p => (
              <div 
                key={`spot-${p.id}`}
                className="bg-zinc-900 text-white border border-zinc-800 flex flex-col justify-between overflow-hidden relative aspect-[14/9] cursor-pointer group"
                onClick={() => {
                  setActiveLightboxProduct(p);
                  setLightboxActiveIndex(0);
                }}
              >
                {/* Background high fashion image */}
                <img 
                  src={p.images[0]} 
                  alt="" 
                  className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.4] group-hover:scale-105 group-hover:brightness-[0.5] transition-all duration-700"
                />

                <div className="absolute top-3 left-3 bg-red-600 text-[8px] font-black uppercase px-2 py-0.5 tracking-wider">
                  Featured Pin
                </div>

                <div className="p-5 mt-auto relative z-10">
                  <span className="text-[8px] font-black text-red-500 uppercase tracking-widest block">{p.sellerName}</span>
                  <h4 className="text-base font-black uppercase tracking-tight text-white font-display mt-0.5">{p.title}</h4>
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/10">
                    <span className="text-sm font-black">₹{p.price}</span>
                    <span className="text-[10px] font-bold text-red-400">ONLY {p.quantity} PIECES LEFT</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. CORE APPAREL FEED GRID (Meesho styled card layouts) */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-6 bg-black"></span>
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-950 font-display">
              {selectedCategory === 'all' ? 'LATEST WARDROBE ARRIVALS' : `${selectedCategory} COLLECTION`}
            </h3>
          </div>
          <span className="text-[10px] text-zinc-400 font-black tracking-widest font-mono">
            {filteredProducts.length} DESIGNS AVAILABLE
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="border border-zinc-200 py-16 text-center text-zinc-500 bg-white">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-zinc-300 animate-bounce" />
            <h4 className="font-bold text-sm uppercase tracking-wide">No apparel matching search found</h4>
            <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">Try typing a another apparel keyword, selecting a broad filter tag, or login to list your first clothing item!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map(product => {
              const userHasLiked = user && Array.isArray(product.likedBy) && product.likedBy.includes(user.uid);
              const isOut = product.quantity === 0;
              const isLow = product.quantity > 0 && product.quantity <= 5;

              return (
                <div 
                  key={product.id} 
                  className="flex flex-col relative group cursor-pointer bg-white border border-zinc-100 hover:border-zinc-300 transition-all duration-300"
                  onClick={() => {
                    setActiveLightboxProduct(product);
                    setLightboxActiveIndex(0);
                  }}
                >
                  
                  {/* Image Stage with absolute cards */}
                  <div className="relative aspect-[3/4] bg-zinc-50 overflow-hidden">
                    <img 
                      src={product.images[0]} 
                      alt={product.title} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-102 transition-all duration-500"
                    />

                    {/* Stock Tags or Pending Status */}
                    {!product.approved ? (
                      <div className="absolute top-3 left-3 bg-amber-500 text-white text-[8.5px] font-black px-2 py-1 uppercase tracking-wider animate-pulse z-15 shadow-md">
                        ⏳ Pending Approval
                      </div>
                    ) : isOut ? (
                      <div className="absolute top-3 left-3 bg-black text-white text-[8px] font-black px-2 py-1 uppercase tracking-widest">
                        Sold Out
                      </div>
                    ) : isLow ? (
                      <div className="absolute top-3 left-3 bg-red-600 text-white text-[8px] font-black px-2 py-1 uppercase tracking-widest animate-pulse">
                        {product.quantity} Pieces Left
                      </div>
                    ) : (
                      <div className="absolute top-3 left-3 bg-zinc-100 text-black border border-zinc-200 text-[8px] font-black px-2 py-1 uppercase tracking-widest">
                        Fresh Drop
                      </div>
                    )}

                    {/* Like Trigger Top Right */}
                    <button 
                      onClick={(e) => handleLikeClick(e, product.id)}
                      className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:scale-110 active:scale-95 transition-transform text-red-600"
                    >
                      <Heart className="w-3.5 h-3.5" fill={userHasLiked ? 'currentColor' : 'none'} />
                    </button>

                    {/* Share Button Top Right Lower */}
                    <button 
                      onClick={(e) => handleShareClick(e, product)}
                      className="absolute top-12 right-3 bg-white p-2 rounded-full shadow hover:scale-110 active:scale-95 transition-transform text-zinc-700"
                    >
                      {sharedProductId === product.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5" />}
                    </button>

                    {/* Overlay Action with Quick WhatsApp Order (Desktop Hover / Mobile Trigger) */}
                    <div className="absolute bottom-3 left-3 right-3 z-10 transition-all duration-300">
                      <button 
                        onClick={(e) => handleWhatsAppRedirect(e, product)}
                        className="w-full bg-[#25D366] text-white hover:bg-[#20ba5a] active:bg-[#189d4a] py-2 px-3 text-[9px] font-black uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-lg relative rounded-none border border-transparent"
                      >
                        <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                        <span>WhatsApp Order</span>
                      </button>
                    </div>

                  </div>

                  {/* Card text details */}
                  <div className="p-3 bg-white border-t border-zinc-100 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">{product.sellerName}</p>
                      <h4 className="text-xs font-bold text-zinc-900 mt-1 line-clamp-1 group-hover:text-red-600 transition-colors uppercase tracking-tight">
                        {product.title}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-zinc-50">
                      <span className="text-sm font-black text-zinc-950 font-display">₹{product.price}</span>
                      <span className="text-[9px] font-mono text-zinc-400 font-semibold uppercase">{product.likes} Likes</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. DETAILS VIEW & PHOTO LIGHTBOX DETAILED DRAWER */}
      <AnimatePresence>
        {activeLightboxProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="absolute inset-0" onClick={() => setActiveLightboxProduct(null)} />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white max-w-3xl w-full p-6 md:p-8 relative grid grid-cols-1 md:grid-cols-12 gap-8 z-10 border border-zinc-200"
            >
              
              {/* Close Button */}
              <button 
                onClick={() => setActiveLightboxProduct(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-black hover:bg-zinc-100 p-1.5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Photo Display Col */}
              <div className="md:col-span-6 flex flex-col space-y-3">
                <div className="aspect-[3/4] bg-zinc-50 relative overflow-hidden ring-1 ring-zinc-100">
                  <img 
                    src={activeLightboxProduct.images[lightboxActiveIndex]} 
                    alt="" 
                    className="w-full h-full object-cover grayscale"
                  />
                  
                  {/* Left/Right buttons if multiple images exist */}
                  {activeLightboxProduct.images.length > 1 && (
                    <>
                      <button 
                        onClick={() => setLightboxActiveIndex(idx => (idx > 0 ? idx - 1 : activeLightboxProduct.images.length - 1))}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 bg-white/90 p-1.5 hover:bg-white text-black"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setLightboxActiveIndex(idx => (idx < activeLightboxProduct.images.length - 1 ? idx + 1 : 0))}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-white/90 p-1.5 hover:bg-white text-black"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                {/* Small indicator dots/images */}
                {activeLightboxProduct.images.length > 1 && (
                  <div className="flex space-x-2">
                    {activeLightboxProduct.images.map((img, i) => (
                      <button 
                        key={i} 
                        onClick={() => setLightboxActiveIndex(i)}
                        className={`w-12 h-14 border overflow-hidden ${lightboxActiveIndex === i ? 'border-red-600 ring-1 ring-red-600' : 'border-zinc-200 opacity-60'}`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover grayscale" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Specs & Description Col */}
              <div className="md:col-span-6 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black text-red-600 uppercase tracking-widest bg-red-50/50 py-1 px-2.5 inline-block mb-3.5">
                    {activeLightboxProduct.category}
                  </span>
                  <h3 className="text-xl font-bold font-display uppercase tracking-tight text-zinc-950">
                    {activeLightboxProduct.title}
                  </h3>
                  <p className="text-sm font-black text-zinc-950 mt-1.5 font-display">₹{activeLightboxProduct.price}</p>
                  
                  <div className="space-y-1.5 mt-5 pt-4 border-t border-zinc-100 text-xs">
                    <p className="text-zinc-500 font-mono">SELLER: <strong className="text-zinc-900">{activeLightboxProduct.sellerName}</strong></p>
                    <p className="text-zinc-500 font-mono">STOCK pieces: <strong className="text-zinc-900">{activeLightboxProduct.quantity} Left</strong></p>
                    <p className="text-zinc-500 font-mono">WHATSAPP CONTACT: <strong className="text-zinc-900">{activeLightboxProduct.sellerPhone}</strong></p>
                  </div>

                  <div className="mt-5">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Description & Condition</h5>
                    <div className="text-xs text-zinc-700 leading-relaxed font-serif bg-zinc-50 p-3.5 border-l-2 border-zinc-300">
                      {activeLightboxProduct.description || 'Verified organic, clean clothing listed for instant buyouts.'}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-100 flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={(e) => handleWhatsAppRedirect(e, activeLightboxProduct)}
                    className="flex-1 bg-[#25D366] text-white hover:bg-[#20ba5a] py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                    <span>Purchase via WhatsApp</span>
                  </button>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      likeProduct(activeLightboxProduct.id);
                    }}
                    className={`px-4 py-3 border flex items-center justify-center space-x-1 hover:border-black transition-colors ${user && Array.isArray(activeLightboxProduct.likedBy) && activeLightboxProduct.likedBy.includes(user.uid) ? 'text-red-600 border-red-200 bg-red-50/20' : 'text-zinc-500 border-zinc-200'}`}
                  >
                    <Heart className="w-4 h-4" fill={user && Array.isArray(activeLightboxProduct.likedBy) && activeLightboxProduct.likedBy.includes(user.uid) ? 'currentColor' : 'none'} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{activeLightboxProduct.likes} Likes</span>
                  </button>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
