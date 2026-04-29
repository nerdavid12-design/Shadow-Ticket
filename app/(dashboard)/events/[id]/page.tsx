import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import SendInviteForm from "@/components/SendInviteForm";
import CopyLink from "@/components/CopyLink";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      invites: { include: { response: true } },
    },
  });

  if (!event || event.organizerId !== session.userId) notFound();

  const rootInvite = event.invites.find((i) => !i.parentInviteId);
  const responses = event.invites.map((i) => i.response).filter(Boolean);
  const accepted = responses.length;
  const attended = responses.filter((r) => r!.attended).length;
  const shadowAudience = event.invites.filter((i) => i.parentInviteId && i.response?.attended).length;
  const invitesSent = event.invites.length - 1;

  const inviteUrl = rootInvite ? `${APP_URL}/invite/${rootInvite.uniqueCode}` : null;

  return (
    <div>
      {/* Back link */}
      <Link href="/dashboard" className="back-link" style={{ display: "inline-block", marginBottom: "2.5rem" }}>
        ← All events
      </Link>

      {/* Event hero */}
      <div style={{ marginBottom: "3rem", paddingBottom: "2.5rem", borderBottom: "1px solid var(--border)" }}>
        <p className="text-eyebrow" style={{ marginBottom: "0.75rem" }}>
          {new Date(event.date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}{" "}
          · {event.location}
          {event.capacity ? ` · Capacity ${event.capacity}` : ""}
        </p>
        <h1
          className="font-display"
          style={{
            fontSize: "2.75rem",
            fontWeight: 400,
            fontStyle: "italic",
            color: "var(--ink)",
            lineHeight: 1.15,
            marginBottom: event.description ? "1rem" : 0,
          }}
        >
          {event.name}
        </h1>
        {event.description && (
          <p style={{ fontSize: "1rem", color: "var(--ink-muted)", marginTop: "0.75rem", maxWidth: "48rem" }}>
            {event.description}
          </p>
        )}
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "0",
          marginBottom: "3rem",
        }}
      >
        {[
          { label: "Invites sent", value: invitesSent },
          { label: "RSVPs", value: accepted },
          { label: "Attended", value: attended },
          { label: "Shadow audience", value: shadowAudience },
        ].map(({ label, value }, i) => (
          <div
            key={label}
            style={{
              padding: "2rem 1.5rem",
              borderLeft: i === 0 ? "1px solid var(--border)" : "none",
              borderRight: "1px solid var(--border)",
              borderTop: "1px solid var(--border)",
              borderBottom: "1px solid var(--border)",
              textAlign: "center",
            }}
          >
            <p
              className="font-display stat-number"
              style={{ fontSize: "3rem" }}
            >
              {value}
            </p>
            <p className="stat-label">{label}</p>
          </div>
        ))}
      </div>

      {/* Invite link card */}
      {inviteUrl && (
        <div className="card" style={{ marginBottom: "2rem" }}>
          <p className="text-eyebrow" style={{ marginBottom: "1rem" }}>Root invite link</p>
          <CopyLink url={inviteUrl} />
          {rootInvite && (
            <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
              <p
                style={{ fontSize: "0.8125rem", color: "var(--ink-muted)", marginBottom: "0.75rem" }}
              >
                Or send directly to an email address:
              </p>
              <SendInviteForm inviteCode={rootInvite.uniqueCode} />
            </div>
          )}
        </div>
      )}

      {/* Quick links */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        {[
          { href: `/events/${id}/attendees`, label: "Attendee list & CSV" },
          { href: `/events/${id}/checkin`, label: "Check-in scanner" },
          { href: `/events/${id}/chain`, label: "Invite chain" },
        ].map(({ href, label }) => (
          <Link key={href} href={href} className="btn btn-secondary">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
