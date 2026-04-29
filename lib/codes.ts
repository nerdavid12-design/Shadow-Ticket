import { customAlphabet } from "nanoid";
import { prisma } from "./db";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 12);
const digits = customAlphabet("0123456789", 6);

export function generateUniqueCode(): string {
  return nanoid();
}

export async function generateShortCode(): Promise<string> {
  for (let attempt = 0; attempt < 20; attempt++) {
    const code = digits();
    const existing = await prisma.invite.findUnique({ where: { shortCode: code } });
    if (!existing) return code;
  }
  throw new Error("Failed to generate unique short code after 20 attempts");
}
