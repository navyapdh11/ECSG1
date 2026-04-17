import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Booking,
  BookingStep,
  BookingService,
  Address,
  Service,
} from '@/types';

// Shared step constant (used by both store and StepWizard)
export const BOOKING_STEPS: BookingStep[] = ['services', 'date-time', 'details', 'confirmation'];

interface BookingStore {
  // State
  currentStep: BookingStep;
  selectedServices: BookingService[];
  selectedDate: Date | null;
  selectedTime: string | null;
  address: Partial<Address & { email?: string; name?: string; phone?: string }>;
  specialInstructions: string;
  booking: Booking | null;
  
  // Actions
  setStep: (step: BookingStep) => void;
  nextStep: () => void;
  previousStep: () => void;
  addService: (service: Service) => void;
  removeService: (serviceId: string) => void;
  updateServiceQuantity: (serviceId: string, quantity: number) => void;
  setDate: (date: Date) => void;
  setTime: (time: string) => void;
  setAddress: (address: Partial<Address>) => void;
  setSpecialInstructions: (instructions: string) => void;
  setBooking: (booking: Booking) => void;
  resetBooking: () => void;
  
  // Computed
  getTotalPrice: () => number;
  canProceed: () => boolean;
}

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStep: 'services',
      selectedServices: [],
      selectedDate: null,
      selectedTime: null,
      address: {},
      specialInstructions: '',
      booking: null,

      // Actions
      setStep: (step) => set({ currentStep: step }),
      
      nextStep: () => {
        const { currentStep } = get();
        const currentIndex = BOOKING_STEPS.indexOf(currentStep);
        if (currentIndex < BOOKING_STEPS.length - 1) {
          set({ currentStep: BOOKING_STEPS[currentIndex + 1] });
        }
      },
      
      previousStep: () => {
        const { currentStep } = get();
        const currentIndex = BOOKING_STEPS.indexOf(currentStep);
        if (currentIndex > 0) {
          set({ currentStep: BOOKING_STEPS[currentIndex - 1] });
        }
      },
      
      addService: (service) => {
        const { selectedServices } = get();
        const existing = selectedServices.find((s) => s.service.id === service.id);
        if (existing) {
          set({
            selectedServices: selectedServices.map((s) =>
              s.service.id === service.id ? { ...s, quantity: s.quantity + 1 } : s
            ),
          });
        } else {
          set({
            selectedServices: [...selectedServices, { service, quantity: 1 }],
          });
        }
      },
      
      removeService: (serviceId) => {
        const { selectedServices } = get();
        set({
          selectedServices: selectedServices.filter((s) => s.service.id !== serviceId),
        });
      },
      
      updateServiceQuantity: (serviceId, quantity) => {
        const { selectedServices } = get();
        if (quantity <= 0) {
          set({
            selectedServices: selectedServices.filter((s) => s.service.id !== serviceId),
          });
        } else {
          set({
            selectedServices: selectedServices.map((s) =>
              s.service.id === serviceId ? { ...s, quantity } : s
            ),
          });
        }
      },
      
      setDate: (date) => {
        const iso = date instanceof Date ? date.toISOString() : date;
        set({ selectedDate: new Date(iso) });
      },
      setTime: (time) => set({ selectedTime: time }),
      setAddress: (address) => set({ address }),
      setSpecialInstructions: (specialInstructions) => set({ specialInstructions }),
      setBooking: (booking) => set({ booking }),
      
      resetBooking: () =>
        set({
          currentStep: 'services',
          selectedServices: [],
          selectedDate: null,
          selectedTime: null,
          address: {},
          specialInstructions: '',
          booking: null,
        }),

      // Computed - memoized selectors
      getTotalPrice: () => {
        const { selectedServices } = get();
        return selectedServices.reduce(
          (total, { service, quantity }) => total + service.price * quantity,
          0
        );
      },
      
      canProceed: () => {
        const { currentStep, selectedServices, selectedDate, selectedTime, address } = get();
        
        switch (currentStep) {
          case 'services':
            return selectedServices.length > 0;
          case 'date-time':
            return selectedDate !== null && selectedTime !== null;
          case 'details':
            return !!(address.street && address.city && address.zipCode);
          case 'confirmation':
            return true;
          default:
            return false;
        }
      },
    }),
    {
      name: 'booking-storage',
      partialize: (state) => ({
        selectedServices: state.selectedServices,
        // Store date as ISO string for proper serialization
        selectedDate: state.selectedDate ? state.selectedDate.toISOString() : null,
        selectedTime: state.selectedTime,
        address: state.address,
        specialInstructions: state.specialInstructions,
      }),
      // Rehydrate Date objects on load
      onRehydrateStorage: () => (state) => {
        if (state && state.selectedDate && typeof state.selectedDate === 'string') {
          state.selectedDate = new Date(state.selectedDate);
        }
      },
    }
  )
);
