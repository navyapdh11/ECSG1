'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';
import type { BookingStep } from '@/types';

const steps: { key: BookingStep; label: string; number: number }[] = [
  { key: 'services', label: 'Select Services', number: 1 },
  { key: 'date-time', label: 'Date & Time', number: 2 },
  { key: 'details', label: 'Your Details', number: 3 },
  { key: 'confirmation', label: 'Confirmation', number: 4 },
];

export function BookingStepWizard() {
  const { currentStep, nextStep, previousStep, canProceed } = useBookingStore();
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="mb-8">
      {/* Progress Bar */}
      <div className="relative mb-8">
        {/* Background line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 rounded-full" />
        
        {/* Progress line */}
        <motion.div
          className="absolute top-1/2 left-0 h-1 bg-primary-600 -translate-y-1/2 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            
            return (
              <div key={step.key} className="flex flex-col items-center gap-2">
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
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : step.number}
                </motion.div>
                <span
                  className={`text-xs font-medium hidden sm:block ${
                    isCurrent ? 'text-primary-600' : 'text-gray-500'
                  }`}
                >
                  {step.label}
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
        
        {currentIndex < steps.length - 1 && (
          <button
            onClick={nextStep}
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
