'use client';

import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import { mockPricingTiers } from '@/data/mockData';
import { formatPrice } from '@/lib/utils';
import { useBookingStore } from '@/store/bookingStore';

// Fixed: Hoisted outside component to avoid recreation
const COLOR_CONFIG = {
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
} as const;

export function PricingTiers() {
  const { addService, setStep } = useBookingStore();

  const handleGetStarted = (tierId: string, tierName: string) => {
    const serviceMap: Record<string, typeof mockPricingTiers[0]> = {
      basic: mockPricingTiers[0],
      premium: mockPricingTiers[1],
      enterprise: mockPricingTiers[2],
    };
    const tier = serviceMap[tierId];
    if (tier) {
      const service = {
        id: tierId,
        name: tier.name,
        description: tier.description,
        price: tier.price,
        duration: tier.features.length * 30,
        category: 'regular-cleaning' as const,
      };
      addService(service);
      setStep('date-time');
      // Custom event for toast - picked up by ToastContainer
      if (typeof window !== 'undefined') {
        const evt = new CustomEvent('toast-show', { detail: { message: `✅ ${tierName} added to your booking!`, type: 'success' } });
        window.dispatchEvent(evt);
      }
    }
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

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
          const colors = COLOR_CONFIG[tier.color as keyof typeof COLOR_CONFIG];

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
              {tier.isPopular && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2"
                >
                  <div
                    className={`flex items-center gap-2 px-4 py-2 ${colors.badge} text-white rounded-full text-sm font-semibold shadow-lg`}
                  >
                    <Star className="w-4 h-4" aria-hidden="true" />
                    Most Popular
                  </div>
                </motion.div>
              )}

              <h4 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h4>
              <p className="text-gray-600 mb-6">{tier.description}</p>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">
                    {formatPrice(tier.price)}
                  </span>
                  <span className="text-gray-600">/{tier.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div
                      className={`mt-1 p-1 rounded-full ${
                        feature.included
                          ? 'bg-primary-600'
                          : 'bg-gray-300'
                      }`}
                      aria-hidden="true"
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

              <button
                onClick={() => handleGetStarted(tier.id, tier.name)}
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
