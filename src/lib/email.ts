import { Resend } from 'resend';

let resendClient: Resend | null = null;

function getResend(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY || '');
  }
  return resendClient;
}

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_placeholder') {
    console.log(`[Email] Would send to ${to}: ${subject}`);
    return;
  }

  await getResend().emails.send({
    from: 'After Closing Pro <support@afterclosingpro.com>',
    to,
    subject,
    html,
  });
}

export function newTicketEmail(builderEmail: string, ticket: { title: string; address: string; urgency: string; aiSummary: string }) {
  return sendEmail({
    to: builderEmail,
    subject: `New Warranty Request: ${ticket.title}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2563eb; padding: 20px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 18px;">New Warranty Request</h1>
        </div>
        <div style="background: white; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="margin: 0 0 8px; font-size: 16px; color: #111827;">${ticket.title}</h2>
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 16px;">${ticket.address}</p>
          <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
            <p style="font-size: 12px; color: #6b7280; margin: 0 0 4px;">AI Summary</p>
            <p style="font-size: 14px; color: #374151; margin: 0;">${ticket.aiSummary}</p>
          </div>
          <div style="display: inline-block; background: ${ticket.urgency === 'emergency' ? '#fef2f2' : '#eff6ff'}; color: ${ticket.urgency === 'emergency' ? '#991b1b' : '#1e40af'}; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
            ${ticket.urgency.toUpperCase()}
          </div>
          <div style="margin-top: 24px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/tickets" style="display: inline-block; background: #2563eb; color: white; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">View in Dashboard</a>
          </div>
        </div>
        <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">After Closing Pro</p>
      </div>
    `,
  });
}

export function tradeAssignmentEmail(tradeEmail: string, ticket: { title: string; address: string; summary: string; homeownerName: string; homeownerEmail?: string; homeownerPhone?: string }) {
  const contactLines: string[] = [];
  if (ticket.homeownerPhone) {
    contactLines.push(`<p style="font-size: 14px; color: #374151; margin: 0 0 4px;">Phone: <a href="tel:${ticket.homeownerPhone}" style="color: #2563eb; text-decoration: none;">${ticket.homeownerPhone}</a></p>`);
  }
  if (ticket.homeownerEmail) {
    contactLines.push(`<p style="font-size: 14px; color: #374151; margin: 0;">Email: <a href="mailto:${ticket.homeownerEmail}" style="color: #2563eb; text-decoration: none;">${ticket.homeownerEmail}</a></p>`);
  }

  return sendEmail({
    to: tradeEmail,
    subject: `Warranty Work Assignment: ${ticket.title}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ea580c; padding: 20px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 18px;">New Warranty Assignment</h1>
        </div>
        <div style="background: white; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="margin: 0 0 8px; font-size: 16px; color: #111827;">${ticket.title}</h2>
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px;">${ticket.address}</p>
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 16px;">Homeowner: ${ticket.homeownerName}</p>
          ${contactLines.length > 0 ? `
          <div style="background: #eff6ff; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
            <p style="font-size: 12px; color: #6b7280; margin: 0 0 8px; font-weight: 600;">Homeowner Contact</p>
            ${contactLines.join('\n            ')}
          </div>
          ` : ''}
          <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
            <p style="font-size: 12px; color: #6b7280; margin: 0 0 4px;">Issue Summary</p>
            <p style="font-size: 14px; color: #374151; margin: 0;">${ticket.summary}</p>
          </div>
          <p style="font-size: 13px; color: #6b7280;">Please contact the homeowner or builder to schedule the repair.</p>
        </div>
        <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">After Closing Pro</p>
      </div>
    `,
  });
}
