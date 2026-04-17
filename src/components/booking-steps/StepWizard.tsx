'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useBookingStore, BOOKING_STEPS } from '@/store/bookingStore';
import type { BookingStep } from '@/types';

const stepLabels: Record<BookingStep, string> = {
  'services': 'Select Services',
  'date-time': 'Date & Time',
  'details': 'Your Details',
  'confirmation': 'Confirmation',
};

export function BookingStepWizard({ onNext }: { onNext?: () => void }) {
  const { currentStep, nextStep, previousStep, canProceed } = useBookingStore();
  const currentIndex = BOOKING_STEPS.indexOf(currentStep);
  const progressPercent = (currentIndex / (BOOKING_STEPS.length - 1)) * 100;

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      if (canProceed()) nextStep();
    }
  };

  return (
    <div className="mb-8">
      {/* Progress Bar */}
      <div className="relative mb-8" role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={BOOKING_STEPS.length}>
        {/* Background line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 rounded-full" aria-hidden="true" />
        
        {/* Progress line */}
        <motion.div
          className="absolute top-1/2 left-0 h-1 bg-primary-600 -translate-y-1/2 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {BOOKING_STEPS.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            
            return (
              <div key={step} className="flex flex-col items-center gap-2">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    isCompleted
                      ? 'bg-primary-600 text-white'
                      : isCurrent
                      ? 'bg-primary-600 text-white ring-4 ring-primary-200'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                </motion.div>
                <span
                  className={`text-xs font-medium hidden sm:block ${
                    isCurrent ? 'text-primary-600' : 'text-gray-500'
                  }`}
                >
                  {stepLabels[step]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={previousStep}
          disabled={currentIndex === 0}
          className="px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 hover:bg-gray-100"
        >
          Previous
        </button>
        
        {currentIndex < BOOKING_STEPS.length - 1 && (
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="px-6 py-2 rounded-lg font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
