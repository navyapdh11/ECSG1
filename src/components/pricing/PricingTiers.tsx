'use client';

import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import { mockPricingTiers } from '@/data/mockData';
import { formatPrice } from '@/lib/utils';

export function PricingTiers() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h3>
        <p className="text-lg text-gray-600">
          Transparent pricing with no hidden fees
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockPricingTiers.map((tier, index) => {
          const colorClasses = {
            primary: {
              bg: 'bg-primary-50',
              border: 'border-primary-200',
              button: 'bg-primary-600 hover:bg-primary-700',
              badge: 'bg-primary-600',
            },
            accent: {
              bg: 'bg-accent-50',
              border: 'border-accent-200',
              button: 'bg-accent-600 hover:bg-accent-700',
              badge: 'bg-accent-600',
            },
            success: {
              bg: 'bg-success-50',
              border: 'border-success-200',
              button: 'bg-success-600 hover:bg-success-700',
              badge: 'bg-success-600',
            },
          };

          const colors = colorClasses[tier.color as keyof typeof colorClasses];

          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className={`relative p-8 rounded-2xl border-2 ${colors.border} ${colors.bg} ${
                tier.isPopular ? 'shadow-2xl scale-105' : 'shadow-lg'
              }`}
            >
              {/* Popular Badge */}
              {tier.isPopular && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2"
                >
                  <div
                    className={`flex items-center gap-2 px-4 py-2 ${colors.badge} text-white rounded-full text-sm font-semibold shadow-lg`}
                  >
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                </motion.div>
              )}

              {/* Tier Name */}
              <h4 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h4>
              <p className="text-gray-600 mb-6">{tier.description}</p>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">
                    {formatPrice(tier.price)}
                  </span>
                  <span className="text-gray-600">/{tier.period}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div
                      className={`mt-1 p-1 rounded-full ${
                        feature.included
                          ? 'bg-primary-600'
                          : 'bg-gray-300'
                      }`}
                    >
                      <Check
                        className={`w-3 h-3 ${
                          feature.included ? 'text-white' : 'text-gray-500'
                        }`}
                      />
                    </div>
                    <span
                      className={`text-sm ${
                        feature.included ? 'text-gray-700' : 'text-gray-400'
                      }`}
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${colors.button}`}
              >
                Get Started
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
