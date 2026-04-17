'use client';

import { motion } from 'framer-motion';
import { Gift, Percent, Clock } from 'lucide-react';
import { useGamificationStore } from '@/store/gamificationStore';
import { mockRewards } from '@/data/mockData';
import { format } from 'date-fns';

export function RewardsDisplay() {
  const { userPoints, redeemReward, canAffordReward } = useGamificationStore();

  if (!userPoints) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Redeem Rewards</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockRewards.map((reward, index) => {
          const canAfford = canAffordReward(reward.pointsCost);

          return (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: canAfford ? 1.02 : 1 }}
              className={`p-5 rounded-xl border-2 transition-all ${
                canAfford
                  ? 'border-accent-600 bg-gradient-to-br from-accent-50 to-white shadow-md cursor-pointer hover:shadow-lg'
                  : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
              }`}
              onClick={() => {
                if (canAfford) {
                  redeemReward(reward.id);
                }
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent-100 rounded-lg">
                    {reward.discount ? (
                      <Percent className="w-5 h-5 text-accent-600" />
                    ) : (
                      <Gift className="w-5 h-5 text-accent-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{reward.name}</h4>
                    <p className="text-sm text-gray-600">{reward.description}</p>
                  </div>
                </div>
              </div>

              {/* Points Cost */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-600">
                    Expires: {format(reward.validUntil, 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-accent-600">{reward.pointsCost} pts</p>
                  {canAfford ? (
                    <p className="text-xs text-success-600">✓ Available</p>
                  ) : (
                    <p className="text-xs text-error-600">
                      Need {reward.pointsCost - userPoints.availablePoints} more pts
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
