import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { buildChain, ChainNode } from "@/lib/chain";

function ChainTree({ nodes, depth = 0 }: { nodes: ChainNode[]; depth?: number }) {
  return (
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        marginLeft: depth > 0 ? "1.75rem" : 0,
        marginTop: depth > 0 ? "0.75rem" : 0,
        borderLeft: depth > 0 ? "1px solid var(--border)" : "none",
        paddingLeft: depth > 0 ? "1.25rem" : 0,
      }}
    >
      {nodes.map((node) => (
        <li key={node.inviteId} style={{ marginBottom: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <span
              style={{
                display: "inline-block",
                width: "0.5rem",
                height: "0.5rem",
                borderRadius: "50%",
                flexShrink: 0,
                backgroundColor: node.attended
                  ? "var(--success)"
                  : node.acceptedAt
                  ? "var(--accent)"
                  : "var(--border-mid)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: "0.8125rem",
                color: node.email ? "var(--ink)" : "var(--ink-faint)",
                fontStyle: node.email ? "normal" : "italic",
              }}
            >
              {node.email ?? "link created — not accepted"}
            </span>
            {node.name && (
              <span style={{ fontSize: "0.8125rem", color: "var(--ink-muted)" }}>
                ({node.name})
              </span>
            )}
            {node.attended && (
              <span
                style={{
                  fontSize: "0.6875rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--success)",
                  fontWeight: 500,
                }}
              >
                attended
              </span>
            )}
          </div>
          {node.children.length > 0 && (
            <ChainTree nodes={node.children} depth={depth + 1} />
          )}
        </li>
      ))}
    </ul>
  );
}

export default async function ChainPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event || event.organizerId !== session.userId) notFound();

  const chain = await buildChain(id);

  return (
    <div>
      <Link href={`/events/${id}`} className="back-link" style={{ display: "inline-block", marginBottom: "2.5rem" }}>
        ← Back to event
      </Link>

      <div style={{ marginBottom: "2.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--border)" }}>
        <p className="text-eyebrow" style={{ marginBottom: "0.5rem" }}>{event.name}</p>
        <h1
          className="font-display"
          style={{ fontSize: "2.25rem", fontWeight: 400, color: "var(--ink)" }}
        >
          Invite chain
        </h1>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "1.5rem", marginBottom: "2rem" }}>
        {[
          { color: "var(--success)", label: "Attended" },
          { color: "var(--accent)", label: "RSVPd" },
          { color: "var(--border-mid)", label: "Invite sent" },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                display: "inline-block",
                width: "0.5rem",
                height: "0.5rem",
                borderRadius: "50%",
                backgroundColor: color,
              }}
            />
            <span className="text-eyebrow" style={{ color: "var(--ink-muted)" }}>{label}</span>
          </div>
        ))}
      </div>

      <div className="card">
        {chain.length === 0 ? (
          <p
            className="font-display"
            style={{ fontStyle: "italic", color: "var(--ink-muted)", fontSize: "1.125rem" }}
          >
            No invites yet.
          </p>
        ) : (
          <ChainTree nodes={chain} />
        )}
      </div>
    </div>
  );
}
