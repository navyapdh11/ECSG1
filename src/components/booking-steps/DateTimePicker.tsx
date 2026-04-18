'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Zap, CalendarDays, CalendarRange, Repeat } from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';
import { timeSlots } from '@/data/mockData';
import { formatPrice, formatTime } from '@/lib/utils';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  isPast,
  addDays,
} from 'date-fns';

// Quick date pick options - #7
const quickPicks = [
  { label: 'ASAP', icon: Zap, getValue: () => addDays(new Date(), 1) },
  { label: 'This Sat', icon: CalendarDays, getValue: () => {
    const d = new Date();
    while (d.getDay() !== 6) addDays(d, 1);
    return d;
  }},
  { label: 'This Sun', icon: CalendarRange, getValue: () => {
    const d = new Date();
    while (d.getDay() !== 0) addDays(d, 1);
    return d;
  }},
  { label: 'Weekly', icon: Repeat, getValue: () => addDays(new Date(), 7) },
];

export function DateTimePicker() {
  const { selectedDate, selectedTime, setDate, setTime, getTotalPrice } = useBookingStore();
  const [currentMonth, setCurrentMonth] = useState(() => new Date());

  const days = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
      }),
    [currentMonth]
  );

  const availableDates = useMemo(
    () => days.filter((day) => !isPast(day) || isToday(day)),
    [days]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Date & Time</h2>
        <p className="text-gray-600">Select your preferred cleaning date and time slot</p>
      </div>

      {/* Quick Picks - #7 */}
      <div className="flex flex-wrap gap-2">
        {quickPicks.map((pick) => {
          const Icon = pick.icon;
          return (
            <motion.button
              key={pick.label}
              onClick={() => setDate(pick.getValue())}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 rounded-lg font-medium text-sm hover:from-primary-100 hover:to-accent-100 transition-all border border-primary-200"
            >
              <Icon className="w-4 h-4" />
              {pick.label}
            </motion.button>
          );
        })}
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
            <h3 className="text-lg font-semibold text-gray-900" aria-live="polite">
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
          <div className="grid grid-cols-7 gap-1 mb-2" role="row">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2" role="columnheader">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1" role="grid" aria-label="Calendar">
            {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
              <div key={`empty-${i}`} role="gridcell" aria-hidden="true" />
            ))}

            {days.map((day) => {
              const isAvailable = availableDates.some((d) => d.getTime() === day.getTime());
              const isSelected = selectedDate && new Date(selectedDate).getTime() === day.getTime();
              const disabled = !isAvailable;
              const isTodayDate = isToday(day);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => !disabled && setDate(day)}
                  disabled={disabled}
                  className={`p-2 rounded-lg text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                    isSelected
                      ? 'bg-primary-600 text-white font-semibold'
                      : isTodayDate
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  role="gridcell"
                  aria-selected={isSelected || undefined}
                  aria-disabled={disabled}
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
            <Clock className="w-5 h-5 text-primary-600" aria-hidden="true" />
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
                    aria-pressed={isSelected}
                  >
                    {formatTime(time)}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <CalendarIcon className="w-12 h-12 mb-4 opacity-50" aria-hidden="true" />
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
                {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')} at {formatTime(selectedTime)}
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
