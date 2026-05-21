import React, { useState } from 'react';
import { useTrendSell } from '../context/TrendSellContext';
import { X, Sparkles, LogIn, Chrome } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithGoogle, loginAnonymously, isFirebaseActive } = useTrendSell();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const cleanName = name.trim() || 'Marketplace Seller';

    await loginAnonymously(cleanName, trimmedEmail);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="absolute inset-0" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative bg-white w-full max-w-sm border border-zinc-200 p-6 md:p-8 z-10"
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-zinc-400 hover:text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-black tracking-tighter uppercase font-display italic">
            TREND<span className="text-red-600">SELL</span>
          </h2>
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-1">
            {isFirebaseActive ? 'Connect with Firebase Auth' : 'Instant Offline Sandbox Auth'}
          </p>
        </div>

        {/* Firebase Indicator */}
        <div className="mb-4 text-center">
          <span className={`inline-flex items-center px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest ${isFirebaseActive ? 'bg-green-100 text-green-800' : 'bg-red-50 text-red-700 border border-red-200/50'}`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isFirebaseActive ? 'bg-green-600 animate-pulse' : 'bg-red-600'}`}></span>
            {isFirebaseActive ? 'Firebase Active' : 'Offline Mode active'}
          </span>
        </div>

        {/* Primary Google Login Section (Promoted & Highly styled for instant customer ease) */}
        <div className="mb-5">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center mb-2.5">
            ⚡ QUICK CUSTOMER ACCESS
          </p>
          <button 
            type="button"
            onClick={async () => {
              await loginWithGoogle();
              onClose();
            }}
            className="w-full bg-red-600 hover:bg-red-700 active:scale-98 text-white text-xs font-black uppercase py-3 tracking-widest transition-all duration-200 flex items-center justify-center space-x-2 shadow-md"
          >
            <Chrome className="w-4 h-4 text-white" />
            <span>Continue with Google</span>
          </button>
          <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider text-center mt-2.5">
            Recommended for direct instant verification
          </p>
        </div>

        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-zinc-100 w-full" />
          <span className="absolute bg-white px-3 text-[9px] font-bold uppercase tracking-wider text-zinc-400">Or Work With Email / Local ID</span>
        </div>

        <form onSubmit={handleManualSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-500 mb-1">Full Name</label>
              <input 
                type="text" 
                placeholder="E.g., Neha Sharma" 
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-zinc-200 px-3 py-2 text-xs focus:outline-none focus:border-black font-semibold"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-500 mb-1">Email Address</label>
            <input 
              type="email" 
              placeholder="E.g., customer@trendsell.com" 
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-zinc-200 px-3 py-2 text-xs focus:outline-none focus:border-black font-semibold text-zinc-900"
            />
            {email.toLowerCase().trim() === 'devwhatsappsell@gmail.com' && (
              <p className="text-[9px] text-red-650 font-bold uppercase tracking-wider mt-1">Admin account recognized</p>
            )}
          </div>

          <button 
            type="submit"
            className="w-full bg-black text-white hover:bg-zinc-900 active:bg-zinc-800 text-xs font-bold uppercase py-3 tracking-widest transition-colors flex items-center justify-center space-x-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{isRegistering ? 'Register Free Account' : 'Sign In with Email'}</span>
          </button>
        </form>

        {!isRegistering && (
          <div className="mt-4">
            <button 
              type="button"
              onClick={() => {
                loginAnonymously('Fashion Guest');
                onClose();
              }}
              className="w-full text-zinc-500 hover:text-black hover:underline text-[10px] font-bold uppercase tracking-widest text-center block pt-2"
            >
              Sign In anonymously as Guest
            </button>
          </div>
        )}

        <div className="mt-5 text-center text-xs">
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-zinc-500 hover:text-black font-semibold hover:underline"
          >
            {isRegistering ? 'Already have an account? Login' : "Don't have an account? Sign up now"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
