'use client';

import { motion } from 'framer-motion';
import { Lock, Check } from 'lucide-react';
import { useGamificationStore } from '@/store/gamificationStore';
import { mockAchievements } from '@/data/mockData';

export function AchievementBadges() {
  const { achievements, unlockAchievement, userPoints } = useGamificationStore();
  const lifetimePoints = userPoints?.lifetimePoints ?? 0;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Achievements</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {mockAchievements.map((achievement, index) => {
          const isUnlocked = achievements.some(
            (a) => a.id === achievement.id && a.unlockedAt
          );
          const canUnlock = lifetimePoints >= achievement.pointsRequired;

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                isUnlocked
                  ? 'border-primary-600 bg-gradient-to-br from-primary-50 to-accent-50 shadow-lg'
                  : canUnlock
                  ? 'border-warning-500 bg-white cursor-pointer hover:border-warning-600'
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
              onClick={() => {
                if (canUnlock && !isUnlocked) {
                  unlockAchievement(achievement.id);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (canUnlock && !isUnlocked) {
                    unlockAchievement(achievement.id);
                  }
                }
              }}
              tabIndex={canUnlock && !isUnlocked ? 0 : undefined}
              role={canUnlock && !isUnlocked ? 'button' : undefined}
              aria-label={`${achievement.name}: ${isUnlocked ? 'Unlocked' : `${achievement.pointsRequired} points required`}`}
            >
              {/* Icon */}
              <div className="text-4xl mb-3 text-center" aria-hidden="true">{achievement.icon}</div>
              
              {/* Name */}
              <h4 className="font-semibold text-gray-900 text-center mb-1">
                {achievement.name}
              </h4>
              
              {/* Description */}
              <p className="text-xs text-gray-600 text-center mb-2">
                {achievement.description}
              </p>
              
              {/* Points Required */}
              <div className="text-center">
                {isUnlocked ? (
                  <div className="inline-flex items-center gap-1 text-xs font-medium text-primary-600">
                    <Check className="w-3 h-3" aria-hidden="true" />
                    <span>Unlocked!</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1 text-xs font-medium text-gray-600">
                    <Lock className="w-3 h-3" aria-hidden="true" />
                    <span>{achievement.pointsRequired} pts</span>
                  </div>
                )}
              </div>

              {/* Unlock indicator for achievable ones */}
              {canUnlock && !isUnlocked && (
                <motion.div
                  className="absolute -top-2 -right-2 bg-warning-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  aria-hidden="true"
                >
                  Click!
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
