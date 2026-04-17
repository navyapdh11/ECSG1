'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, DollarSign, ArrowLeft, Search, ExternalLink, CheckCircle, XCircle, Clock as ClockIcon, CreditCard } from 'lucide-react';

interface Booking {
  id: string;
  user_email: string;
  user_name: string;
  services: Array<{ name: string; price: number; quantity: number }>;
  total_amount: number;
  status: string;
  booking_date: string;
  booking_time: string;
  address: { street: string; city: string; state: string; zipCode: string };
  created_at: string;
  stripe_payment_intent_id?: string;
}

const statusConfig: Record<string, { color: string; bg: string; icon: typeof CheckCircle; label: string }> = {
  paid: { color: 'text-success-600', bg: 'bg-success-50', icon: CheckCircle, label: 'Paid' },
  pending: { color: 'text-warning-600', bg: 'bg-warning-50', icon: ClockIcon, label: 'Pending' },
  confirmed: { color: 'text-primary-600', bg: 'bg-primary-50', icon: CheckCircle, label: 'Confirmed' },
  cancelled: { color: 'text-error-600', bg: 'bg-error-50', icon: XCircle, label: 'Cancelled' },
  refunded: { color: 'text-gray-600', bg: 'bg-gray-50', icon: CreditCard, label: 'Refunded' },
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    const email = params.get('email') || '';

    if (sessionId || email) {
      fetchBookings(email);
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchBookings(email: string) {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (email) params.set('email', email);
      const res = await fetch(`/api/bookings?${params}`);
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  const filtered = bookings.filter(
    (b) =>
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.user_email.toLowerCase().includes(search.toLowerCase()) ||
      b.user_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Booking History</h1>
            <p className="text-gray-600 mt-1">View and manage your cleaning service bookings</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by booking ID, name, or email..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-600 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-error-50 text-error-700 rounded-xl text-center">
            <p>{error}</p>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && filtered.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16 bg-white rounded-xl">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">
              {search ? 'Try adjusting your search' : 'Book a cleaning service to get started'}
            </p>
            {!search && (
              <Link
                href="/#booking"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Book a Cleaning
                <ExternalLink className="w-4 h-4" />
              </Link>
            )}
          </motion.div>
        )}

        {/* Bookings List */}
        <div className="space-y-4">
          {filtered.map((booking) => {
            const config = statusConfig[booking.status] || statusConfig.pending;
            const StatusIcon = config.icon;
            const services = booking.services;
            const address = booking.address;

            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-primary-200 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900">Booking #{booking.id.slice(0, 8)}</h3>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {config.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{booking.user_name} • {booking.user_email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">${(booking.total_amount / 100).toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{new Date(booking.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary-600 flex-shrink-0" />
                    <span className="text-gray-700">{new Date(booking.booking_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-primary-600 flex-shrink-0" />
                    <span className="text-gray-700">{booking.booking_time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-primary-600 flex-shrink-0" />
                    <span className="text-gray-700">{services.length} service(s)</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {services.map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {s.name} × {s.quantity}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {address.street}, {address.city}, {address.state} {address.zipCode}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
