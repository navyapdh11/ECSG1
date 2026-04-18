'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, MessageSquare } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import type { ChatMessage } from '@/types';

const aiResponses: Record<string, { text: string; followUps: string[] }> = {
  hello: {
    text: "G'day! 👋 I'm your AusClean AI assistant. How can I help you today?\n\n• 📅 Book a cleaning service\n• 💰 Get pricing info\n• ⭐ Service recommendations\n• ♿ NDIS pricing\n• 🏢 Strata compliance",
    followUps: ['What services do you offer?', 'How much is a deep clean?', 'Are you NDIS approved?'],
  },
  price: {
    text: "Our pricing is transparent and includes 10% GST:\n\n💰 Regular Clean: $89 (2hrs)\n⭐ Deep Clean: $179 (4hrs, 2 cleaners)\n💎 End of Lease: $229 (bond-back guarantee)\n🧹 Carpet Clean: $149 (up to 3 rooms)\n🪟 Window Clean: $119 (10 windows)\n🏢 Strata: $199 (compliance check included)\n\nAll prices include eco-friendly supplies!",
    followUps: ['Book a deep clean', 'What add-ons are available?', 'Do you do weekly discounts?'],
  },
  book: {
    text: "Great! I can help you book right now. To get started:\n\n1️⃣ Choose your service type\n2️⃣ Pick a date and time\n3️⃣ Enter your address\n4️⃣ Pay securely with Stripe\n\nOr scroll down to use our full booking form with more options!",
    followUps: ['What\'s your most popular service?', 'How soon can you come?', 'Can I book weekly?'],
  },
  recommend: {
    text: "Our most popular service is the Premium Deep Clean at $199:\n\n🏆 4 hours of thorough cleaning\n👥 2 professional cleaners\n🏠 All rooms included\n🌿 Eco-friendly products\n✅ 98% customer satisfaction rate\n\nAdd-ons: Carpet (+$149), Windows (+$119), Oven (+$25)\n\nWant me to help you book it?",
    followUps: ['Book the deep clean', 'What about end of lease?', 'Show me all add-ons'],
  },
  ndis: {
    text: "Yes! We're fully NDIS approved and comply with the 2026 NDIS Price Guide:\n\n♿ Weekday: $64.78/hr (Assistance with Daily Life)\n♿ SIL (Complex): $78.94/hr\n♿ Weekend: 1.5× weekday rate\n♿ Public Holiday: 2× weekday rate\n♿ Travel: $15.56/km\n\nSelf-managed, plan-managed, and NDIA-managed participants welcome!",
    followUps: ['How do I use my NDIS plan?', 'What areas do you service?', 'Book an NDIS clean'],
  },
  default: {
    text: "Thanks for your message! I'm here to help with:\n\n📅 Booking cleaning services\n💰 Pricing & quotes\n⭐ Service recommendations\n♿ NDIS support\n🏢 Strata compliance\n❓ General questions\n\nWhat would you like to know?",
    followUps: ['Show me pricing', 'Book a clean', 'NDIS rates'],
  },
};

function getAIResponse(userMessage: string): { text: string; followUps: string[] } {
  const lower = userMessage.toLowerCase();
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('g\'day')) {
    return aiResponses.hello;
  }
  if (lower.includes('price') || lower.includes('cost') || lower.includes('how much') || lower.includes('pricing') || lower.includes('$')) {
    return aiResponses.price;
  }
  if (lower.includes('book') || lower.includes('schedule') || lower.includes('appointment')) {
    return aiResponses.book;
  }
  if (lower.includes('recommend') || lower.includes('best') || lower.includes('suggest') || lower.includes('popular')) {
    return aiResponses.recommend;
  }
  if (lower.includes('ndis') || lower.includes('disability') || lower.includes('support')) {
    return aiResponses.ndis;
  }
  return aiResponses.default;
}

export function ChatWindow() {
  const { messages, addMessage, isTyping, setTyping, isOpen } = useChatStore();
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showFollowUps, setShowFollowUps] = useState<string[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Simulate online status - #9
  useEffect(() => {
    const timer = setTimeout(() => setIsOnline(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const processMessage = useCallback(async (text: string) => {
    setError(null);
    setShowFollowUps([]);

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    addMessage(userMessage);
    setInput('');

    try {
      setTyping(true);
      await new Promise((resolve) => {
        const timer = setTimeout(resolve, 800 + Math.random() * 800);
        return () => clearTimeout(timer);
      });

      const response = getAIResponse(text);
      const aiMessage: ChatMessage = {
        id: `${Date.now()}-ai`,
        role: 'assistant',
        content: response.text,
        timestamp: new Date(),
      };
      addMessage(aiMessage);
      setShowFollowUps(response.followUps);
    } catch {
      setError('Failed to get response. Please try again.');
    } finally {
      setTyping(false);
    }
  }, [addMessage, setTyping]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    processMessage(input.trim());
  }, [input, isTyping, processMessage]);

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
          {/* Header - #9 with availability indicator */}
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Sparkles className="w-5 h-5" />
                </div>
                {/* Online indicator - #9 */}
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                  isOnline ? 'bg-green-400' : 'bg-gray-400'
                }`} />
              </div>
              <div>
                <h3 className="font-semibold">AusClean AI</h3>
                <p className="text-xs text-white/80">
                  {isOnline ? '🟢 Online • NDIS & Pricing Expert' : '⚪ Connecting...'}
                </p>
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
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" aria-hidden="true" />
                <p className="text-sm">Ask about pricing, NDIS, bookings, or services</p>
              </div>
            )}

            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end gap-2 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div
                    className={`p-1.5 rounded-full flex-shrink-0 ${
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

            {/* Follow-up suggestion chips - #5 */}
            {showFollowUps.length > 0 && !isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-2 pt-2"
              >
                {showFollowUps.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => processMessage(suggestion)}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </motion.div>
            )}

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
                placeholder="Ask about pricing, NDIS..."
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
