import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getAncestorEmails } from "@/lib/chain";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event || event.organizerId !== session.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const invites = await prisma.invite.findMany({
    where: { eventId: id },
    include: { response: true },
    orderBy: { createdAt: "asc" },
  });

  const rows: string[] = [
    "email,name,accepted_at,attended,attended_at,invite_chain",
  ];

  for (const invite of invites) {
    if (!invite.response) continue;
    const r = invite.response;
    const chain = await getAncestorEmails(invite.id);
    rows.push(
      [
        csvEscape(r.recipientEmail),
        csvEscape(r.recipientName ?? ""),
        r.acceptedAt.toISOString(),
        r.attended ? "yes" : "no",
        r.attendedAt?.toISOString() ?? "",
        csvEscape(chain.join(" → ")),
      ].join(",")
    );
  }

  const csv = rows.join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="attendees-${id}.csv"`,
    },
  });
}

function csvEscape(val: string): string {
  if (val.includes(",") || val.includes('"') || val.includes("\n")) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}
