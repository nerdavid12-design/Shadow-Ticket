import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import QRCodeDisplay from "@/components/QRCodeDisplay";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default async function AcceptPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const invite = await prisma.invite.findUnique({
    where: { uniqueCode: code },
    include: { event: true, response: true },
  });

  if (!invite || !invite.response) notFound();

  const r = invite.response;
  const qrValue = `${APP_URL}/accept/${code}`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-1">
          {r.recipientName ? `Hi, ${r.recipientName}!` : "You're confirmed!"}
        </h1>
        <h2 className="text-lg text-gray-600 mb-6">{invite.event.name}</h2>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 mb-4">Show at the door — QR code or 6-digit code</p>
          <QRCodeDisplay value={qrValue} shortCode={invite.shortCode} />
          <p className="text-xs text-gray-400 mt-4">{r.recipientEmail}</p>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          <p>
            {new Date(invite.event.date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <p>{invite.event.location}</p>
        </div>
      </div>
    </div>
  );
}
