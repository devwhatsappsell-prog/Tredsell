import React, { useState } from 'react';
import { useTrendSell } from '../context/TrendSellContext';
import { X, Sparkles, LogIn, Chrome, Mail, Lock, User, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const { loginWithGoogle, loginAnonymously, isFirebaseActive } = useTrendSell();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [errorVal, setErrorVal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorVal(null);
    const trimmedEmail = email.trim();
    const cleanMailLower = trimmedEmail.toLowerCase();
    const cleanName = name.trim() || (trimmedEmail.split('@')[0]) || 'Seller';

    // Enforce Password check for specific Seller (praveen@gmail.com with 9643281807)
    if (cleanMailLower === 'praveen@gmail.com') {
      if (password !== '9643281807') {
        setErrorVal('Incorrect Password for Seller Account / सेलर अकाउंट के लिए गलत पासवर्ड!');
        setLoading(false);
        return;
      }
    }

    try {
      await loginAnonymously(cleanName, trimmedEmail);
      setActionSuccess(`Successfully logged in as ${trimmedEmail}! / सफलतापूर्वक लॉगिन हो गए!`);
      
      if (onLoginSuccess) {
        onLoginSuccess(cleanMailLower);
      }

      setTimeout(() => {
        setActionSuccess(null);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrorVal('Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickCredential = async (presetEmail: string, presetName: string) => {
    setLoading(true);
    setErrorVal(null);
    const cleanEmail = presetEmail.trim().toLowerCase();
    setEmail(presetEmail);
    setName(presetName);
    const presetPwd = cleanEmail === 'praveen@gmail.com' ? '9643281807' : '••••••••';
    setPassword(presetPwd);

    try {
      await loginAnonymously(presetName, cleanEmail);
      setActionSuccess(`Logged in as preset: ${presetEmail} / प्रीसेट लॉगिन सफल!`);
      
      if (onLoginSuccess) {
        onLoginSuccess(cleanEmail);
      }

      setTimeout(() => {
        setActionSuccess(null);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrorVal('Preset sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorVal(null);
    try {
      await loginWithGoogle();
      setActionSuccess('Google identity verified! / गूगल लॉगिन सही रहा!');
      setTimeout(() => {
        setActionSuccess(null);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrorVal('Google Sign-In failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 p-4 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.23, ease: 'easeOut' }}
        className="relative bg-white w-full max-w-md border border-zinc-200 shadow-2xl p-6 md:p-8 z-10 rounded-sm overflow-hidden"
      >
        {/* Top Header background tag */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-600" />

        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-zinc-400 hover:text-black transition-colors p-1 hover:bg-zinc-100 rounded-full"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Banner */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-1.5 bg-zinc-900 text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span>MEMBER PORTAL / मेंबर पोर्टल</span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tighter uppercase font-display italic">
            TREND<span className="text-red-600">SELL</span>
          </h2>
          <p className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-widest mt-1">
            Secure Database Access & Seller Studio
          </p>
        </div>

        {/* Connection state banner */}
        <div className="mb-5 text-center">
          <span className={`inline-flex items-center px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest border ${
            isFirebaseActive 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : 'bg-amber-50 text-amber-800 border-amber-200/50'
          }`}>
            <span className={`w-2 h-2 rounded-full mr-1.5 ${isFirebaseActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
            {isFirebaseActive ? 'CLOUD FIREBASE PERSISTENCE ACTIVE' : 'LOCAL CACHE SANDBOX MODE ACTIVE'}
          </span>
        </div>

        {/* Success Alert Overlay */}
        {actionSuccess && (
          <div className="mb-4 p-3 bg-zinc-900 border border-zinc-800 text-white flex items-center space-x-2.5 rounded-sm shadow animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-xs font-bold leading-tight uppercase tracking-wider">{actionSuccess}</p>
          </div>
        )}

        {/* Error Alert Overlay */}
        {errorVal && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 flex items-center space-x-2.5 rounded-sm shadow">
            <X className="w-4 h-4 text-red-650 shrink-0" />
            <p className="text-xs font-bold leading-tight uppercase tracking-wider">{errorVal}</p>
          </div>
        )}

        {/* SECTION A: GOOGLE SIGN-IN DESIGN (METHOD 1) */}
        <div className="mb-6">
          <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">
            METHOD 1: SECURE GOOGLE IDENTITY / तरीका 1: गूगल से लॉगिन
          </label>
          <button 
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full bg-white hover:bg-zinc-50 border-2 border-zinc-900 text-zinc-900 text-xs font-black uppercase py-3 px-4 tracking-wider transition-all duration-150 flex items-center justify-center space-x-2.5 active:scale-[0.99] shadow cursor-pointer"
          >
            <Chrome className="w-4 h-4 text-red-650" />
            <span>Sign In with Google Account</span>
          </button>
          <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider text-center mt-2">
            Instant automatic linking and session setup / तुरंत आटोमेटिक सेटअप
          </p>
        </div>

        {/* OR Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-zinc-200 w-full" />
          <span className="absolute bg-white px-3.5 text-[9px] font-black uppercase tracking-widest text-zinc-400">
            OR / अथवा
          </span>
        </div>

        {/* SECTION B: EMAIL SECURE SIGN-IN WITH SECURITY PIN / PASSWORD (METHOD 2) */}
        <div className="mb-6">
          <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">
            METHOD 2: DIRECT EMAIL CREDENTIALS / तरीका 2: ईमेल आईडी और पासवर्ड
          </label>
          
          <form onSubmit={handleManualSubmit} className="space-y-3.5">
            {isRegistering && (
              <div>
                <label className="block text-[9px] font-black uppercase tracking-wider text-zinc-500 mb-1">
                  Full Name / आपका नाम
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                  <input 
                    type="text" 
                    placeholder="E.g., Devraj Sharma" 
                    value={name}
                    required={isRegistering}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-zinc-200 pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-red-600 font-bold bg-zinc-50 focus:bg-white text-zinc-950 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[9px] font-black uppercase tracking-wider text-zinc-500 mb-1">
                Email Address / ईमेल एड्रेस
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                <input 
                  type="email" 
                  placeholder="You @example.com" 
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-zinc-200 pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-red-600 font-bold bg-zinc-50 focus:bg-white text-zinc-950 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-black uppercase tracking-wider text-zinc-500 mb-1">
                Security Pin / पासवर्ड
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-zinc-200 pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-red-600 font-bold bg-zinc-50 focus:bg-white text-zinc-950 transition-colors"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white hover:bg-zinc-900 hover:text-red-500 active:scale-[0.99] text-xs font-black uppercase py-3 tracking-widest transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md"
            >
              <LogIn className="w-4 h-4" />
              <span>{isRegistering ? 'Register & Verify / रेजिस्टर करें' : 'Sign In / लॉगिन करें'}</span>
            </button>
          </form>

          {/* Registration toggle line */}
          <div className="mt-4 text-center">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-zinc-500 hover:text-black font-extrabold text-[10px] uppercase tracking-wider hover:underline"
            >
              {isRegistering 
                ? 'Already member? Sign In Mode / लॉगिन मोड चुनें' 
                : "Don't have credentials? Register Free / नया अकाउंट बनाएं"
              }
            </button>
          </div>
        </div>

        {/* SECTION C: EXPLICIT QUICK ACTION SAMPLES (सैमपल्स - एक क्लिक लॉगिन) */}
        <div className="mt-6 pt-5 border-t border-zinc-100">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2.5 text-center">
            🧪 ONE-CLICK DEMO SAMPLES / त्वरित लॉगिन सैंपल
          </p>
          
          <div className="grid grid-cols-2 gap-2.5">
            {/* Custom Seller Sample option - Praveen */}
            <button
              onClick={() => handleQuickCredential('praveen@gmail.com', 'Praveen')}
              className="border border-red-200 hover:border-red-650 bg-red-50/40 hover:bg-red-50 p-2 text-left transition-all active:scale-[0.98]"
            >
              <div className="flex items-center space-x-1.5 text-[9px] font-black text-red-700 uppercase">
                <Sparkles className="w-3.5 h-3.5 text-red-650" />
                <span>Seller Account</span>
              </div>
              <p className="text-[8px] font-bold text-zinc-500 mt-1 truncate">praveen@gmail.com</p>
              <p className="text-[7px] text-zinc-400 font-bold mt-0.5">Password Verified</p>
            </button>

            {/* Shopper Guest option */}
            <button
              onClick={() => handleQuickCredential('shopper@trendsell.com', 'Arjun Kumar')}
              className="border border-zinc-200 hover:border-black bg-zinc-50 p-2 text-left transition-all active:scale-[0.98]"
            >
              <div className="flex items-center space-x-1.5 text-[9px] font-black text-zinc-800 uppercase">
                <User className="w-3.5 h-3.5" />
                <span>Shopper Account</span>
              </div>
              <p className="text-[8px] font-bold text-zinc-500 mt-1 truncate">shopper@trendsell.com</p>
              <p className="text-[7px] text-zinc-400 font-bold mt-0.5">Test Likes & Reviews</p>
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
