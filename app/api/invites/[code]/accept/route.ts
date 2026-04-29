import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendConfirmationEmail } from "@/lib/email";

const schema = z.object({
  email: z.email(),
  name: z.string().optional(),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const invite = await prisma.invite.findUnique({
    where: { uniqueCode: code },
    include: { event: true, response: true },
  });

  if (!invite) {
    return NextResponse.json({ error: "Invite not found" }, { status: 404 });
  }

  if (invite.response) {
    return NextResponse.json({ error: "This invite has already been used" }, { status: 409 });
  }

  const { email, name } = parsed.data;

  const response = await prisma.response.create({
    data: {
      inviteId: invite.id,
      recipientEmail: email,
      recipientName: name,
    },
  });

  await sendConfirmationEmail({
    to: email,
    recipientName: name ?? null,
    eventName: invite.event.name,
    eventDate: invite.event.date,
    eventLocation: invite.event.location,
    uniqueCode: invite.uniqueCode,
    shortCode: invite.shortCode,
  });

  return NextResponse.json({ ok: true, shortCode: invite.shortCode, uniqueCode: invite.uniqueCode });
}
