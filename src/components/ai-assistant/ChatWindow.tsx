'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import type { ChatMessage } from '@/types';

const aiResponses: Record<string, string> = {
  hello: "Hello! 👋 I'm your AI cleaning assistant. How can I help you today? I can:\n\n• Help you book a cleaning service\n• Show you our pricing options\n• Recommend the best service for your needs\n• Answer questions about our process",
  price: "Our pricing is simple and transparent:\n\n💰 **Basic**: $99 - Perfect for regular maintenance\n⭐ **Premium**: $199 - Our most popular choice\n💎 **Enterprise**: $349 - Complete cleaning solution\n\nAll prices include eco-friendly supplies and professional cleaners! Would you like to book one of these?",
  book: "Great choice! I can help you book right now. Here's what I need to know:\n\n1. What type of cleaning service are you interested in?\n2. When would you like to schedule it?\n3. What's your address?\n\nOr you can use our full booking form below with more options!",
  recommend: "Based on popular choices, I'd recommend:\n\n🏆 **Premium Deep Cleaning** ($199)\n- 4 hours of thorough cleaning\n- 2 professional cleaners\n- All rooms included\n- Eco-friendly products\n\nIt's our most popular service with a 98% satisfaction rate! Want me to help you book it?",
  default: "Thanks for your message! I'm here to help with:\n\n• 📅 Booking cleaning services\n• 💰 Pricing information\n• ⭐ Service recommendations\n• ❓ General questions\n\nWhat would you like to know more about?",
};

function getAIResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return aiResponses.hello;
  }
  if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) {
    return aiResponses.price;
  }
  if (lower.includes('book') || lower.includes('schedule') || lower.includes('appointment')) {
    return aiResponses.book;
  }
  if (lower.includes('recommend') || lower.includes('best') || lower.includes('suggest')) {
    return aiResponses.recommend;
  }
  return aiResponses.default;
}

export function ChatWindow() {
  const { messages, addMessage, isTyping, setTyping, isOpen } = useChatStore();
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    setError(null);
    const trimmedInput = input.trim();
    setInput('');

    // Add user message
    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: trimmedInput,
      timestamp: new Date(),
    };
    addMessage(userMessage);

    // Simulate AI typing with error handling
    try {
      setTyping(true);
      await new Promise((resolve) => {
        const timer = setTimeout(resolve, 1000 + Math.random() * 1000);
        return () => clearTimeout(timer);
      });

      const aiMessage: ChatMessage = {
        id: `${Date.now()}-ai`,
        role: 'assistant',
        content: getAIResponse(trimmedInput),
        timestamp: new Date(),
      };
      addMessage(aiMessage);
    } catch {
      setError('Failed to get response. Please try again.');
    } finally {
      setTyping(false);
    }
  }, [input, isTyping, addMessage, setTyping]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          role="dialog"
          aria-label="AI Assistant Chat"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg" aria-hidden="true">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-xs text-white/80">Online • Ready to help</p>
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-3 bg-error-50 text-error-700 text-sm text-center"
              role="alert"
            >
              {error}
            </motion.div>
          )}

          {/* Messages */}
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
          >
            {messages.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" aria-hidden="true" />
                <p className="text-sm">Start a conversation with your AI assistant</p>
              </div>
            )}

            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end gap-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div
                    className={`p-2 rounded-full flex-shrink-0 ${
                      message.role === 'user' ? 'bg-primary-600' : 'bg-accent-600'
                    }`}
                    aria-hidden="true"
                  >
                    {message.role === 'user' ? (
                      <User className="w-3 h-3 text-white" />
                    ) : (
                      <Bot className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-primary-600 text-white rounded-br-none'
                        : 'bg-white text-gray-900 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <time
                      className={`text-xs mt-1 block ${
                        message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                      }`}
                      dateTime={message.timestamp.toISOString()}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </time>
                  </div>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
                aria-label="AI is typing"
              >
                <div className="flex items-end gap-2">
                  <div className="p-2 rounded-full bg-accent-600" aria-hidden="true">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div className="p-3 rounded-2xl bg-white shadow-sm rounded-bl-none">
                    <div className="flex gap-1" aria-hidden="true">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <label htmlFor="chat-input" className="sr-only">Type your message</label>
              <input
                id="chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-primary-600 focus:ring-2 focus:ring-primary-200 transition-all outline-none text-sm"
                disabled={isTyping}
                aria-disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
