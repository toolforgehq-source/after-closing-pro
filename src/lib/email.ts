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

export function tradeAssignmentEmail(tradeEmail: string, ticket: { title: string; address: string; summary: string; homeownerName: string; homeownerEmail?: string; homeownerPhone?: string; proposeUrl?: string }) {
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
          ${ticket.proposeUrl ? `
          <div style="margin: 20px 0;">
            <a href="${ticket.proposeUrl}" style="display: inline-block; background: #ea580c; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">Propose a Time</a>
          </div>
          <p style="font-size: 13px; color: #6b7280;">Pick 1&ndash;3 times that work for you. The homeowner will confirm one and everyone gets notified &mdash; no phone tag.</p>
          ` : `<p style="font-size: 13px; color: #6b7280;">Please contact the homeowner or builder to schedule the repair.</p>`}
        </div>
        <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">After Closing Pro</p>
      </div>
    `,
  });
}

const emailShell = (heading: string, headerColor: string, inner: string) => `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: ${headerColor}; padding: 20px; border-radius: 12px 12px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 18px;">${heading}</h1>
    </div>
    <div style="background: white; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
      ${inner}
    </div>
    <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">After Closing Pro</p>
  </div>
`;

const button = (url: string, label: string, color = '#2563eb') =>
  `<div style="margin: 20px 0;"><a href="${url}" style="display: inline-block; background: ${color}; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">${label}</a></div>`;

const slotList = (slots: string[]) =>
  `<div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 16px;">${slots
    .map((s) => `<p style="font-size: 14px; color: #374151; margin: 0 0 6px;">&bull; ${s}</p>`)
    .join('')}</div>`;

/** Sent to the homeowner when the trade proposes time slots. */
export function homeownerProposedTimesEmail(
  homeownerEmail: string,
  data: { title: string; address: string; tradeName: string; slots: string[]; confirmUrl: string }
) {
  return sendEmail({
    to: homeownerEmail,
    subject: `Pick a time for your repair: ${data.title}`,
    html: emailShell('Choose Your Appointment Time', '#2563eb', `
      <h2 style="margin: 0 0 8px; font-size: 16px; color: #111827;">${data.title}</h2>
      <p style="color: #6b7280; font-size: 14px; margin: 0 0 16px;">${data.address}</p>
      <p style="font-size: 14px; color: #374151; margin: 0 0 12px;">${data.tradeName} can come at one of these times:</p>
      ${slotList(data.slots)}
      ${button(data.confirmUrl, 'Confirm a Time')}
      <p style="font-size: 13px; color: #6b7280;">Tap the button to pick the time that works best for you.</p>
    `),
  });
}

/** Sent to trade, homeowner, and builder once a time is confirmed. */
export function appointmentConfirmedEmail(
  to: string,
  data: { title: string; address: string; slot: string; tradeName: string; homeownerName: string; audience: 'trade' | 'homeowner' | 'builder' }
) {
  const intro =
    data.audience === 'trade'
      ? `${data.homeownerName} confirmed your appointment.`
      : data.audience === 'homeowner'
      ? `Your repair appointment is confirmed.`
      : `An appointment was scheduled for this warranty ticket.`;
  return sendEmail({
    to,
    subject: `Appointment confirmed: ${data.title}`,
    html: emailShell('Appointment Confirmed', '#059669', `
      <h2 style="margin: 0 0 8px; font-size: 16px; color: #111827;">${data.title}</h2>
      <p style="color: #6b7280; font-size: 14px; margin: 0 0 16px;">${data.address}</p>
      <p style="font-size: 14px; color: #374151; margin: 0 0 12px;">${intro}</p>
      <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
        <p style="font-size: 12px; color: #6b7280; margin: 0 0 4px;">Scheduled for</p>
        <p style="font-size: 16px; font-weight: 600; color: #065f46; margin: 0;">${data.slot}</p>
      </div>
      <p style="font-size: 14px; color: #374151; margin: 0;">Trade: ${data.tradeName}</p>
      <p style="font-size: 14px; color: #374151; margin: 4px 0 0;">Homeowner: ${data.homeownerName}</p>
    `),
  });
}

/** 24h reminder sent to trade and homeowner. */
export function appointmentReminderEmail(
  to: string,
  data: { title: string; address: string; slot: string; audience: 'trade' | 'homeowner' }
) {
  return sendEmail({
    to,
    subject: `Reminder: appointment tomorrow for ${data.title}`,
    html: emailShell('Appointment Reminder', '#2563eb', `
      <h2 style="margin: 0 0 8px; font-size: 16px; color: #111827;">${data.title}</h2>
      <p style="color: #6b7280; font-size: 14px; margin: 0 0 16px;">${data.address}</p>
      <p style="font-size: 14px; color: #374151; margin: 0 0 12px;">This is a reminder that your appointment is coming up:</p>
      <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px;">
        <p style="font-size: 16px; font-weight: 600; color: #1e40af; margin: 0;">${data.slot}</p>
      </div>
    `),
  });
}

/** Sent to trade and homeowner when the builder cancels an appointment. */
export function appointmentCancelledEmail(
  to: string,
  data: { title: string; address: string; slot?: string }
) {
  return sendEmail({
    to,
    subject: `Appointment cancelled: ${data.title}`,
    html: emailShell('Appointment Cancelled', '#dc2626', `
      <h2 style="margin: 0 0 8px; font-size: 16px; color: #111827;">${data.title}</h2>
      <p style="color: #6b7280; font-size: 14px; margin: 0 0 16px;">${data.address}</p>
      <p style="font-size: 14px; color: #374151; margin: 0;">${data.slot ? `The appointment previously set for ${data.slot} has been cancelled.` : 'The scheduled appointment has been cancelled.'} The builder will follow up if it needs to be rescheduled.</p>
    `),
  });
}
