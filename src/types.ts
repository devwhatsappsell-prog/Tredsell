/**
 * Clean Minimalism types for TrendSell
 */

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'seller';
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  quantity: number;
  description: string;
  category: string;
  images: string[]; // URLs or base64
  sellerId: string;
  sellerName: string;
  sellerPhone: string; // WhatsApp number
  likes: number;
  likedBy: string[]; // user IDs
  featured: boolean;
  approved: boolean; // Managed by administrator
  createdAt: string;
}

export interface StatusStory {
  id: string;
  userId: string;
  userName: string;
  imageUrl: string;
  caption?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  link?: string;
}

export interface AnalyticsStats {
  totalApprovedProducts: number;
  totalPendingProducts: number;
  totalUsers: number;
  totalCategories: number;
  totalLikes: number;
  totalQuantity: number;
}
