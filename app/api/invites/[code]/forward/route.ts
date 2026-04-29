import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateUniqueCode, generateShortCode } from "@/lib/codes";
import { sendInviteEmail } from "@/lib/email";

const schema = z.object({ email: z.email() });

export async function POST(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const parentInvite = await prisma.invite.findUnique({
    where: { uniqueCode: code },
    include: { event: true },
  });

  if (!parentInvite) {
    return NextResponse.json({ error: "Invite not found" }, { status: 404 });
  }

  const { email } = parsed.data;

  const uniqueCode = generateUniqueCode();
  const shortCode = await generateShortCode();

  const newInvite = await prisma.invite.create({
    data: {
      eventId: parentInvite.eventId,
      parentInviteId: parentInvite.id,
      uniqueCode,
      shortCode,
    },
  });

  await prisma.share.create({
    data: {
      fromInviteId: parentInvite.id,
      toEmail: email,
      toInviteId: newInvite.id,
    },
  });

  await sendInviteEmail({
    to: email,
    eventName: parentInvite.event.name,
    eventDate: parentInvite.event.date,
    eventLocation: parentInvite.event.location,
    inviteCode: uniqueCode,
  });

  return NextResponse.json({ ok: true, inviteCode: uniqueCode });
}
