'use client';

import { PointsTracker } from './PointsTracker';
import { AchievementBadges } from './AchievementBadges';
import { RewardsDisplay } from './RewardsDisplay';
import { useGamificationStore } from '@/store/gamificationStore';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

export function GamificationSection() {
  const { userPoints, setUserPoints, bookingStreak } = useGamificationStore();

  // Initialize with mock data
  useEffect(() => {
    if (!userPoints) {
      setUserPoints({
        userId: 'demo-user',
        totalPoints: 350,
        availablePoints: 350,
        lifetimePoints: 350,
        level: 'silver',
        achievements: [],
        rewards: [],
      });
    }
  }, [userPoints, setUserPoints]);

  return (
    <section id="gamification" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Rewards & Gamification 🎮
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Earn points, unlock achievements, and redeem rewards
            </p>
          </div>

          {/* Streak Counter - #14 */}
          {bookingStreak > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto mb-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border-2 border-orange-200 dark:border-orange-800"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/40 rounded-xl">
                  <Flame className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                    🔥 {bookingStreak}-Week Streak!
                  </p>
                  <p className="text-sm text-orange-600 dark:text-orange-400">
                    {bookingStreak >= 3
                      ? `${5 - bookingStreak} more weeks to unlock Gold tier!`
                      : 'Keep booking weekly to build your streak!'}
                  </p>
                </div>
              </div>
              {/* Streak progress */}
              <div className="mt-3 h-2 bg-orange-200 dark:bg-orange-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((bookingStreak / 5) * 100, 100)}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Points & Rewards */}
            <div className="space-y-8">
              <div className="p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <PointsTracker />
              </div>
              <div className="p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <RewardsDisplay />
              </div>
            </div>

            {/* Right Column - Achievements */}
            <div className="p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl">
              <AchievementBadges />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
