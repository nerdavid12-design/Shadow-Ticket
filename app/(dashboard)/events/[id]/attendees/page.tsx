import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getAncestorEmails } from "@/lib/chain";

export default async function AttendeesPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      invites: {
        include: { response: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!event || event.organizerId !== session.userId) notFound();

  const invitesWithResponses = event.invites.filter((i) => i.response);
  const chains = await Promise.all(
    invitesWithResponses.map(async (invite) => ({
      invite,
      response: invite.response!,
      chain: await getAncestorEmails(invite.id),
    }))
  );

  return (
    <div>
      <Link href={`/events/${id}`} className="back-link" style={{ display: "inline-block", marginBottom: "2.5rem" }}>
        ← Back to event
      </Link>

      <div
        className="flex items-end justify-between"
        style={{ marginBottom: "2.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--border)" }}
      >
        <div>
          <p className="text-eyebrow" style={{ marginBottom: "0.5rem" }}>{event.name}</p>
          <h1
            className="font-display"
            style={{ fontSize: "2.25rem", fontWeight: 400, color: "var(--ink)" }}
          >
            Attendees
          </h1>
        </div>
        <a
          href={`/api/events/${id}/export`}
          download
          className="btn btn-secondary"
        >
          Export CSV
        </a>
      </div>

      {chains.length === 0 ? (
        <div className="text-center" style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
          <p
            className="font-display"
            style={{ fontSize: "1.375rem", fontWeight: 400, fontStyle: "italic", color: "var(--ink-muted)" }}
          >
            No RSVPs yet.
          </p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Email", "Name", "RSVP date", "Attended", "Invite chain"].map((col) => (
                  <th
                    key={col}
                    style={{
                      textAlign: "left",
                      padding: "0.625rem 1rem",
                      fontSize: "0.6875rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                      color: "var(--ink-muted)",
                      fontFamily: "var(--font-inter), sans-serif",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chains.map(({ invite, response, chain }) => (
                <tr
                  key={invite.id}
                  className="table-row"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <td
                    style={{
                      padding: "1rem",
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "0.8125rem",
                      color: "var(--ink)",
                    }}
                  >
                    {response.recipientEmail}
                  </td>
                  <td style={{ padding: "1rem", fontSize: "0.875rem", color: "var(--ink)" }}>
                    {response.recipientName ?? "—"}
                  </td>
                  <td style={{ padding: "1rem", fontSize: "0.8125rem", color: "var(--ink-muted)" }}>
                    {new Date(response.acceptedAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    {response.attended ? (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "var(--success)",
                          fontWeight: 500,
                        }}
                      >
                        ✓ Yes
                      </span>
                    ) : (
                      <span style={{ fontSize: "0.8125rem", color: "var(--ink-faint)" }}>—</span>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "1rem",
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "0.75rem",
                      color: "var(--ink-muted)",
                    }}
                  >
                    {chain.length > 1 ? chain.join(" → ") : "Direct"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
