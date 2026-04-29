import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const events = await prisma.event.findMany({
    where: { organizerId: session.userId },
    orderBy: { date: "asc" },
    include: {
      invites: { include: { response: true } },
    },
  });

  return (
    <div>
      {/* Header row */}
      <div
        className="flex items-end justify-between"
        style={{ marginBottom: "2.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--border)" }}
      >
        <div>
          <p className="text-eyebrow" style={{ marginBottom: "0.5rem" }}>Dashboard</p>
          <h1
            className="font-display"
            style={{ fontSize: "2.25rem", fontWeight: 400, color: "var(--ink)", lineHeight: 1.15 }}
          >
            Your Events
          </h1>
        </div>
        <Link
          href="/events/new"
          className="btn btn-primary"
        >
          + New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div
          className="text-center"
          style={{ paddingTop: "6rem", paddingBottom: "6rem" }}
        >
          <p
            className="font-display"
            style={{ fontSize: "1.5rem", fontWeight: 400, fontStyle: "italic", color: "var(--ink-muted)", marginBottom: "1.5rem" }}
          >
            No events yet.
          </p>
          <Link
            href="/events/new"
            className="btn btn-secondary"
          >
            Create your first event
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {events.map((event, i) => {
            const responses = event.invites.map((inv) => inv.response).filter(Boolean);
            const accepted = responses.length;
            const attended = responses.filter((r) => r!.attended).length;
            const shadow = event.invites.filter(
              (inv) => inv.parentInviteId && inv.response?.attended
            ).length;

            return (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="event-row"
                style={{
                  borderBottom: "1px solid var(--border)",
                  borderTop: i === 0 ? "1px solid var(--border)" : "none",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2
                    className="font-display"
                    style={{ fontSize: "1.25rem", fontWeight: 400, color: "var(--ink)", marginBottom: "0.25rem" }}
                  >
                    {event.name}
                  </h2>
                  <p
                    className="text-eyebrow"
                    style={{ color: "var(--ink-faint)", textTransform: "none", letterSpacing: "0.03em", fontSize: "0.8125rem" }}
                  >
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    · {event.location}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "3rem", flexShrink: 0 }}>
                  {[
                    { label: "RSVPs", value: accepted },
                    { label: "Attended", value: attended },
                    { label: "Shadow", value: shadow },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ textAlign: "right" }}>
                      <p
                        className="font-display"
                        style={{ fontSize: "1.375rem", fontWeight: 400, color: "var(--ink)", lineHeight: 1 }}
                      >
                        {value}
                      </p>
                      <p className="text-eyebrow" style={{ marginTop: "0.25rem" }}>{label}</p>
                    </div>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
