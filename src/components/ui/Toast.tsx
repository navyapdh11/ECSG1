'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertCircle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toastId = 0;
const listeners = new Set<(toasts: Toast[]) => void>();
let toasts: Toast[] = [];

export function useToast() {
  const [currentToasts, setCurrentToasts] = useState(toasts);

  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = `${++toastId}`;
    toasts = [...toasts, { id, message, type }];
    listeners.forEach((fn) => fn(toasts));
    setCurrentToasts([...toasts]);
    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id);
      listeners.forEach((fn) => fn(toasts));
      setCurrentToasts([...toasts]);
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
    listeners.forEach((fn) => fn(toasts));
    setCurrentToasts([...toasts]);
  }, []);

  return { toasts: currentToasts, addToast, removeToast };
}

export function ToastContainer() {
  const { toasts, removeToast, addToast } = useToast();

  // Listen for custom toast events (from PricingTiers, etc.)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.message) {
        addToast(detail.message, detail.type || 'success');
      }
    };
    window.addEventListener('toast-show', handler);
    return () => window.removeEventListener('toast-show', handler);
  }, [addToast]);

  return (
    <div className="fixed bottom-4 right-4 z-[60] space-y-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl shadow-2xl max-w-sm ${
              toast.type === 'success'
                ? 'bg-success-600 text-white'
                : toast.type === 'error'
                ? 'bg-error-600 text-white'
                : 'bg-primary-600 text-white'
            }`}
          >
            {toast.type === 'success' ? (
              <Check className="w-5 h-5 flex-shrink-0" />
            ) : toast.type === 'error' ? (
              <X className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-white/20 rounded transition-colors flex-shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
