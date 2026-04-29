import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import InviteActions from "@/components/InviteActions";

export default async function InvitePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const invite = await prisma.invite.findUnique({
    where: { uniqueCode: code },
    include: { event: true, response: true },
  });

  if (!invite) notFound();

  const alreadyAccepted = !!invite.response;

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">You&apos;re invited!</h1>
        <p className="text-center text-gray-500 mb-8 text-sm">Shadow Tixs</p>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-4">
          <h2 className="text-xl font-bold">{invite.event.name}</h2>
          <p className="text-gray-600 mt-2 text-sm">
            {new Date(invite.event.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
          <p className="text-gray-600 text-sm">{invite.event.location}</p>
          {invite.event.description && (
            <p className="text-gray-500 text-sm mt-3">{invite.event.description}</p>
          )}
        </div>

        {alreadyAccepted ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-green-700 font-medium">This invite has already been accepted.</p>
            <p className="text-green-600 text-sm mt-1">
              Check your email for your QR code and entry code.
            </p>
          </div>
        ) : (
          <InviteActions inviteCode={code} />
        )}
      </div>
    </div>
  );
}
