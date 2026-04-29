import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

  if (!event || event.organizerId !== session.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const totalInvites = event.invites.length;
  const rootInvite = event.invites.find((i) => !i.parentInviteId);
  const responses = event.invites.map((i) => i.response).filter(Boolean);
  const accepted = responses.length;
  const attended = responses.filter((r) => r!.attended).length;
  const shadowAudience = event.invites.filter((i) => i.parentInviteId && i.response?.attended).length;

  return NextResponse.json({
    event,
    rootInvite,
    stats: { totalInvites, accepted, attended, shadowAudience },
  });
}
