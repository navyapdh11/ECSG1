'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';
import { timeSlots } from '@/data/mockData';
import { formatPrice } from '@/lib/utils';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isPast,
} from 'date-fns';

export function DateTimePicker() {
  const { selectedDate, selectedTime, setDate, setTime, getTotalPrice } = useBookingStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const availableDates = days.filter((day) => !isPast(day) || isToday(day));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Date & Time</h2>
        <p className="text-gray-600">Select your preferred cleaning date and time slot</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="p-6 bg-white rounded-xl border-2 border-gray-200">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {days.map((day) => {
              const isAvailable = availableDates.some((d) => isSameDay(d, day));
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const disabled = !isAvailable;

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => !disabled && setDate(day)}
                  disabled={disabled}
                  className={`p-2 rounded-lg text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                    isSelected
                      ? 'bg-primary-600 text-white font-semibold'
                      : isToday(day)
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Slots */}
        <div className="p-6 bg-white rounded-xl border-2 border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Available Time Slots</h3>
          </div>

          {selectedDate ? (
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((time) => {
                const isSelected = selectedTime === time;
                return (
                  <button
                    key={time}
                    onClick={() => setTime(time)}
                    className={`py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-primary-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {format(new Date(`2000-01-01T${time}`), 'h:mm a')}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <CalendarIcon className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-center">Please select a date first</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {selectedDate && selectedTime && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-primary-50 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Selected Date & Time</h4>
              <p className="text-gray-700">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')} at{' '}
                {format(new Date(`2000-01-01T${selectedTime}`), 'h:mm a')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Estimated Total</p>
              <p className="text-2xl font-bold text-primary-600">{formatPrice(getTotalPrice())}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
