'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { ChatWindow } from './ChatWindow';

export function AIAssistant() {
  const { isOpen, toggleChat } = useChatStore();
  const messageCount = useChatStore((s) => s.getMessagesByRole('assistant').length);
  const hasUnread = !isOpen && messageCount === 0;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-4"
          >
            <ChatWindow />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`p-4 rounded-full shadow-lg transition-colors relative ${
          isOpen
            ? 'bg-gray-700 hover:bg-gray-800'
            : 'bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open AI assistant chat'}
        aria-describedby={hasUnread ? 'chat-notification-label' : undefined}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6 text-white" aria-hidden="true" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="w-6 h-6 text-white" aria-hidden="true" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification Badge - Fixed: only show initially */}
        {hasUnread && (
          <motion.span
            id="chat-notification-label"
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: 3 }}
          >
            <span className="sr-only">New message available</span>
          </motion.span>
        )}
      </motion.button>
    </div>
  );
}
