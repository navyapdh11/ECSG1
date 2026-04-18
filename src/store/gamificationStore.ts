import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserPoints, Achievement, UserReward, UserLevel } from '@/types';

interface GamificationStore {
  // State
  userPoints: UserPoints | null;
  achievements: Achievement[];
  availableRewards: UserReward[];
  isLoading: boolean;
  bookingStreak: number;
  lastBookingDate: string | null;
  
  // Actions
  addPoints: (points: number) => void;
  redeemPoints: (points: number) => void;
  unlockAchievement: (achievementId: string) => void;
  redeemReward: (rewardId: string) => void;
  setUserPoints: (userPoints: UserPoints) => void;
  setLoading: (loading: boolean) => void;
  recordBooking: () => void;
  
  // Computed
  getLevel: () => UserLevel;
  getLevelProgress: () => { current: number; required: number };
  canAffordReward: (pointsCost: number) => boolean;
}

const LEVEL_THRESHOLDS: Record<UserLevel, number> = {
  bronze: 0,
  silver: 100,
  gold: 500,
  platinum: 1500,
  diamond: 5000,
};

const LEVEL_ORDER: UserLevel[] = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];

function calculateLevel(totalPoints: number): UserLevel {
  let level: UserLevel = 'bronze';
  for (const [lvl, threshold] of Object.entries(LEVEL_THRESHOLDS)) {
    if (totalPoints >= threshold) {
      level = lvl as UserLevel;
    }
  }
  return level;
}

export const useGamificationStore = create<GamificationStore>()(
  persist(
    (set, get) => ({
      // Initial state
      userPoints: null,
      achievements: [],
      availableRewards: [],
      isLoading: false,
      bookingStreak: 0,
      lastBookingDate: null,

      // Actions
      addPoints: (points) => {
        const { userPoints } = get();
        if (!userPoints) return;
        
        const newTotal = userPoints.totalPoints + points;
        const newLifetime = userPoints.lifetimePoints + points;
        const newLevel = calculateLevel(newLifetime);
        
        set({
          userPoints: {
            ...userPoints,
            totalPoints: newTotal,
            availablePoints: userPoints.availablePoints + points,
            lifetimePoints: newLifetime,
            level: newLevel,
          },
        });
      },

      redeemPoints: (points) => {
        const { userPoints } = get();
        if (!userPoints || userPoints.availablePoints < points) return;
        
        set({
          userPoints: {
            ...userPoints,
            availablePoints: userPoints.availablePoints - points,
            totalPoints: userPoints.totalPoints - points,
          },
        });
      },

      unlockAchievement: (achievementId) => {
        const { achievements, userPoints } = get();
        const achievement = achievements.find((a) => a.id === achievementId);
        if (!achievement || achievement.unlockedAt) return;
        
        const updatedAchies = achievements.map((a) =>
          a.id === achievementId
            ? { ...a, unlockedAt: new Date() }
            : a
        );
        
        // Bonus points for unlocking achievement
        const bonusPoints = achievement.pointsRequired;
        const newPoints = userPoints
          ? {
              ...userPoints,
              totalPoints: userPoints.totalPoints + bonusPoints,
              availablePoints: userPoints.availablePoints + bonusPoints,
            }
          : null;
        
        set({
          achievements: updatedAchies,
          userPoints: newPoints,
        });
      },

      redeemReward: (rewardId) => {
        const { availableRewards, userPoints } = get();
        const userReward = availableRewards.find((r) => r.reward.id === rewardId);
        if (!userReward || !userPoints) return;
        
        if (userPoints.availablePoints < userReward.reward.pointsCost) return;
        
        // Deduct points and mark reward as redeemed
        set({
          userPoints: {
            ...userPoints,
            availablePoints: userPoints.availablePoints - userReward.reward.pointsCost,
            totalPoints: userPoints.totalPoints - userReward.reward.pointsCost,
            rewards: [
              ...userPoints.rewards,
              {
                reward: userReward.reward,
                redeemedAt: new Date(),
                expiresAt: userReward.expiresAt,
                isUsed: false,
              },
            ],
          },
        });
      },

      setUserPoints: (userPoints) => set({ userPoints }),
      setLoading: (isLoading) => set({ isLoading }),
      
      recordBooking: () => {
        const { lastBookingDate, bookingStreak } = get();
        const today = new Date().toISOString().split('T')[0];
        
        if (lastBookingDate === today) return; // Already booked today
        
        const lastDate = lastBookingDate ? new Date(lastBookingDate) : null;
        const todayDate = new Date(today);
        const daysDiff = lastDate ? Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)) : 999;
        
        const newStreak = daysDiff <= 7 && daysDiff > 0 ? bookingStreak + 1 : 1;
        set({ bookingStreak: newStreak, lastBookingDate: today });
      },

      // Computed
      getLevel: () => {
        const { userPoints } = get();
        return userPoints?.level || 'bronze';
      },

      getLevelProgress: () => {
        const { userPoints } = get();
        if (!userPoints) return { current: 0, required: 100 };
        
        const currentIndex = LEVEL_ORDER.indexOf(userPoints.level);
        const nextLevel = LEVEL_ORDER[currentIndex + 1];
        if (!nextLevel) {
          return { current: userPoints.lifetimePoints, required: LEVEL_THRESHOLDS.diamond };
        }
        
        return {
          current: userPoints.lifetimePoints,
          required: LEVEL_THRESHOLDS[nextLevel],
        };
      },

      canAffordReward: (pointsCost) => {
        const { userPoints } = get();
        return userPoints ? userPoints.availablePoints >= pointsCost : false;
      },
    }),
    {
      name: 'gamification-storage',
      partialize: (state) => ({
        userPoints: state.userPoints,
        achievements: state.achievements,
        availableRewards: state.availableRewards,
        bookingStreak: state.bookingStreak,
        lastBookingDate: state.lastBookingDate,
      }),
    }
  )
);
