import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { getBookingById, updateBookingStatus } from '@/lib/database';
import { sendReceiptEmail } from '@/lib/email';
import { format } from 'date-fns';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No Stripe signature' },
      { status: 400 }
    );
  }

  let event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid webhook signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.bookingId;

        if (!bookingId) {
          console.error('No booking ID in session metadata');
          break;
        }

        const booking = getBookingById(bookingId);
        if (!booking) {
          console.error(`Booking ${bookingId} not found`);
          break;
        }

        // Update booking to paid
        const updated = updateBookingStatus(bookingId, 'paid', {
          stripe_payment_intent_id: session.payment_intent as string,
          status: 'paid',
        });

        // Send receipt email
        if (updated) {
          const services = JSON.parse(updated.services);
          const address = JSON.parse(updated.address);

          try {
            await sendReceiptEmail({
              to: updated.user_email,
              name: updated.user_name,
              bookingId: updated.id,
              services,
              total: updated.total_amount,
              bookingDate: format(new Date(updated.booking_date), 'EEEE, MMMM d, yyyy'),
              bookingTime: updated.booking_time,
              address: `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`,
              paymentIntentId: updated.stripe_payment_intent_id || undefined,
            });
          } catch (emailError) {
            console.error('Failed to send receipt email:', emailError);
          }
        }

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const bookingId = paymentIntent.metadata?.bookingId;

        if (bookingId) {
          updateBookingStatus(bookingId, 'cancelled');
        }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        const bookingId = charge.metadata?.bookingId;

        if (bookingId) {
          updateBookingStatus(bookingId, 'refunded');
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Disable body parsing for Stripe webhooks (we need raw body)
export const config = {
  api: {
    bodyParser: false,
  },
};
