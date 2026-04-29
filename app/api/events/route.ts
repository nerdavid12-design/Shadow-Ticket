import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { generateUniqueCode, generateShortCode } from "@/lib/codes";

const createSchema = z.object({
  name: z.string().min(1),
  date: z.string(),
  location: z.string().min(1),
  capacity: z.number().int().positive().optional(),
  description: z.string().optional(),
});

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const events = await prisma.event.findMany({
    where: { organizerId: session.userId },
    orderBy: { date: "asc" },
    include: {
      _count: { select: { invites: true } },
    },
  });

  return NextResponse.json({ events });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { name, date, location, capacity, description } = parsed.data;

  const event = await prisma.event.create({
    data: {
      organizerId: session.userId,
      name,
      date: new Date(date),
      location,
      capacity,
      description,
    },
  });

  const uniqueCode = generateUniqueCode();
  const shortCode = await generateShortCode();
  await prisma.invite.create({
    data: { eventId: event.id, uniqueCode, shortCode },
  });

  return NextResponse.json({ event }, { status: 201 });
}
