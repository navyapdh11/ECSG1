'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Plus, Minus } from 'lucide-react';
import { mockServices } from '@/data/mockData';
import { formatPrice } from '@/lib/utils';
import type { PricingFrequency } from '@/types';

const frequencyDiscounts: Record<PricingFrequency, number> = {
  'one-time': 0,
  weekly: 20,
  biweekly: 15,
  monthly: 10,
};

const addOns = [
  { id: 'fridge', name: 'Inside Fridge', price: 25 },
  { id: 'oven', name: 'Inside Oven', price: 25 },
  { id: 'windows', name: 'Window Cleaning', price: 40 },
  { id: 'laundry', name: 'Laundry Folding', price: 30 },
  { id: 'organizing', name: 'Organization', price: 35 },
];

export function PricingCalculator() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<PricingFrequency>('one-time');

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOnId)
        ? prev.filter((id) => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const servicesTotal = selectedServices.reduce((total, serviceId) => {
    const service = mockServices.find((s) => s.id === serviceId);
    return total + (service?.price || 0);
  }, 0);

  const addOnsTotal = selectedAddOns.reduce((total, addOnId) => {
    const addOn = addOns.find((a) => a.id === addOnId);
    return total + (addOn?.price || 0);
  }, 0);

  const subtotal = servicesTotal + addOnsTotal;
  const discount = frequencyDiscounts[frequency];
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <Calculator className="w-8 h-8" />
          Price Calculator
        </h3>
        <p className="text-lg text-gray-600">
          Customize your cleaning package and see the price instantly
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Services */}
        <div className="p-6 bg-white rounded-xl border-2 border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Services</h4>
          <div className="space-y-3">
            {mockServices.map((service) => {
              const isSelected = selectedServices.includes(service.id);
              return (
                <motion.button
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-600">{service.duration} min</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {formatPrice(service.price)}
                      </span>
                      {isSelected ? (
                        <Minus className="w-4 h-4 text-primary-600" />
                      ) : (
                        <Plus className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Add-ons & Frequency */}
        <div className="space-y-6">
          {/* Add-ons */}
          <div className="p-6 bg-white rounded-xl border-2 border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Add-Ons</h4>
            <div className="space-y-3">
              {addOns.map((addOn) => {
                const isSelected = selectedAddOns.includes(addOn.id);
                return (
                  <motion.button
                    key={addOn.id}
                    onClick={() => toggleAddOn(addOn.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? 'border-accent-600 bg-accent-50'
                        : 'border-gray-200 hover:border-accent-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 text-sm">{addOn.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">
                          +{formatPrice(addOn.price)}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Frequency */}
          <div className="p-6 bg-white rounded-xl border-2 border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Frequency</h4>
            <div className="space-y-2">
              {(
                ['weekly', 'biweekly', 'monthly', 'one-time'] as PricingFrequency[]
              ).map((freq) => {
                const isSelected = frequency === freq;
                const discount = frequencyDiscounts[freq];
                return (
                  <button
                    key={freq}
                    onClick={() => setFrequency(freq)}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 capitalize">
                        {freq === 'one-time' ? 'One Time' : freq}
                      </span>
                      {discount > 0 && (
                        <span className="text-xs font-semibold text-success-600 bg-success-50 px-2 py-1 rounded">
                          Save {discount}%
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="p-6 bg-gradient-to-br from-primary-600 to-accent-600 text-white rounded-xl">
          <h4 className="text-lg font-semibold mb-6">Price Summary</h4>

          <div className="space-y-3 mb-6">
            {selectedServices.length > 0 ? (
              selectedServices.map((serviceId) => {
                const service = mockServices.find((s) => s.id === serviceId);
                if (!service) return null;
                return (
                  <div key={serviceId} className="flex justify-between text-sm opacity-90">
                    <span>{service.name}</span>
                    <span>{formatPrice(service.price)}</span>
                  </div>
                );
              })
            ) : (
              <p className="text-sm opacity-70">No services selected</p>
            )}

            {selectedAddOns.length > 0 && (
              <>
                <div className="pt-3 border-t border-white/20">
                  <p className="text-sm font-semibold mb-2">Add-Ons</p>
                  {selectedAddOns.map((addOnId) => {
                    const addOn = addOns.find((a) => a.id === addOnId);
                    if (!addOn) return null;
                    return (
                      <div key={addOnId} className="flex justify-between text-sm opacity-90">
                        <span>{addOn.name}</span>
                        <span>+{formatPrice(addOn.price)}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {discount > 0 && (
            <div className="p-3 bg-white/10 rounded-lg mb-4">
              <div className="flex justify-between text-sm">
                <span>Frequency Discount ({discount}%)</span>
                <span className="text-success-300">-{formatPrice(discountAmount)}</span>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-white/20">
            <div className="flex justify-between text-3xl font-bold mb-2">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            {discount > 0 && (
              <p className="text-sm opacity-80">
                {"You're saving"} {formatPrice(discountAmount)} with {frequency} pricing!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
