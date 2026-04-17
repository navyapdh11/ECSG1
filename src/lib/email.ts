import { Resend } from 'resend';

let resendInstance: Resend | null = null;

export function getResend(): Resend {
  if (resendInstance) return resendInstance;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set in environment variables');
  }

  resendInstance = new Resend(apiKey);
  return resendInstance;
}

export interface ReceiptEmailData {
  to: string;
  name: string;
  bookingId: string;
  services: Array<{ name: string; price: number; quantity: number }>;
  total: number;
  bookingDate: string;
  bookingTime: string;
  address: string;
  paymentIntentId?: string;
}

export async function sendReceiptEmail(data: ReceiptEmailData) {
  const resend = getResend();
  const totalInDollars = (data.total / 100).toFixed(2);
  const servicesList = data.services
    .map((s) => `${s.name} × ${s.quantity} — $${(s.price / 100).toFixed(2)}`)
    .join('\n');

  const { data: emailData, error } = await resend.emails.send({
    from: process.env.FROM_EMAIL || 'ECSG1 <noreply@ecsg1.com>',
    to: data.to,
    subject: `Booking Confirmed — ${data.bookingId}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0ea5e9, #0284c7); padding: 32px; border-radius: 16px 16px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Booking Confirmed! 🎉</h1>
        </div>
        <div style="border: 1px solid #e5e7eb; border-radius: 0 0 16px 16px; padding: 32px;">
          <p>Hi ${data.name},</p>
          <p>Your cleaning service has been booked and confirmed. Here are your details:</p>
          
          <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Booking ID: <code style="background: #e5e7eb; padding: 4px 8px; border-radius: 6px;">${data.bookingId}</code></h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #6b7280;">Date</td><td style="padding: 8px 0; font-weight: 600;">${data.bookingDate}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Time</td><td style="padding: 8px 0; font-weight: 600;">${data.bookingTime}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Address</td><td style="padding: 8px 0; font-weight: 600;">${data.address}</td></tr>
            </table>
          </div>

          <h3>Services</h3>
          <div style="background: #f9fafb; border-radius: 12px; padding: 20px;">
            <pre style="margin: 0; white-space: pre-wrap; font-family: system-ui;">${servicesList}</pre>
          </div>

          <div style="text-align: right; margin-top: 20px;">
            <p style="font-size: 24px; font-weight: bold; color: #0ea5e9;">Total: $${totalInDollars}</p>
          </div>

          <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              Need help? Reply to this email or contact us at 
              <a href="mailto:support@ecsg1.com" style="color: #0ea5e9;">support@ecsg1.com</a>
            </p>
          </div>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error('Failed to send receipt email:', error);
    throw error;
  }

  return emailData;
}

export async function sendBookingConfirmationEmail(data: ReceiptEmailData) {
  return sendReceiptEmail(data);
}
