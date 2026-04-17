'use client';

import { motion } from 'framer-motion';
import { Plus, Minus, Clock, DollarSign } from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';
import { mockServices } from '@/data/mockData';
import { formatPrice } from '@/lib/utils';

export function ServiceSelection() {
  const { selectedServices, addService, updateServiceQuantity, getTotalPrice } =
    useBookingStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Your Services</h2>
        <p className="text-gray-600">Choose the cleaning services you need</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockServices.map((service, index) => {
          const selected = selectedServices.find((s) => s.service.id === service.id);
          const quantity = selected?.quantity || 0;

          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-xl border-2 transition-all ${
                quantity > 0
                  ? 'border-primary-600 bg-primary-50 shadow-lg'
                  : 'border-gray-200 hover:border-primary-300 bg-white'
              }`}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{service.description}</p>

              <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{service.duration} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>{formatPrice(service.price)}</span>
                </div>
              </div>

              {quantity > 0 ? (
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => updateServiceQuantity(service.id, quantity - 1)}
                    className="p-2 rounded-lg bg-white hover:bg-gray-100 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-semibold text-gray-900">{quantity}</span>
                  <button
                    onClick={() => updateServiceQuantity(service.id, quantity + 1)}
                    className="p-2 rounded-lg bg-white hover:bg-gray-100 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addService(service)}
                  className="w-full py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors font-medium"
                >
                  Add to Booking
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      {selectedServices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-gray-50 rounded-xl"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
          <div className="space-y-2">
            {selectedServices.map(({ service, quantity }) => (
              <div key={service.id} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  {service.name} × {quantity}
                </span>
                <span className="font-medium text-gray-900">
                  {formatPrice(service.price * quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary-600">{formatPrice(getTotalPrice())}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
