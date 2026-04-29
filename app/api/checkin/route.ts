import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const schema = z.object({ code: z.string().min(1) });

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Code required" }, { status: 400 });
  }

  const { code } = parsed.data;

  const invite = await prisma.invite.findFirst({
    where: { OR: [{ uniqueCode: code }, { shortCode: code }] },
    include: { response: true, event: true },
  });

  if (!invite) {
    return NextResponse.json({ error: "Invalid code — not found" }, { status: 404 });
  }

  if (!invite.response) {
    return NextResponse.json({ error: "This person has not RSVPd" }, { status: 400 });
  }

  if (invite.response.attended) {
    const checkedAt = invite.response.attendedAt?.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    return NextResponse.json(
      { error: `Already checked in at ${checkedAt}` },
      { status: 409 }
    );
  }

  const updated = await prisma.response.update({
    where: { id: invite.response.id },
    data: { attended: true, attendedAt: new Date() },
  });

  return NextResponse.json({
    ok: true,
    name: updated.recipientName,
    email: updated.recipientEmail,
    eventName: invite.event.name,
  });
}
