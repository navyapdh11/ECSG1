'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Clock, MapPin, DollarSign, FileText, CreditCard, Loader2 } from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';
import { useGamificationStore } from '@/store/gamificationStore';
import { formatPrice, formatDate, formatTime } from '@/lib/utils';

export function BookingConfirmation() {
  const { selectedServices, selectedDate, selectedTime, address, specialInstructions, getTotalPrice } =
    useBookingStore();
  const { addPoints } = useGamificationStore();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Safety: handle missing data
  if (selectedServices.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No booking data found. Please start a new booking.</p>
      </div>
    );
  }

  const totalPrice = getTotalPrice();

  const handleCheckout = async () => {
    setProcessing(true);
    setError(null);

    try {
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

      // Award points
      addPoints(Math.floor(totalPrice / 10));

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      setProcessing(false);
    }
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
          Review your booking details and proceed to secure payment
        </p>
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

        {/* Date & Time */}
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

      {/* Checkout Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 bg-gradient-to-br from-accent-50 to-primary-50 rounded-xl"
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
        <p className="text-center text-sm text-gray-600 mt-3">
          Secure payment powered by Stripe • All major cards accepted
        </p>
      </motion.div>
    </div>
  );
}
