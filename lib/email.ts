import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM ?? "onboarding@resend.dev";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function sendInviteEmail({
  to,
  eventName,
  eventDate,
  eventLocation,
  inviteCode,
}: {
  to: string;
  eventName: string;
  eventDate: Date;
  eventLocation: string;
  inviteCode: string;
}) {
  const inviteUrl = `${APP_URL}/invite/${inviteCode}`;
  const dateStr = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  await resend.emails.send({
    from: FROM,
    to,
    subject: `You're invited to ${eventName}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px">
        <h1 style="font-size:24px;margin-bottom:8px">You're invited!</h1>
        <h2 style="font-size:20px;color:#333;margin-top:0">${eventName}</h2>
        <p style="color:#555">${dateStr} &bull; ${eventLocation}</p>
        <a href="${inviteUrl}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#000;color:#fff;border-radius:6px;text-decoration:none;font-weight:600">View Invite</a>
        <p style="color:#888;font-size:13px;margin-top:24px">Or copy this link: ${inviteUrl}</p>
      </div>
    `,
  });
}

export async function sendConfirmationEmail({
  to,
  recipientName,
  eventName,
  eventDate,
  eventLocation,
  uniqueCode,
  shortCode,
}: {
  to: string;
  recipientName: string | null;
  eventName: string;
  eventDate: Date;
  eventLocation: string;
  uniqueCode: string;
  shortCode: string;
}) {
  const confirmUrl = `${APP_URL}/accept/${uniqueCode}`;
  const dateStr = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const greeting = recipientName ? `Hi ${recipientName},` : "Hi there,";

  await resend.emails.send({
    from: FROM,
    to,
    subject: `RSVP confirmed — ${eventName}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px">
        <p>${greeting}</p>
        <p>Your RSVP for <strong>${eventName}</strong> is confirmed.</p>
        <p style="color:#555">${dateStr} &bull; ${eventLocation}</p>
        <p style="margin-top:24px">Show this at the door:</p>
        <div style="background:#f4f4f4;border-radius:8px;padding:24px;text-align:center;margin:16px 0">
          <p style="font-size:14px;color:#666;margin:0 0 8px">6-digit code</p>
          <p style="font-size:48px;font-weight:700;letter-spacing:8px;margin:0">${shortCode}</p>
          <p style="font-size:13px;color:#888;margin:16px 0 0">Or show your QR code at: <a href="${confirmUrl}">${confirmUrl}</a></p>
        </div>
      </div>
    `,
  });
}
