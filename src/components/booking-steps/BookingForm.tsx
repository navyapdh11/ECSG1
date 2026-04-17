'use client';

import { useRef, useCallback } from 'react';
import { BookingStepWizard } from './StepWizard';
import { ServiceSelection } from './ServiceSelection';
import { DateTimePicker } from './DateTimePicker';
import { BookingDetails } from './BookingDetails';
import { BookingConfirmation } from './BookingConfirmation';
import { useBookingStore } from '@/store/bookingStore';

export function BookingForm() {
  const { currentStep, nextStep, canProceed } = useBookingStore();
  const formSubmitRef = useRef<(() => boolean) | null>(null);

  // Callback for BookingDetails to register its submit handler
  const registerFormSubmit = useCallback((submitFn: () => boolean) => {
    formSubmitRef.current = submitFn;
  }, []);

  // Override nextStep to validate form first
  const handleNext = useCallback(() => {
    if (currentStep === 'details') {
      // Trigger form validation before proceeding
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
    <section id="booking" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Book Your Cleaning
            </h1>
            <p className="text-xl text-gray-600">
              Simple, fast, and flexible scheduling
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl">
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
