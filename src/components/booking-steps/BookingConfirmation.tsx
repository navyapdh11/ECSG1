'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Clock, MapPin, DollarSign, FileText } from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';
import { formatPrice, formatDate, formatTime } from '@/lib/utils';

export function BookingConfirmation() {
  const { selectedServices, selectedDate, selectedTime, address, specialInstructions, getTotalPrice } =
    useBookingStore();

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl"
      >
        <CheckCircle className="w-16 h-16 text-primary-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed! 🎉</h2>
        <p className="text-gray-600">
          Your cleaning service has been successfully booked
        </p>
      </motion.div>

      {/* Booking Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Service Details */}
        <div className="p-6 bg-white rounded-xl border-2 border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-600" />
            Service Details
          </h3>
          <div className="space-y-3">
            {selectedServices.map(({ service, quantity }) => (
              <div
                key={service.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{service.name}</p>
                  <p className="text-sm text-gray-600">Qty: {quantity}</p>
                </div>
                <p className="font-semibold text-gray-900">
                  {formatPrice(service.price * quantity)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Date & Time */}
        <div className="p-6 bg-white rounded-xl border-2 border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-600" />
            Schedule
          </h3>
          <div className="space-y-3">
            {selectedDate && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium text-gray-900">{formatDate(selectedDate)}</p>
                </div>
              </div>
            )}
            {selectedTime && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-medium text-gray-900">{formatTime(selectedTime)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="p-6 bg-white rounded-xl border-2 border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary-600" />
            Location
          </h3>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-900">{address.street}</p>
            <p className="text-gray-900">
              {address.city}, {address.state} {address.zipCode}
            </p>
          </div>
        </div>

        {/* Total Price */}
        <div className="p-6 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Payment Summary
          </h3>
          <div className="space-y-2 mb-4">
            {selectedServices.map(({ service, quantity }) => (
              <div key={service.id} className="flex justify-between text-sm opacity-90">
                <span>
                  {service.name} × {quantity}
                </span>
                <span>{formatPrice(service.price * quantity)}</span>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-white/20">
            <div className="flex justify-between text-2xl font-bold">
              <span>Total</span>
              <span>{formatPrice(getTotalPrice())}</span>
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

      {/* Earned Points */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 bg-gradient-to-br from-accent-50 to-primary-50 rounded-xl text-center"
      >
        <p className="text-2xl font-bold text-accent-600 mb-2">+{Math.floor(getTotalPrice() / 10)} Points Earned! 🎮</p>
        <p className="text-gray-700">
          Points have been added to your rewards balance
        </p>
      </motion.div>
    </div>
  );
}
