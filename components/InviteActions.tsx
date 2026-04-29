"use client";

import { useState } from "react";

type Mode = "choose" | "rsvp" | "forward" | "rsvp_done" | "forward_done";

export default function InviteActions({ inviteCode }: { inviteCode: string }) {
  const [mode, setMode] = useState<Mode>("choose");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [uniqueCode, setUniqueCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRsvp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch(`/api/invites/${inviteCode}/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name: name || undefined }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setShortCode(data.shortCode);
      setUniqueCode(data.uniqueCode);
      setMode("rsvp_done");
    } else {
      setError(data.error ?? "Something went wrong");
    }
  }

  async function handleForward(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch(`/api/invites/${inviteCode}/forward`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setMode("forward_done");
    } else {
      setError(data.error ?? "Something went wrong");
    }
  }

  if (mode === "rsvp_done") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
        <p className="text-green-700 font-semibold text-lg mb-1">You&apos;re confirmed!</p>
        <p className="text-green-600 text-sm mb-4">
          Check your email for your QR code. Show this at the door:
        </p>
        <p className="text-5xl font-bold tracking-widest text-gray-900 my-4">{shortCode}</p>
        <p className="text-xs text-gray-400">
          Your QR code page:{" "}
          <a href={`/accept/${uniqueCode}`} className="underline">
            Open
          </a>
        </p>
      </div>
    );
  }

  if (mode === "forward_done") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
        <p className="text-green-700 font-semibold">Invite sent!</p>
        <p className="text-green-600 text-sm mt-1">Your friend will receive an email with their invite link.</p>
        <button onClick={() => { setMode("choose"); setEmail(""); }} className="mt-4 text-sm underline text-gray-500">
          Send another
        </button>
      </div>
    );
  }

  if (mode === "rsvp") {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-semibold mb-4">RSVP — confirm your spot</h3>
        <form onSubmit={handleRsvp} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your name <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setMode("choose")}
              className="flex-1 border border-gray-300 rounded-lg py-2 text-sm font-medium hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-black text-white rounded-lg py-2 text-sm font-semibold hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Confirming…" : "Confirm RSVP"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (mode === "forward") {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-semibold mb-4">Invite a friend</h3>
        <form onSubmit={handleForward} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Friend&apos;s email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="friend@example.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setMode("choose")}
              className="flex-1 border border-gray-300 rounded-lg py-2 text-sm font-medium hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-black text-white rounded-lg py-2 text-sm font-semibold hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Sending…" : "Send invite"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => setMode("rsvp")}
        className="w-full bg-black text-white rounded-xl py-3 text-sm font-semibold hover:bg-gray-800"
      >
        RSVP — I&apos;m coming
      </button>
      <button
        onClick={() => setMode("forward")}
        className="w-full bg-white border border-gray-300 rounded-xl py-3 text-sm font-semibold hover:border-gray-500"
      >
        Invite a friend instead
      </button>
    </div>
  );
}
