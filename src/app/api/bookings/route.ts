import { NextRequest, NextResponse } from 'next/server';
import { getBookingsByEmail, getBookingById } from '@/lib/database';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const id = searchParams.get('id');

  try {
    if (id) {
      const booking = getBookingById(id);
      if (!booking) {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
      }
      return NextResponse.json(booking);
    }

    if (email) {
      const bookings = getBookingsByEmail(email);
      return NextResponse.json(bookings);
    }

    return NextResponse.json(
      { error: 'Please provide an email or booking ID' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Bookings API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
