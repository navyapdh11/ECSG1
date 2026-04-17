'use client';

import { PointsTracker } from './PointsTracker';
import { AchievementBadges } from './AchievementBadges';
import { RewardsDisplay } from './RewardsDisplay';
import { useGamificationStore } from '@/store/gamificationStore';
import { useEffect } from 'react';

export function GamificationSection() {
  const { userPoints, setUserPoints } = useGamificationStore();

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
    <section id="gamification" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Rewards & Gamification 🎮
            </h2>
            <p className="text-xl text-gray-600">
              Earn points, unlock achievements, and redeem rewards
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Points & Rewards */}
            <div className="space-y-8">
              <div className="p-8 bg-gray-50 rounded-2xl">
                <PointsTracker />
              </div>
              <div className="p-8 bg-gray-50 rounded-2xl">
                <RewardsDisplay />
              </div>
            </div>

            {/* Right Column - Achievements */}
            <div className="p-8 bg-gray-50 rounded-2xl">
              <AchievementBadges />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
