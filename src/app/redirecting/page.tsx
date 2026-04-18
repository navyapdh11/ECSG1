'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, ExternalLink, Loader2 } from 'lucide-react';

function RedirectingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('booking_id') || 'ABC123';
  const [countdown, setCountdown] = useState(10);
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setRedirected(true);
          router.push('/bookings');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center"
      >
        {/* Icon */}
        <motion.div
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary-100 flex items-center justify-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {redirected ? (
            <CheckCircle className="w-10 h-10 text-success-600" />
          ) : (
            <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
          )}
        </motion.div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {redirected ? 'Redirecting to bookings...' : 'Redirecting to Secure Payment'}
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          You&apos;re being redirected to Stripe&apos;s secure checkout page.
        </p>

        {/* Booking Info */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Booking ID</span>
            <span className="font-mono font-semibold text-gray-900">{bookingId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Reserved for</span>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-warning-500" />
              <span className="font-bold text-warning-600">{countdown} min</span>
            </div>
          </div>
        </div>

        {/* Countdown Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-600 to-accent-600"
            initial={{ width: '100%' }}
            animate={{ width: `${(countdown / 10) * 100}%` }}
            transition={{ duration: 1 }}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Back to Home
          </button>
          <button
            onClick={() => router.push('/bookings')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            View Bookings
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Security Note */}
        <p className="text-xs text-gray-400 mt-6 flex items-center justify-center gap-1">
          🔒 Secured by Stripe • Your data is encrypted
        </p>
      </motion.div>
    </div>
  );
}

export default function RedirectingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
      <RedirectingContent />
    </Suspense>
  );
}
