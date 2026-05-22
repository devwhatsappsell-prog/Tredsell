import React, { useState, useEffect } from 'react';
import { useTrendSell } from '../context/TrendSellContext';
import { StorySection } from './StorySection';
import { ProductSection } from './ProductSection';
import { AdminPanel } from './AdminPanel';
import { AuthModal } from './AuthModal';
import { ProductUploadModal } from './ProductUploadModal';
import { 
  Sparkles, 
  ShoppingBag, 
  Compass, 
  Upload, 
  User as UserIcon, 
  Lock, 
  Share2, 
  Menu, 
  X, 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  CheckCircle,
  Megaphone,
  Check,
  Mail,
  Phone,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const MainLayout: React.FC = () => {
  const { 
    user, 
    userProfile, 
    logout, 
    banners, 
    isFirebaseActive,
    products
  } = useTrendSell();

  // Active view: 'home' | 'sell' | 'admin' | 'profile'
  const [activeView, setActiveView] = useState<'home' | 'admin' | 'profile'>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  
  // Hero slider active slide indices
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto scroll banners / offers
  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      setActiveSlide(current => (current < banners.length - 1 ? current + 1 : 0));
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  // Auto redirect to Admin view if signed in as admin
  useEffect(() => {
    if (userProfile?.role === 'admin') {
      setActiveView('admin');
    } else if (activeView === 'admin') {
      setActiveView('home');
    }
  }, [userProfile?.role]);

  const handleLogoClick = () => {
    setActiveView('home');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans select-none pb-20 md:pb-6 text-zinc-900">
      
      {/* 1. TOP HEADER NAVIGATION */}
      <nav className="sticky top-0 z-40 bg-white border-b border-zinc-100 h-16 px-6 md:px-12 flex items-center justify-between">
        
        {/* Brand logo & header links */}
        <div className="flex items-center space-x-10">
          <h1 
            onClick={handleLogoClick}
            className="text-2xl font-black italic tracking-tighter cursor-pointer select-none font-display text-zinc-950"
          >
            TREND<span className="text-red-600">SELL</span>
          </h1>

          <div className="hidden lg:flex items-center space-x-6 text-xs font-black uppercase tracking-widest text-zinc-500">
            <button 
              onClick={() => setActiveView('home')} 
              className={`hover:text-black transition-colors ${activeView === 'home' ? 'text-red-600 border-b-2 border-red-600 pb-1 mt-1' : ''}`}
            >
              Shop
            </button>
            
            <a 
              href="https://wa.me/919643281807?text=Hello%20TrendSell!%20%F0%9F%91%8B%20I%20am%20interested%20in%20your%20products%20and%20fashion%20catalog.%20Let's%20connect!%20%E2%9C%A8"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-600 text-zinc-500 transition-colors flex items-center space-x-1.5"
              title="Chat with support on WhatsApp"
            >
              <Phone className="w-3.5 h-3.5 text-green-500" />
              <span>WhatsApp / व्हाट्सएप</span>
            </a>

            <button 
              onClick={() => {
                if (!user) setAuthModalOpen(true);
                else setActiveView('profile');
              }} 
              className={`hover:text-black transition-colors ${activeView === 'profile' ? 'text-red-600 border-b-2 border-red-600 pb-1 mt-1 font-black' : ''}`}
            >
              My Account / मेरा अकाउंट
            </button>
            
            {userProfile?.role === 'admin' && (
              <button 
                onClick={() => setActiveView('admin')} 
                className={`hover:text-black transition-colors flex items-center space-x-1 ${activeView === 'admin' ? 'text-red-600 border-b-2 border-red-600 pb-1 mt-1 font-black' : ''}`}
              >
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></span>
                <span className="text-red-600 font-bold">Admin Dashboard</span>
              </button>
            )}
          </div>
        </div>

        {/* Global info and Auth Indicators */}
        <div className="flex items-center space-x-6">
          
          {/* Quick Info Box about current state */}
          <div className="hidden sm:flex flex-col items-end mr-2 text-right">
            <div className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${isFirebaseActive ? 'bg-green-100 text-green-800' : 'bg-zinc-100 text-zinc-600'}`}>
              {isFirebaseActive ? 'Connected' : 'Offline Mode'}
            </div>
          </div>

          {/* Sell Button: Only shown for administration/sellers */}
          {user && (userProfile?.role === 'admin' || userProfile?.role === 'seller') && (
            <button 
              onClick={() => setUploadModalOpen(true)}
              className="bg-black hover:bg-zinc-900 active:scale-95 text-white py-2 px-5 text-xs font-bold uppercase tracking-widest transition-all shadow-sm hidden md:flex items-center space-x-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Product</span>
            </button>
          )}

          {/* User Indicator / Portal trigger */}
          {user ? (
            <div className="flex items-center space-x-3.5">
              <div 
                onClick={() => setActiveView('profile')}
                className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-xs font-black cursor-pointer uppercase select-none ring-2 ring-zinc-100 shadow-sm hover:scale-105 transition-transform"
                title="Account Settings"
              >
                {userProfile?.name ? userProfile.name.slice(0, 2) : 'ME'}
              </div>
              <button 
                onClick={logout} 
                className="text-[10px] font-black uppercase text-red-605 bg-red-50 hover:bg-red-600 hover:text-white px-3 py-1.5 border border-red-100 hover:border-red-600 transition-colors cursor-pointer rounded-sm"
                title="Sign Out"
              >
                Logout / लॉगआउट
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setAuthModalOpen(true)}
              className="text-xs font-black uppercase tracking-widest border-2 border-black bg-black text-white px-4 py-2 hover:bg-zinc-900 transition-all shadow cursor-pointer flex items-center space-x-1"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Login / लॉगइन</span>
            </button>
          )}

        </div>
      </nav>

      {/* 2. BODY VIEWS ROUTER */}
      <div className="flex-1">
        
        {/* VIEW A: HOME STOREFRONT FEED */}
        {activeView === 'home' && (
          <div className="space-y-0 text-zinc-900">
            
            {/* HER0 BANNER CAROUSEL / SLIDER */}
            {banners.length > 0 && (
              <div className="relative bg-zinc-950 text-white overflow-hidden aspect-[12/5] sm:aspect-[21/9] lg:aspect-[12/4] flex items-center shadow-lg border-b border-zinc-900">
                
                {/* Back Image */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={banners[activeSlide].imageUrl} 
                    alt="TrendSell Promo slide" 
                    className="w-full h-full object-cover grayscale brightness-40 transition-all duration-1000 transform scale-102"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/40 to-transparent"></div>
                </div>

                {/* Text Spec Box */}
                <div className="max-w-7xl mx-auto px-6 md:px-12 w-full rlt mt-1 md:mt-2 relative z-10">
                  <span className="text-red-500 font-extrabold uppercase text-[10px] md:text-xs tracking-widest block mb-1 md:mb-2 animate-pulse">
                    Featured Spotlight Collection
                  </span>
                  
                  <motion.h2 
                    key={`title-${activeSlide}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl sm:text-4xl md:text-5xl font-black italic uppercase leading-[0.9] font-display text-white max-w-xl"
                  >
                    {banners[activeSlide].title}
                  </motion.h2>

                  <p className="text-[10px] sm:text-xs text-zinc-400 mt-2 max-w-sm sm:max-w-md hidden sm:block font-serif font-semibold">
                    Curated minimal wear for secondary and premium sellers. Check out limited designs listed by sellers from Delhi, Mumbai and Bangalore.
                  </p>

                  <div className="mt-3.5 md:mt-6 flex space-x-3">
                    {user && (userProfile?.role === 'admin' || userProfile?.role === 'seller') && (
                      <button 
                        onClick={() => setUploadModalOpen(true)}
                        className="bg-white hover:bg-zinc-150 active:scale-95 text-black px-4 sm:px-6 py-2 text-[9px] sm:text-xs font-black uppercase tracking-widest transition-colors duration-200"
                      >
                        SELL APPAREL
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        const target = document.getElementById('listings-head');
                        if (target) target.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="border border-white hover:bg-white/10 active:scale-95 text-white px-4 sm:px-6 py-2 text-[9px] sm:text-xs font-black uppercase tracking-widest transition-colors"
                    >
                      BROWSE ALL
                    </button>
                  </div>
                </div>

                {/* Slides Navigation indicators */}
                <div className="absolute bottom-4 right-6 md:right-12 z-20 flex space-x-2">
                  {banners.map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveSlide(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeSlide === i ? 'bg-red-600 w-5' : 'bg-zinc-600 hover:bg-zinc-400'}`}
                    />
                  ))}
                </div>

              </div>
            )}

            {/* FASHION STATUSES / STORIES SECTION */}
            <StorySection />

            {/* IN-SITE PROMOTIONAL BANNER */}
            <div className="bg-zinc-950 py-3.5 px-6 border-b border-zinc-900 select-none hidden md:block overflow-hidden relative">
              <div className="max-w-7xl mx-auto flex items-center justify-between gap-10">
                <div className="flex items-center space-x-3">
                  <Megaphone className="w-5 h-5 text-red-600 animate-bounce" />
                  <span className="text-[10px] font-black uppercase text-white tracking-widest">FLASH OFFER: USE PROMO CODE <strong className="text-red-500">TREND26</strong> FOR FREE COURIER PICKUP FOR SELLERS!</span>
                </div>
                <div className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider font-mono">
                  ACTIVE ONLY IN INDIA
                </div>
              </div>
            </div>

            {/* PRODUCT COLLECTION FEED & TAXONOMIES */}
            <div id="listings-head">
              <ProductSection />
            </div>

          </div>
        )}

        {/* VIEW B: ADMINISTRATOR DASHBOARD */}
        {activeView === 'admin' && (
          <div className="py-8 bg-[#fafafa]">
            {userProfile?.role === 'admin' ? (
              <AdminPanel />
            ) : (
              <div className="max-w-md mx-auto text-center border border-zinc-200 py-16 px-8 bg-white">
                <Lock className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                <h3 className="font-bold uppercase text-sm tracking-wide text-zinc-950">Unauthorized Access</h3>
                <p className="text-xs text-zinc-500 mt-1 mb-5">Only verified TrendSell administrators can access the review queues and moderation parameters.</p>
                
                <button 
                  onClick={() => setAuthModalOpen(true)}
                  className="bg-black hover:bg-zinc-900 text-white text-xs font-bold uppercase tracking-widest py-3 px-6 transition-all"
                >
                  Sign in as Guest Admin
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW C: DETAILED ACCOUNT PORTAL FOR USER */}
        {activeView === 'profile' && (
          <div className="max-w-2xl mx-auto px-6 py-12">
            <div className="bg-white border border-zinc-200 p-6 md:p-8 animate-fade-in">
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-100 pb-6 mb-6 gap-4">
                <div className="flex items-center space-x-5">
                  <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-xl font-black uppercase">
                    {userProfile?.name ? userProfile.name.slice(0, 2) : 'TS'}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-bold font-display uppercase">{userProfile?.name || 'Local Seller'}</h3>
                      <span className="text-[8px] font-black uppercase tracking-widest text-red-600 bg-red-50 py-0.5 px-2 rounded-full">
                        {userProfile?.role || 'user'}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">{userProfile?.email || 'unregistered@trendsell.com'}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    logout();
                    setActiveView('home');
                  }}
                  className="bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-255 hover:border-red-650 px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-all text-center self-start sm:self-center"
                >
                  Logout (लॉगआउट) / Sign Out
                </button>
              </div>

              {/* Only show listings stats and seller catalogs if they have admin or seller roles */}
              {(userProfile?.role === 'admin' || userProfile?.role === 'seller') ? (
                <>
                  {/* User Listings Statistics Summary */}
                  <div className="grid grid-cols-2 gap-4 mb-8 text-center text-zinc-900">
                    <div className="bg-zinc-50 p-4 border border-zinc-100">
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block font-sans">Your Approved designs</span>
                      <span className="text-3xl font-black font-display mt-1 block">
                        {products.filter(p => p.sellerId === user?.uid && p.approved).length}
                      </span>
                    </div>
                    <div className="bg-zinc-50 p-4 border border-zinc-100">
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block font-sans">Awaiting Moderation</span>
                      <span className="text-3xl font-black font-display text-red-600 mt-1 block">
                        {products.filter(p => p.sellerId === user?.uid && !p.approved).length}
                      </span>
                    </div>
                  </div>

                  {/* Individual user store manager */}
                  <div>
                    <h4 className="text-[10px] font-black tracking-widest text-zinc-400 uppercase mb-4 font-sans">My Store Catalog</h4>
                    
                    {products.filter(p => p.sellerId === user?.uid).length === 0 ? (
                      <div className="border border-dashed border-zinc-200 py-8 text-center text-zinc-500">
                        <p className="text-xs">You have not submitted any apparel yet.</p>
                        <button 
                          onClick={() => setUploadModalOpen(true)}
                          className="text-red-600 hover:underline hover:text-black font-bold uppercase tracking-wider text-[10px] mt-2 block mx-auto"
                        >
                          Post Your First Apparel
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {products.filter(p => p.sellerId === user?.uid).map(p => (
                          <div key={p.id} className="border border-zinc-100 p-3 flex justify-between items-center bg-zinc-50/50">
                            <div className="flex items-center space-x-3.5">
                              <img src={p.images[0]} alt="" className="w-10 h-12 object-cover bg-zinc-200 grayscale" />
                              <div>
                                <h5 className="font-bold text-xs">{p.title}</h5>
                                <p className="text-[9px] text-zinc-400 uppercase font-bold">{p.category} • ₹{p.price}</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <span className={`text-[9px] font-bold py-0.5 px-2 rounded-full uppercase ${p.approved ? 'bg-green-100 text-green-800' : 'bg-red-50 text-red-700'}`}>
                                {p.approved ? 'Live' : 'Pending Approval'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="border border-dashed border-zinc-200 py-10 text-center text-zinc-500 bg-zinc-50/50">
                  <p className="text-xs font-bold font-serif">Welcome to your Premium Member Dashboard.</p>
                  <p className="text-[10px] text-zinc-400 uppercase mt-1 tracking-wider">Browsing live designs and liking listings is active.</p>
                </div>
              )}

            </div>
          </div>
        )}

      </div>

      {/* 2.5 PREMIUM STOREFRONT FOOTER */}
      <footer className="bg-zinc-950 text-zinc-400 py-12 px-6 md:px-12 border-t border-zinc-900 mt-auto select-none pb-24 md:pb-12 text-left">
        <div className="max-w-7xl mx-auto">
          
          {/* Brand Pitch & Contact Coordinates */}
          <div className="space-y-4 max-w-xl">
            <h3 className="text-xl font-black italic tracking-tighter text-white font-display">
              TREND<span className="text-red-500">SELL</span>
            </h3>
            <p className="text-xs text-zinc-400 font-serif leading-relaxed">
              India's premium peer-to-peer apparel exchange and curator platform. List, trade, and showcase authentic designs directly with trusted buyers.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-red-500 font-bold uppercase tracking-wider">Contact Seller Support:</span>
              </div>
              <a 
                href="mailto:support@trendsell.com" 
                className="flex items-center space-x-2.5 text-zinc-300 hover:text-white transition-colors py-1 group inline-flex"
              >
                <span className="bg-zinc-900 p-1.5 rounded text-zinc-400 group-hover:text-red-500 group-hover:bg-zinc-800 transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-mono font-bold">support@trendsell.com</span>
              </a>
              <br />
              <a 
                href="https://wa.me/919643281807" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2.5 text-zinc-300 hover:text-green-400 transition-colors py-1 group inline-flex"
              >
                <span className="bg-zinc-900 p-1.5 rounded text-zinc-400 group-hover:text-green-400 group-hover:bg-zinc-800 transition-colors">
                  <Phone className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-mono font-bold">+91 96432 81807</span>
                <span className="bg-green-950 text-green-400 text-[8px] font-black tracking-widest px-1.5 py-0.5 uppercase rounded animate-pulse">
                  WhatsApp Support
                </span>
              </a>
            </div>
          </div>

        </div>

        {/* Lower Legal Line */}
        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-[10px] text-zinc-600 font-mono">
          <p>© {new Date().getFullYear()} TRENDSELL INDIA. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0 font-sans tracking-wide">
            <span className="hover:text-zinc-500 cursor-help">Secure Auth Gateways</span>
            <span>•</span>
            <span className="hover:text-zinc-500 cursor-help">Direct Peer-to-Peer</span>
          </div>
        </div>
      </footer>

      {/* 3. APP-LIKE BOTTOM STICKY NAVIGATION BAR (requested Meesho design spec!) */}
      <div className="fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-zinc-100 flex items-center justify-around z-30 shadow-lg md:hidden">
        
        <button 
          onClick={() => setActiveView('home')}
          className={`flex flex-col items-center flex-1 py-1.5 transition-colors ${activeView === 'home' ? 'text-red-600 font-extrabold' : 'text-zinc-500'}`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-black uppercase tracking-wider">Feed</span>
        </button>

        {userProfile?.role && (userProfile?.role === 'admin' || userProfile?.role === 'seller') && (
          <button 
            onClick={() => {
              setUploadModalOpen(true);
            }}
            className="flex flex-col items-center flex-1 py-1.5 text-zinc-500 hover:text-red-600"
          >
            <Upload className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] font-black uppercase tracking-wider">Sell</span>
          </button>
        )}

        {userProfile?.role === 'admin' && (
          <button 
            onClick={() => setActiveView('admin')}
            className={`flex flex-col items-center flex-1 py-1.5 transition-colors ${activeView === 'admin' ? 'text-red-600 font-extrabold' : 'text-zinc-500'}`}
          >
            <Lock className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] font-black uppercase tracking-wider text-red-600">Admin</span>
          </button>
        )}

        <a 
          href="https://wa.me/919643281807?text=Hello%20TrendSell!%20%F0%9F%91%8B%20I%20am%20interested%20in%20your%20products%20and%20fashion%20catalog.%20Let's%20connect!%20%E2%9C%A8"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center flex-1 py-1.5 text-zinc-500 hover:text-green-600 transition-colors"
          title="WhatsApp Support"
        >
          <Phone className="w-5 h-5 mb-0.5 text-green-500 animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-wider text-green-600">WhatsApp</span>
        </a>

        <button 
          onClick={() => {
            if (!user) setAuthModalOpen(true);
            else setActiveView('profile');
          }}
          className={`flex flex-col items-center flex-1 py-1.5 transition-colors ${activeView === 'profile' ? 'text-red-600 font-extrabold' : 'text-zinc-500'}`}
        >
          <UserIcon className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-black uppercase tracking-wider text-center block">
            {user ? 'Account / अकाउंट' : 'Login / लॉगइन'}
          </span>
        </button>

      </div>

      {/* MODALS OVERLAYS portals */}
      <AnimatePresence>
        {authModalOpen && (
          <AuthModal 
            isOpen={authModalOpen} 
            onClose={() => setAuthModalOpen(false)} 
            onLoginSuccess={(emailVal) => {
              if (emailVal === 'praveen@gmail.com' || emailVal === 'devwhatsappsell@gmail.com') {
                setUploadModalOpen(true);
              }
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {uploadModalOpen && (
          <ProductUploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
        )}
      </AnimatePresence>

    </div>
  );
};
