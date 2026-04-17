import { create } from 'zustand';
import type { ChatMessage, ChatIntent } from '@/types';

interface ChatStore {
  // State
  messages: ChatMessage[];
  isTyping: boolean;
  isOpen: boolean;
  currentIntent: ChatIntent | null;
  
  // Actions
  addMessage: (message: ChatMessage) => void;
  setTyping: (typing: boolean) => void;
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  setIntent: (intent: ChatIntent | null) => void;
  clearChat: () => void;
  
  // Computed
  getLastMessage: () => ChatMessage | undefined;
  getMessagesByRole: (role: 'user' | 'assistant' | 'system') => ChatMessage[];
}

export const useChatStore = create<ChatStore>()((set, get) => ({
  // Initial state
  messages: [],
  isTyping: false,
  isOpen: false,
  currentIntent: null,

  // Actions
  addMessage: (message) => {
    const { messages } = get();
    set({ messages: [...messages, message] });
  },

  setTyping: (isTyping) => set({ isTyping }),

  toggleChat: () => {
    const { isOpen } = get();
    set({ isOpen: !isOpen });
  },

  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),

  setIntent: (intent) => set({ currentIntent: intent }),

  clearChat: () => set({ messages: [], currentIntent: null }),

  // Computed
  getLastMessage: () => {
    const { messages } = get();
    return messages[messages.length - 1];
  },

  getMessagesByRole: (role) => {
    const { messages } = get();
    return messages.filter((m) => m.role === role);
  },
}));
