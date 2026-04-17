import { create } from 'zustand';

interface UIStore {
  // State
  isMobileMenuOpen: boolean;
  activeSection: string;
  scrollY: number;
  
  // Actions
  toggleMobileMenu: () => void;
  setMobileMenu: (isOpen: boolean) => void;
  setActiveSection: (section: string) => void;
  setScrollY: (scrollY: number) => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  // Initial state
  isMobileMenuOpen: false,
  activeSection: 'hero',
  scrollY: 0,

  // Actions
  toggleMobileMenu: () => {
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen }));
  },

  setMobileMenu: (isMobileMenuOpen) => set({ isMobileMenuOpen }),
  setActiveSection: (activeSection) => set({ activeSection }),
  setScrollY: (scrollY) => set({ scrollY }),
}));
