'use client';

import { motion } from 'framer-motion';
import { Plus, Minus, Clock, DollarSign, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';
import { mockServices } from '@/data/mockData';
import { formatPrice } from '@/lib/utils';
import { useState } from 'react';

// Before/after photo placeholders - #8
const servicePhotos: Record<string, { before: string; after: string }> = {
  'regular-clean': { before: '🏠', after: '✨' },
  'deep-clean': { before: '🧹', after: '🌟' },
  'move-in-out': { before: '📦', after: '🏡' },
  'office-clean': { before: '🏢', after: '💼' },
  'carpet-clean': { before: '🟫', after: '🟦' },
  'window-clean': { before: '🪟', after: '💎' },
};

export function ServiceSelection() {
  const { selectedServices, addService, removeService, updateServiceQuantity, getTotalPrice } =
    useBookingStore();
  const [activePhotoIndex, setActivePhotoIndex] = useState<Record<string, number>>({});

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
          const photos = servicePhotos[service.id];
          const photoIdx = activePhotoIndex[service.id] || 0;

          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-xl border-2 transition-all overflow-hidden ${
                quantity > 0
                  ? 'border-primary-600 bg-primary-50 shadow-lg'
                  : 'border-gray-200 hover:border-primary-300 bg-white'
              }`}
            >
              {/* Photo Carousel - #8 */}
              {photos && (
                <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 p-6 text-center">
                  <div className="text-4xl mb-1">
                    {photoIdx === 0 ? photos.before : photos.after}
                  </div>
                  <p className="text-xs text-gray-500 font-medium">
                    {photoIdx === 0 ? 'Before' : 'After'}
                  </p>
                  
                  {/* Carousel Controls */}
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <button
                      onClick={() => setActivePhotoIndex(prev => ({ ...prev, [service.id]: 0 }))}
                      className={`w-2 h-2 rounded-full transition-colors ${photoIdx === 0 ? 'bg-primary-600' : 'bg-gray-300'}`}
                      aria-label="Show before photo"
                    />
                    <button
                      onClick={() => setActivePhotoIndex(prev => ({ ...prev, [service.id]: 1 }))}
                      className={`w-2 h-2 rounded-full transition-colors ${photoIdx === 1 ? 'bg-primary-600' : 'bg-gray-300'}`}
                      aria-label="Show after photo"
                    />
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() => setActivePhotoIndex(prev => ({
                        ...prev,
                        [service.id]: prev[service.id] === 0 ? 1 : 0,
                      }))}
                      className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
                      aria-label="Toggle before/after"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setActivePhotoIndex(prev => ({
                        ...prev,
                        [service.id]: prev[service.id] === 0 ? 1 : 0,
                      }))}
                      className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
                      aria-label="Toggle before/after"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{service.description}</p>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" aria-hidden="true" />
                    <span>{service.duration} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" aria-hidden="true" />
                    <span>{formatPrice(service.price)}</span>
                  </div>
                </div>

                {quantity > 0 ? (
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => updateServiceQuantity(service.id, quantity - 1)}
                      className="p-2 rounded-lg bg-white hover:bg-gray-100 transition-colors"
                      aria-label={`Decrease ${service.name} quantity`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-semibold text-gray-900" aria-label={`Quantity: ${quantity}`}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateServiceQuantity(service.id, quantity + 1)}
                      className="p-2 rounded-lg bg-white hover:bg-gray-100 transition-colors"
                      aria-label={`Increase ${service.name} quantity`}
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

                {/* Remove button when quantity > 1 */}
                {quantity > 1 && (
                  <button
                    onClick={() => removeService(service.id)}
                    className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-error-600 hover:bg-error-50 transition-colors text-sm"
                    aria-label={`Remove ${service.name} from booking`}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
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
