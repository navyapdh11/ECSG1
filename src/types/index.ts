// Service types
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // minutes
  category: ServiceCategory;
  image?: string;
}

export type ServiceCategory = 
  | 'regular-cleaning'
  | 'deep-cleaning'
  | 'move-in-out'
  | 'office-cleaning'
  | 'carpet-cleaning'
  | 'window-cleaning'
  | 'specialized';

// Booking types
export interface Booking {
  id: string;
  userId?: string;
  services: BookingService[];
  date: Date;
  time: string;
  address: Address;
  status: BookingStatus;
  totalPrice: number;
  specialInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingService {
  service: Service;
  quantity: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'in-progress'
  | 'completed'
  | 'cancelled';

// Booking form steps
export type BookingStep = 
  | 'services'
  | 'date-time'
  | 'details'
  | 'confirmation';

// Gamification types
export interface UserPoints {
  userId: string;
  totalPoints: number;
  availablePoints: number;
  lifetimePoints: number;
  level: UserLevel;
  achievements: Achievement[];
  rewards: UserReward[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  pointsRequired: number;
  unlockedAt?: Date;
  category: AchievementCategory;
}

export type AchievementCategory = 
  | 'first-booking'
  | 'loyalty'
  | 'referral'
  | 'review'
  | 'milestone'
  | 'special';

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  discount?: number; // percentage
  validUntil: Date;
  isActive: boolean;
}

export interface UserReward {
  reward: Reward;
  redeemedAt: Date;
  expiresAt: Date;
  isUsed: boolean;
}

export type UserLevel = 
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'diamond';

// AI Assistant types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: ChatMetadata;
}

export interface ChatMetadata {
  intent?: ChatIntent;
  suggestedServices?: Service[];
  bookingData?: Partial<Booking>;
}

export type ChatIntent = 
  | 'book-service'
  | 'get-pricing'
  | 'check-availability'
  | 'cancel-booking'
  | 'general-inquiry'
  | 'complaint'
  | 'recommendation';

// Pricing types
export interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: number;
  period: 'one-time' | 'weekly' | 'biweekly' | 'monthly';
  features: PricingFeature[];
  isPopular?: boolean;
  discount?: number; // percentage
  color: string;
}

export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface PricingCalculator {
  selectedServices: Service[];
  frequency: PricingFrequency;
  addOns: AddOn[];
  totalPrice: number;
  discountedPrice?: number;
}

export type PricingFrequency = 'one-time' | 'weekly' | 'biweekly' | 'monthly';

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
}

// Common types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  addresses: Address[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  preferredTime?: string;
  preferredFrequency?: PricingFrequency;
  notifications: boolean;
  language: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
