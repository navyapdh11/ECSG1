'use client';

import { motion } from 'framer-motion';
import { Trophy, Star, TrendingUp } from 'lucide-react';
import { useGamificationStore } from '@/store/gamificationStore';
import type { UserLevel } from '@/types';

const levelColors: Record<UserLevel, string> = {
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  platinum: '#E5E4E2',
  diamond: '#B9F2FF',
};

const levelEmojis: Record<UserLevel, string> = {
  bronze: '🥉',
  silver: '🥈',
  gold: '🥇',
  platinum: '💠',
  diamond: '💎',
};

export function PointsTracker() {
  const { userPoints, getLevelProgress } = useGamificationStore();
  const { current, required } = getLevelProgress();
  const level = userPoints?.level || 'bronze';
  const progress = ((current % required) / required) * 100;

  if (!userPoints) return null;

  return (
    <div className="space-y-6">
      {/* Level Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-center"
      >
        <div
          className="inline-flex items-center justify-center w-24 h-24 rounded-full text-5xl mb-4"
          style={{ backgroundColor: levelColors[level] + '33' }}
        >
          {levelEmojis[level]}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 capitalize">{level} Member</h3>
      </motion.div>

      {/* Points Display */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl text-center"
        >
          <Trophy className="w-6 h-6 text-primary-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-primary-700">{userPoints.availablePoints}</p>
          <p className="text-sm text-primary-600">Available</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-4 bg-gradient-to-br from-accent-50 to-accent-100 rounded-xl text-center"
        >
          <Star className="w-6 h-6 text-accent-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-accent-700">{userPoints.totalPoints}</p>
          <p className="text-sm text-accent-600">Total</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-4 bg-gradient-to-br from-success-50 to-success-100 rounded-xl text-center"
        >
          <TrendingUp className="w-6 h-6 text-success-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-success-700">{userPoints.lifetimePoints}</p>
          <p className="text-sm text-success-600">Lifetime</p>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <div className="p-4 bg-white rounded-xl border-2 border-gray-200">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress to next level</span>
          <span>
            {current} / {required} points
          </span>
        </div>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}
