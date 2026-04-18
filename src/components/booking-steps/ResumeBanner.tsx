'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Clock, X } from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';

export function ResumeBanner() {
  const [visible, setVisible] = useState(false);
  const hasIncomplete = useBookingStore((s) => s.selectedServices.length > 0 && s.currentStep !== 'confirmation');
  const currentStep = useBookingStore((s) => s.currentStep);
  const nextStep = useBookingStore((s) => s.nextStep);

  useEffect(() => {
    if (hasIncomplete) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [hasIncomplete]);

  if (!hasIncomplete) return null;

  const stepLabels = {
    services: 'service selection',
    'date-time': 'date & time',
    details: 'your details',
    confirmation: 'confirmation',
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-0 right-0 z-40 container mx-auto px-4"
        >
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl shadow-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">Continue your booking?</p>
                <p className="text-xs text-white/80">
                  You were at: {stepLabels[currentStep]}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={nextStep}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary-700 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors"
              >
                Resume
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setVisible(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
