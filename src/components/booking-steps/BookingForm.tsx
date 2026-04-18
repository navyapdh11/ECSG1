'use client';

import { useRef, useCallback } from 'react';
import { BookingStepWizard } from './StepWizard';
import { ServiceSelection } from './ServiceSelection';
import { DateTimePicker } from './DateTimePicker';
import { BookingDetails } from './BookingDetails';
import { BookingConfirmation } from './BookingConfirmation';
import { ResumeBanner } from './ResumeBanner';
import { useBookingStore } from '@/store/bookingStore';

export function BookingForm() {
  const { currentStep, nextStep, canProceed } = useBookingStore();
  const formSubmitRef = useRef<(() => boolean) | null>(null);

  const registerFormSubmit = useCallback((submitFn: () => boolean) => {
    formSubmitRef.current = submitFn;
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep === 'details') {
      const isValid = formSubmitRef.current?.();
      if (!isValid) return;
    }
    if (canProceed()) {
      nextStep();
    }
  }, [currentStep, canProceed, nextStep]);

  const renderStep = () => {
    switch (currentStep) {
      case 'services':
        return <ServiceSelection />;
      case 'date-time':
        return <DateTimePicker />;
      case 'details':
        return <BookingDetails onFormValid={registerFormSubmit} />;
      case 'confirmation':
        return <BookingConfirmation />;
      default:
        return <ServiceSelection />;
    }
  };

  return (
    <section id="booking" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Book Your Cleaning
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Simple, fast, and flexible scheduling
            </p>
          </div>

          {/* Resume Banner - #1 */}
          <ResumeBanner />

          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl">
            {currentStep !== 'confirmation' && (
              <BookingStepWizard onNext={handleNext} />
            )}
            {renderStep()}
          </div>
        </div>
      </div>
    </section>
  );
}
