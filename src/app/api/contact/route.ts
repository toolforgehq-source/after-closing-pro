import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    await sendEmail({
      to: 'support@afterclosingpro.com',
      subject: `Contact Form: ${name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2563eb; padding: 20px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 18px;">New Contact Form Message</h1>
          </div>
          <div style="background: white; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <div style="margin-bottom: 16px;">
              <p style="font-size: 12px; color: #6b7280; margin: 0 0 4px;">From</p>
              <p style="font-size: 14px; color: #111827; margin: 0;">${name}</p>
            </div>
            <div style="margin-bottom: 16px;">
              <p style="font-size: 12px; color: #6b7280; margin: 0 0 4px;">Email</p>
              <p style="font-size: 14px; color: #111827; margin: 0;"><a href="mailto:${email}" style="color: #2563eb;">${email}</a></p>
            </div>
            <div style="background: #f9fafb; border-radius: 8px; padding: 16px;">
              <p style="font-size: 12px; color: #6b7280; margin: 0 0 8px;">Message</p>
              <p style="font-size: 14px; color: #374151; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">After Closing Pro</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
