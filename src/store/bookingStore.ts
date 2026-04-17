import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Booking,
  BookingStep,
  BookingService,
  Address,
  Service,
} from '@/types';

interface BookingStore {
  // State
  currentStep: BookingStep;
  selectedServices: BookingService[];
  selectedDate: Date | null;
  selectedTime: string | null;
  address: Partial<Address>;
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
        const steps: BookingStep[] = ['services', 'date-time', 'details', 'confirmation'];
        const currentIndex = steps.indexOf(currentStep);
        if (currentIndex < steps.length - 1) {
          set({ currentStep: steps[currentIndex + 1] });
        }
      },
      
      previousStep: () => {
        const { currentStep } = get();
        const steps: BookingStep[] = ['services', 'date-time', 'details', 'confirmation'];
        const currentIndex = steps.indexOf(currentStep);
        if (currentIndex > 0) {
          set({ currentStep: steps[currentIndex - 1] });
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
      
      setDate: (date) => set({ selectedDate: date }),
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

      // Computed
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
        selectedDate: state.selectedDate,
        selectedTime: state.selectedTime,
        address: state.address,
        specialInstructions: state.specialInstructions,
      }),
    }
  )
);
