export interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendBookingSMS(
  phone: string,
  bookingId: string,
  date: string,
  time: string,
  service: string
): Promise<SMSResponse> {
  // Integration point for Twilio, MessageBird, or SMS Global
  // For now: return mock success response
  
  const apiKey = process.env.SMS_API_KEY;
  if (!apiKey) {
    console.log('SMS not configured - would send to', phone);
    return { success: true, messageId: 'mock-' + Date.now() };
  }

  try {
    const response = await fetch('/api/sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: phone,
        message: `AusClean Pro: Booking #${bookingId.slice(0, 8)} confirmed for ${service} on ${date} at ${time}. Reply HELP for support.`,
      }),
    });

    if (!response.ok) throw new Error('SMS send failed');
    return await response.json();
  } catch (error) {
    console.error('SMS send error:', error);
    return { success: false, error: 'Failed to send SMS' };
  }
}
