import type { Invite, Response } from "@/app/generated/prisma/client";
import { prisma } from "./db";

type InviteWithResponse = Invite & { response: Response | null };

export type ChainNode = {
  inviteId: string;
  email: string | null;
  name: string | null;
  acceptedAt: Date | null;
  attended: boolean;
  children: ChainNode[];
};

export async function buildChain(eventId: string): Promise<ChainNode[]> {
  const invites = await prisma.invite.findMany({
    where: { eventId },
    include: { response: true },
    orderBy: { createdAt: "asc" },
  });

  const nodeMap = new Map<string, ChainNode>();
  for (const inv of invites) {
    nodeMap.set(inv.id, {
      inviteId: inv.id,
      email: inv.response?.recipientEmail ?? null,
      name: inv.response?.recipientName ?? null,
      acceptedAt: inv.response?.acceptedAt ?? null,
      attended: inv.response?.attended ?? false,
      children: [],
    });
  }

  const roots: ChainNode[] = [];
  for (const inv of invites) {
    const node = nodeMap.get(inv.id)!;
    if (inv.parentInviteId) {
      nodeMap.get(inv.parentInviteId)?.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

export async function getAncestorEmails(inviteId: string): Promise<string[]> {
  const chain: string[] = [];
  let currentId: string | null = inviteId;

  while (currentId) {
    const found: InviteWithResponse | null = await prisma.invite.findUnique({
      where: { id: currentId },
      include: { response: true },
    });
    if (!found) break;
    if (found.response?.recipientEmail) {
      chain.unshift(found.response.recipientEmail);
    }
    currentId = found.parentInviteId;
  }

  return chain;
}
