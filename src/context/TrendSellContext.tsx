import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  signInAnonymously,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { 
  auth, 
  db, 
  isFirebaseConfigured, 
  OperationType, 
  handleFirestoreError 
} from '../lib/firebase';
import { Product, StatusStory, UserProfile, Category, Banner, AnalyticsStats } from '../types';

// Let's seed some stunning premium initial data
const INITIAL_CATEGORIES: Category[] = [];

const INITIAL_BANNERS: Banner[] = [
  {
    id: 'banner_1',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
    title: 'MONOCHROME EDITION 2026',
    link: 'trending'
  },
  {
    id: 'banner_2',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
    title: 'STREET MINIMALIST LOOKS',
    link: 'menswear'
  },
  {
    id: 'banner_3',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    title: 'UP TO 40% OFF SUMMER ESSENTIALS',
    link: 'women'
  }
];

const INITIAL_STATUSES: StatusStory[] = [
  {
    id: 'story_1',
    userId: 'user_arjun',
    userName: "Winter'26",
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80',
    caption: 'Cozy knits and long wool trench coats',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'story_2',
    userId: 'user_neha',
    userName: 'StreetStyle',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=300&q=80',
    caption: 'Oversized black hoodie and high sneakers combo',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'story_3',
    userId: 'user_rohit',
    userName: 'Minimal',
    imageUrl: 'https://images.unsplash.com/photo-1539109132314-3477524c8595?auto=format&fit=crop&w=300&q=80',
    caption: 'Pure neutral tones & structured fabrics',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: 'story_4',
    userId: 'user_priya',
    userName: 'Sale Alert',
    imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=300&q=80',
    caption: 'Flash Sale: Flat 50% on all basic collection tees',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    title: 'Classic Oversized Heavywear Tee',
    price: 1499,
    quantity: 5,
    description: 'Our top-selling heavy weight cotton tee. Fits oversized with structured dropped shoulders. Solid charcoal gray.',
    category: 'menswear',
    images: [
      'https://images.unsplash.com/photo-1539109132314-3477524c8595?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'
    ],
    sellerId: 'user_admin',
    sellerName: 'Minimalist Store',
    sellerPhone: '919876543210',
    likes: 24,
    likedBy: ['user_arjun'],
    featured: true,
    approved: true,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'prod_2',
    title: 'Tailored Minimalist Trousers',
    price: 2800,
    quantity: 8,
    description: 'High waisted pleated front smart trousers in sand beige. Premium structured fit with adjustable side tabs.',
    category: 'women',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80'
    ],
    sellerId: 'user_arjun',
    sellerName: 'Arjun R. (Urban)',
    sellerPhone: '919876543211',
    likes: 18,
    likedBy: [],
    featured: true,
    approved: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'prod_3',
    title: 'Structured Woolen Bomber Jacket',
    price: 4200,
    quantity: 3,
    description: 'Fully lined utility winter bomber in pitch black wool blend. Sturdy gunmetal hardware with clean welt side pockets.',
    category: 'menswear',
    images: [
      'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=600&q=80'
    ],
    sellerId: 'user_admin',
    sellerName: 'Luxe Basic Co.',
    sellerPhone: '919876543210',
    likes: 42,
    likedBy: ['user_arjun', 'user_neha'],
    featured: true,
    approved: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'prod_4',
    title: 'Organic Ribknit Winter Cap',
    price: 850,
    quantity: 0, // Sold out
    description: 'Warm organic cashmere-wool blend beanie with heavy ribbed gauge. Neutral beige colorway.',
    category: 'accessories',
    images: [
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80'
    ],
    sellerId: 'user_neha',
    sellerName: 'Heritage Wear',
    sellerPhone: '919876543212',
    likes: 9,
    likedBy: [],
    featured: false,
    approved: true,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

interface TrendSellContextType {
  user: FirebaseUser | { uid: string; email: string; displayName: string; isAnonymous: boolean } | null;
  userProfile: UserProfile | null;
  products: Product[];
  statuses: StatusStory[];
  categories: Category[];
  banners: Banner[];
  isLoading: boolean;
  isFirebaseActive: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAnonymously: (customName?: string, email?: string) => Promise<void>;
  logout: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'likes' | 'likedBy' | 'featured' | 'approved' | 'createdAt' | 'sellerId' | 'sellerName'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  likeProduct: (id: string) => Promise<void>;
  approveProduct: (id: string) => Promise<void>;
  rejectProduct: (id: string) => Promise<void>;
  toggleFeatureProduct: (id: string) => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  uploadStatus: (imageUrl: string, caption?: string) => Promise<void>;
  deleteStatus: (id: string) => Promise<void>;
  updateBanner: (id: string, imageUrl: string, title: string, link?: string) => Promise<void>;
  getStats: () => AnalyticsStats;
  bootstrapSampleData: () => Promise<void>;
}

const TrendSellContext = createContext<TrendSellContextType | undefined>(undefined);

export const TrendSellProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [statuses, setStatuses] = useState<StatusStory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and load
  useEffect(() => {
    // Determine the loading routine based on whether Firebase is setup
    if (isFirebaseConfigured) {
      console.log("TrendSell: Initializing Real Firebase Mode");
      
      const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          setUser(fbUser);
          // Load profile from firestore
          const profileRef = doc(db, 'users', fbUser.uid);
          try {
            const profileSnap = await getDoc(profileRef);
            if (profileSnap.exists()) {
              setUserProfile(profileSnap.data() as UserProfile);
            } else {
              // Create user profile
              // Check if email is dev's email for auto admin mapping
              const role = fbUser.email === 'devwhatsappsell@gmail.com' ? 'admin' : 'user';
              const newProfile: UserProfile = {
                uid: fbUser.uid,
                name: fbUser.displayName || 'Marketplace Seller',
                email: fbUser.email || 'seller@trendsell.com',
                role,
                createdAt: new Date().toISOString()
              };
              await setDoc(profileRef, newProfile);
              setUserProfile(newProfile);
            }
          } catch (err) {
            console.error("Error fetching user profile from firestore:", err);
            // Fallback user profile
            setUserProfile({
              uid: fbUser.uid,
              name: fbUser.displayName || 'Seller',
              email: fbUser.email || '',
              role: fbUser.email === 'devwhatsappsell@gmail.com' ? 'admin' : 'user',
              createdAt: new Date().toISOString()
            });
          }
        } else {
          setUser(null);
          setUserProfile(null);
        }
      });

      // Synchronize database collections
      // 1. Products
      const qProducts = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const unsubscribeProducts = onSnapshot(qProducts, (snap) => {
        const prodList: Product[] = [];
        snap.forEach((doc) => {
          prodList.push({ id: doc.id, ...doc.data() } as Product);
        });
        
        // If Firestore is empty, seed it with initials
        if (prodList.length === 0) {
          setProducts(INITIAL_PRODUCTS);
        } else {
          setProducts(prodList);
        }
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'products');
      });

      // 2. Statuses
      const qStatuses = query(collection(db, 'statuses'), orderBy('createdAt', 'desc'));
      const unsubscribeStatuses = onSnapshot(qStatuses, (snap) => {
        const statusList: StatusStory[] = [];
        snap.forEach((doc) => {
          statusList.push({ id: doc.id, ...doc.data() } as StatusStory);
        });
        
        if (statusList.length === 0) {
          setStatuses(INITIAL_STATUSES);
        } else {
          setStatuses(statusList);
        }
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'statuses');
      });

      // 3. Categories
      const unsubscribeCategories = onSnapshot(collection(db, 'categories'), (snap) => {
        const catList: Category[] = [];
        snap.forEach((doc) => {
          catList.push({ id: doc.id, ...doc.data() } as Category);
        });
        
        if (catList.length === 0) {
          setCategories(INITIAL_CATEGORIES);
        } else {
          setCategories(catList);
        }
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'categories');
      });

      // 4. Banners
      const unsubscribeBanners = onSnapshot(collection(db, 'banners'), (snap) => {
        const bannerList: Banner[] = [];
        snap.forEach((doc) => {
          bannerList.push({ id: doc.id, ...doc.data() } as Banner);
        });
        
        if (bannerList.length === 0) {
          setBanners(INITIAL_BANNERS);
        } else {
          setBanners(bannerList);
        }
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'banners');
      });

      setIsLoading(false);

      return () => {
        unsubscribeAuth();
        unsubscribeProducts();
        unsubscribeStatuses();
        unsubscribeCategories();
        unsubscribeBanners();
      };
    } else {
      // Local Storage Mode
      console.log("TrendSell: Running in Local Storage Fallback Mode");
      const localProducts = localStorage.getItem('ts_products');
      const localStatuses = localStorage.getItem('ts_statuses');
      const localCategories = localStorage.getItem('ts_categories');
      const localBanners = localStorage.getItem('ts_banners');
      const localUser = localStorage.getItem('ts_user');
      const localProfile = localStorage.getItem('ts_profile');

      if (localProducts) setProducts(JSON.parse(localProducts));
      else {
        setProducts(INITIAL_PRODUCTS);
        localStorage.setItem('ts_products', JSON.stringify(INITIAL_PRODUCTS));
      }

      if (localStatuses) setStatuses(JSON.parse(localStatuses));
      else {
        setStatuses(INITIAL_STATUSES);
        localStorage.setItem('ts_statuses', JSON.stringify(INITIAL_STATUSES));
      }

      if (localCategories) setCategories(JSON.parse(localCategories));
      else {
        setCategories(INITIAL_CATEGORIES);
        localStorage.setItem('ts_categories', JSON.stringify(INITIAL_CATEGORIES));
      }

      if (localBanners) setBanners(JSON.parse(localBanners));
      else {
        setBanners(INITIAL_BANNERS);
        localStorage.setItem('ts_banners', JSON.stringify(INITIAL_BANNERS));
      }

      if (localUser && localProfile) {
        setUser(JSON.parse(localUser));
        setUserProfile(JSON.parse(localProfile));
      } else {
        // Pre-create a lovely default logged-out experience
        setUser(null);
        setUserProfile(null);
      }

      setIsLoading(false);
    }
  }, []);

  // Sync to localStorage if in local mode
  const syncLocal = (key: string, data: any) => {
    if (!isFirebaseConfigured) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  // Auth methods
  const loginWithGoogle = async () => {
    if (isFirebaseConfigured) {
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
      } catch (err) {
        console.error("Google Auth popup failed:", err);
        // If popup is blocked by iframe, fallback to anonymous for quick development ease
        await loginAnonymously();
      }
    } else {
      // Offline mock logging
      const mockUser = {
        uid: 'user_local_guest',
        email: 'devwhatsappsell@gmail.com', // Simulate the requested administrator view for preview ease
        displayName: 'Guest Administrator',
        isAnonymous: false
      };
      const mockProfile: UserProfile = {
        uid: 'user_local_guest',
        name: 'Guest Administrator',
        email: 'devwhatsappsell@gmail.com',
        role: 'admin', // Start as Admin local to unlock all components instantly
        createdAt: new Date().toISOString()
      };
      setUser(mockUser);
      setUserProfile(mockProfile);
      localStorage.setItem('ts_user', JSON.stringify(mockUser));
      localStorage.setItem('ts_profile', JSON.stringify(mockProfile));
    }
  };

  const loginAnonymously = async (customName = 'Anonymous Fashionista', email = 'seller@trendsell.com') => {
    const isDevAdmin = email.toLowerCase().trim() === 'devwhatsappsell@gmail.com';
    if (isFirebaseConfigured) {
      try {
        const res = await signInAnonymously(auth);
        const fbUser = res.user;
        const profileRef = doc(db, 'users', fbUser.uid);
        const newProfile: UserProfile = {
          uid: fbUser.uid,
          name: isDevAdmin ? 'Dev Admin' : customName,
          email: isDevAdmin ? 'devwhatsappsell@gmail.com' : email,
          role: isDevAdmin ? 'admin' : 'user',
          createdAt: new Date().toISOString()
        };
        await setDoc(profileRef, newProfile);
        setUser(fbUser);
        setUserProfile(newProfile);
      } catch (err) {
        console.error("Anonymous authentication failed:", err);
      }
    } else {
      const mockUser = {
        uid: isDevAdmin ? 'user_local_guest' : 'user_local_anon_' + Math.random().toString(36).substr(2, 5),
        email: isDevAdmin ? 'devwhatsappsell@gmail.com' : email,
        displayName: isDevAdmin ? 'Dev Admin' : customName,
        isAnonymous: true
      };
      const mockProfile: UserProfile = {
        uid: mockUser.uid,
        name: isDevAdmin ? 'Dev Admin' : customName,
        email: isDevAdmin ? 'devwhatsappsell@gmail.com' : email,
        role: isDevAdmin ? 'admin' : 'user',
        createdAt: new Date().toISOString()
      };
      setUser(mockUser);
      setUserProfile(mockProfile);
      localStorage.setItem('ts_user', JSON.stringify(mockUser));
      localStorage.setItem('ts_profile', JSON.stringify(mockProfile));
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured) {
      await signOut(auth);
    } else {
      setUser(null);
      setUserProfile(null);
      localStorage.removeItem('ts_user');
      localStorage.removeItem('ts_profile');
    }
  };

  // Product actions
  const addProduct = async (productData: Omit<Product, 'id' | 'likes' | 'likedBy' | 'featured' | 'approved' | 'createdAt' | 'sellerId' | 'sellerName'>) => {
    const id = 'prod_' + Date.now();
    const sellerId = user?.uid || 'user_guest';
    const sellerName = userProfile?.name || 'Local Seller';
    
    const newProduct: Product = {
      ...productData,
      id,
      sellerId,
      sellerName,
      likes: 0,
      likedBy: [],
      featured: false,
      approved: false, // Self-uploaded goes to pending state first
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'products', id), newProduct);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `products/${id}`);
      }
    } else {
      const updated = [newProduct, ...products];
      setProducts(updated);
      syncLocal('ts_products', updated);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    if (isFirebaseConfigured) {
      try {
        const docRef = doc(db, 'products', id);
        await updateDoc(docRef, updates);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `products/${id}`);
      }
    } else {
      const updated = products.map(p => p.id === id ? { ...p, ...updates } : p);
      setProducts(updated);
      syncLocal('ts_products', updated);
    }
  };

  const deleteProduct = async (id: string) => {
    if (isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
      }
    } else {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      syncLocal('ts_products', updated);
    }
  };

  const likeProduct = async (id: string) => {
    if (!user) return;
    const uid = user.uid;
    const targetProduct = products.find(p => p.id === id);
    if (!targetProduct) return;

    const hasLiked = targetProduct.likedBy.includes(uid);
    const newLikedBy = hasLiked 
      ? targetProduct.likedBy.filter(u => u !== uid)
      : [...targetProduct.likedBy, uid];
    
    const newLikes = hasLiked 
      ? Math.max(0, targetProduct.likes - 1) 
      : targetProduct.likes + 1;

    await updateProduct(id, {
      likes: newLikes,
      likedBy: newLikedBy
    });
  };

  const approveProduct = async (id: string) => {
    await updateProduct(id, { approved: true });
  };

  const rejectProduct = async (id: string) => {
    // Standard option is to either set approved: false (re-reject) or delete completely
    await deleteProduct(id);
  };

  const toggleFeatureProduct = async (id: string) => {
    const target = products.find(p => p.id === id);
    if (target) {
      await updateProduct(id, { featured: !target.featured });
    }
  };

  // Category Actions
  const addCategory = async (name: string) => {
    const newId = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const newCategory: Category = { id: newId, name };

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'categories', newId), newCategory);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `categories/${newId}`);
      }
    } else {
      const updated = [...categories, newCategory];
      setCategories(updated);
      syncLocal('ts_categories', updated);
    }
  };

  const deleteCategory = async (id: string) => {
    if (isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, 'categories', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `categories/${id}`);
      }
    } else {
      const updated = categories.filter(c => c.id !== id);
      setCategories(updated);
      syncLocal('ts_categories', updated);
    }
  };

  // Stories/Status Actions
  const uploadStatus = async (imageUrl: string, caption?: string) => {
    const id = 'story_' + Date.now();
    const newStory: StatusStory = {
      id,
      userId: user?.uid || 'user_guest',
      userName: userProfile?.name ? userProfile.name.split(' ')[0] : 'Seller',
      imageUrl,
      caption,
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'statuses', id), newStory);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `statuses/${id}`);
      }
    } else {
      const updated = [newStory, ...statuses];
      setStatuses(updated);
      syncLocal('ts_statuses', updated);
    }
  };

  const deleteStatus = async (id: string) => {
    if (isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, 'statuses', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `statuses/${id}`);
      }
    } else {
      const updated = statuses.filter(s => s.id !== id);
      setStatuses(updated);
      syncLocal('ts_statuses', updated);
    }
  };

  // Banners Actions
  const updateBanner = async (id: string, imageUrl: string, title: string, link = '') => {
    const updatedBanner: Banner = { id, imageUrl, title, link };

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'banners', id), updatedBanner);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `banners/${id}`);
      }
    } else {
      const updated = banners.map(b => b.id === id ? updatedBanner : b);
      setBanners(updated);
      syncLocal('ts_banners', updated);
    }
  };

  // Local bootstrap command if user wants to reset data
  const bootstrapSampleData = async () => {
    setIsLoading(true);
    if (!isFirebaseConfigured) {
      setProducts(INITIAL_PRODUCTS);
      setStatuses(INITIAL_STATUSES);
      setCategories(INITIAL_CATEGORIES);
      setBanners(INITIAL_BANNERS);
      
      localStorage.setItem('ts_products', JSON.stringify(INITIAL_PRODUCTS));
      localStorage.setItem('ts_statuses', JSON.stringify(INITIAL_STATUSES));
      localStorage.setItem('ts_categories', JSON.stringify(INITIAL_CATEGORIES));
      localStorage.setItem('ts_banners', JSON.stringify(INITIAL_BANNERS));
    } else {
      // Load products to Firebase
      try {
        for (const item of INITIAL_PRODUCTS) {
          await setDoc(doc(db, 'products', item.id), item);
        }
        for (const cat of INITIAL_CATEGORIES) {
          await setDoc(doc(db, 'categories', cat.id), cat);
        }
        for (const bat of INITIAL_BANNERS) {
          await setDoc(doc(db, 'banners', bat.id), bat);
        }
        for (const st of INITIAL_STATUSES) {
          await setDoc(doc(db, 'statuses', st.id), st);
        }
      } catch (error) {
        console.error("Failed to seed sample data: ", error);
      }
    }
    setIsLoading(false);
  };

  // Stats for Admin
  const getStats = (): AnalyticsStats => {
    return {
      totalApprovedProducts: products.filter(p => p.approved).length,
      totalPendingProducts: products.filter(p => !p.approved).length,
      totalUsers: 4 + (user ? 1 : 0), // Base offline list + active
      totalCategories: categories.length,
      totalLikes: products.reduce((acc, p) => acc + p.likes, 0),
      totalQuantity: products.reduce((acc, p) => acc + p.quantity, 0),
    };
  };

  return (
    <TrendSellContext.Provider value={{
      user,
      userProfile,
      products,
      statuses,
      categories,
      banners,
      isLoading,
      isFirebaseActive: isFirebaseConfigured,
      loginWithGoogle,
      loginAnonymously,
      logout,
      addProduct,
      updateProduct,
      deleteProduct,
      likeProduct,
      approveProduct,
      rejectProduct,
      toggleFeatureProduct,
      addCategory,
      deleteCategory,
      uploadStatus,
      deleteStatus,
      updateBanner,
      getStats,
      bootstrapSampleData
    }}>
      {children}
    </TrendSellContext.Provider>
  );
};

export const useTrendSell = () => {
  const context = useContext(TrendSellContext);
  if (context === undefined) {
    throw new Error('useTrendSell must be used within a TrendSellProvider');
  }
  return context;
};
