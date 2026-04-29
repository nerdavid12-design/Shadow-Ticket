import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import CheckinScanner from "@/components/CheckinScanner";

export default async function CheckinPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event || event.organizerId !== session.userId) notFound();

  return (
    <div style={{ maxWidth: "32rem", margin: "0 auto" }}>
      <Link href={`/events/${id}`} className="back-link" style={{ display: "inline-block", marginBottom: "2.5rem" }}>
        ← Back to event
      </Link>

      <div style={{ marginBottom: "2.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--border)" }}>
        <p className="text-eyebrow" style={{ marginBottom: "0.5rem" }}>{event.name}</p>
        <h1
          className="font-display"
          style={{ fontSize: "2.25rem", fontWeight: 400, color: "var(--ink)" }}
        >
          Check-in
        </h1>
      </div>

      <CheckinScanner />
    </div>
  );
}
