'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle, Calendar, Clock, MapPin, DollarSign, FileText, CreditCard,
  Loader2, Shield, Award, BadgeCheck, Share2, Copy, Check, QrCode
} from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';
import { useGamificationStore } from '@/store/gamificationStore';
import { formatPrice, formatDate, formatTime } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

export function BookingConfirmation() {
  const { selectedServices, selectedDate, selectedTime, address, specialInstructions, getTotalPrice } =
    useBookingStore();
  const { addPoints, recordBooking } = useGamificationStore();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();
  const totalPrice = getTotalPrice();
  const bookingId = `ECS-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  // Safety: handle missing data
  if (selectedServices.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No booking data found. Please start a new booking.</p>
      </div>
    );
  }

  const handleCheckout = async () => {
    setProcessing(true);
    setError(null);

    try {
      recordBooking();
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          services: selectedServices.map(({ service, quantity }) => ({
            name: service.name,
            price: service.price,
            quantity,
          })),
          total: totalPrice,
          email: address.email || '',
          name: address.name || '',
          phone: address.phone || '',
          date: selectedDate ? new Date(selectedDate).toISOString() : '',
          time: selectedTime,
          address: {
            street: address.street || '',
            city: address.city || '',
            state: address.state || '',
            zipCode: address.zipCode || '',
            country: address.country || 'US',
          },
          specialInstructions,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Checkout failed');
      }

      const data = await response.json();
      addPoints(Math.floor(totalPrice / 10));
      addToast(`Booking ${bookingId} created! Redirecting to payment...`, 'success');
      
      // Redirect to interstitial page
      window.location.href = `/redirecting?booking_id=${bookingId}&checkout_url=${encodeURIComponent(data.url)}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      setProcessing(false);
    }
  };

  const handleShare = () => {
    setShowShare(true);
  };

  const handleCopyDetails = () => {
    const text = `Booking ${bookingId}\n${selectedServices.map(s => `${s.service.name} x${s.quantity}`).join(', ')}\n${formatDate(selectedDate || new Date())} at ${selectedTime}\nTotal: ${formatPrice(totalPrice)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Booking details copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl"
      >
        <CheckCircle className="w-16 h-16 text-primary-600 mx-auto mb-4" aria-hidden="true" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Ready to Pay</h2>
        <p className="text-gray-600">
          Review your booking and proceed to secure payment
        </p>
        <p className="text-sm text-gray-500 mt-2">Booking ID: <code className="bg-gray-100 px-2 py-1 rounded font-mono">{bookingId}</code></p>
      </motion.div>

      {/* Trust Signals - #6 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3"
      >
        {[
          { icon: Shield, text: 'Police-Checked', color: 'text-success-600 bg-success-50' },
          { icon: Award, text: 'Fully Insured', color: 'text-primary-600 bg-primary-50' },
          { icon: BadgeCheck, text: 'Bond-Back Guarantee', color: 'text-accent-600 bg-accent-50' },
        ].map((badge) => {
          const Icon = badge.icon;
          return (
            <div key={badge.text} className={`flex flex-col items-center gap-2 p-3 rounded-xl ${badge.color}`}>
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium text-center">{badge.text}</span>
            </div>
          );
        })}
      </motion.div>

      {/* Booking Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Service Details */}
        <div className="p-6 bg-white rounded-xl border-2 border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-600" aria-hidden="true" />
            Service Details
          </h3>
          <div className="space-y-3">
            {selectedServices.map(({ service, quantity }) => (
              <div key={service.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{service.name}</p>
                  <p className="text-sm text-gray-600">Qty: {quantity}</p>
                </div>
                <p className="font-semibold text-gray-900">{formatPrice(service.price * quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Date & Time + Cleaner Info */}
        <div className="space-y-4">
          <div className="p-6 bg-white rounded-xl border-2 border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-600" aria-hidden="true" />
              Schedule
            </h3>
            <div className="space-y-3">
              {selectedDate && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary-600 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium text-gray-900">{formatDate(selectedDate)}</p>
                  </div>
                </div>
              )}
              {selectedTime && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-primary-600 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-medium text-gray-900">{formatTime(selectedTime)}</p>
                  </div>
                </div>
              )}
              {/* Estimated arrival window - #6 */}
              {selectedTime && (
                <div className="p-3 bg-primary-50 rounded-lg">
                  <p className="text-sm text-primary-700">
                    🚗 Cleaner arrives between{' '}
                    <strong>{formatTime(selectedTime)}</strong> and{' '}
                    <strong>{(() => {
                      const [h, m] = selectedTime.split(':');
                      const newH = Math.min(parseInt(h, 10) + 1, 23);
                      return formatTime(`${newH}:${m}`);
                    })()}</strong>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Address */}
        {(address.street || address.city) && (
          <div className="p-6 bg-white rounded-xl border-2 border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-600" aria-hidden="true" />
              Location
            </h3>
            <div className="p-3 bg-gray-50 rounded-lg">
              {address.street && <p className="text-gray-900">{address.street}</p>}
              {(address.city || address.state || address.zipCode) && (
                <p className="text-gray-900">
                  {address.city}{address.city && address.state ? ', ' : ''}{address.state} {address.zipCode}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Total Price */}
        <div className="p-6 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" aria-hidden="true" />
            Payment Summary
          </h3>
          <div className="space-y-2 mb-4">
            {selectedServices.map(({ service, quantity }) => (
              <div key={service.id} className="flex justify-between text-sm opacity-90">
                <span>{service.name} × {quantity}</span>
                <span>{formatPrice(service.price * quantity)}</span>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-white/20">
            <div className="flex justify-between text-2xl font-bold">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Special Instructions */}
      {specialInstructions && (
        <div className="p-6 bg-white rounded-xl border-2 border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Special Instructions</h3>
          <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{specialInstructions}</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-error-50 text-error-700 rounded-xl text-center" role="alert">
          {error}
        </motion.div>
      )}

      {/* Checkout + Share Actions - #13 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <button
          onClick={handleCheckout}
          disabled={processing}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold text-lg hover:from-primary-700 hover:to-accent-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {processing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Pay {formatPrice(totalPrice)} with Stripe
            </>
          )}
        </button>

        {/* Share Receipt - #13 */}
        <div className="flex gap-3">
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-200 text-gray-700 hover:border-primary-300 hover:bg-primary-50 transition-colors font-medium"
          >
            <Share2 className="w-4 h-4" />
            Share Receipt
          </button>
          <button
            onClick={handleCopyDetails}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 hover:border-primary-300 hover:bg-primary-50 transition-colors font-medium"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </motion.div>

      {/* Share Modal - #13 */}
      {showShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowShare(false)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Share Receipt</h3>
            
            {/* QR Code placeholder */}
            <div className="bg-gray-50 rounded-xl p-6 mb-4 text-center">
              <QrCode className="w-24 h-24 mx-auto mb-3 text-gray-700" />
              <p className="text-sm text-gray-600">Scan to view booking details</p>
              <p className="text-xs text-gray-400 font-mono mt-1">{bookingId}</p>
            </div>

            {/* Booking Summary */}
            <div className="space-y-2 text-sm mb-4">
              <p><strong>Service:</strong> {selectedServices.map(s => s.service.name).join(', ')}</p>
              <p><strong>Date:</strong> {formatDate(selectedDate || new Date())}</p>
              <p><strong>Total:</strong> {formatPrice(totalPrice)}</p>
            </div>

            <button
              onClick={() => setShowShare(false)}
              className="w-full py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
            >
              Done
            </button>
          </motion.div>
        </div>
      )}

      <p className="text-center text-sm text-gray-600">
        Secure payment powered by Stripe • All major cards accepted • 10% GST included
      </p>
    </div>
  );
}
