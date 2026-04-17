import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createBooking, updateBookingStatus } from '@/lib/database';
import { format } from 'date-fns';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      services,
      total,
      email,
      name,
      phone,
      date,
      time,
      address,
      specialInstructions,
    } = body;

    // Validate required fields
    if (!services || !total || !email || !name || !date || !time || !address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create booking in database first
    const booking = createBooking({
      user_email: email,
      user_name: name,
      user_phone: phone,
      services: services.map((s: { name: string; price: number; quantity: number }) => ({
        name: s.name,
        price: Math.round(s.price * 100), // Convert to cents
        quantity: s.quantity,
      })),
      total_amount: Math.round(total * 100), // Convert to cents
      booking_date: typeof date === 'string' ? date : format(new Date(date), 'yyyy-MM-dd'),
      booking_time: time,
      address: {
        street: address.street || '',
        city: address.city || '',
        state: address.state || '',
        zipCode: address.zipCode || '',
        country: address.country || 'US',
      },
      special_instructions: specialInstructions,
    });

    // Create Stripe Checkout Session
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      metadata: {
        bookingId: booking.id,
        userEmail: email,
        bookingDate: booking.booking_date,
        bookingTime: booking.booking_time,
      },
      line_items: services.map((s: { name: string; price: number; quantity: number }) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: s.name,
            description: `Quantity: ${s.quantity}`,
          },
          unit_amount: Math.round(s.price * 100), // Stripe expects cents
        },
        quantity: s.quantity,
      })),
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/bookings?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/booking`,
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
    });

    // Update booking with Stripe session ID
    updateBookingStatus(booking.id, 'pending', { stripe_session_id: session.id });

    return NextResponse.json({ 
      url: session.url,
      sessionId: session.id,
      bookingId: booking.id,
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
