'use client';

import { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AIAssistant } from '@/components/ai-assistant/AIAssistant';
import { ErrorBoundary } from '@/components/providers/ErrorBoundary';
import { ToastContainer } from '@/components/ui/Toast';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
      <ErrorBoundary>
        <Header />
      </ErrorBoundary>
      <main className="flex-1">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <ErrorBoundary>
        <Footer />
      </ErrorBoundary>
      <AIAssistant />
      <ToastContainer />
    </div>
  );
}
