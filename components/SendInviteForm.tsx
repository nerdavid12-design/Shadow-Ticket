"use client";

import { useState } from "react";

export default function SendInviteForm({ inviteCode }: { inviteCode: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch(`/api/invites/${inviteCode}/forward`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (res.ok) {
      setStatus("success");
      setMessage(`Invite sent to ${email}`);
      setEmail("");
    } else {
      setStatus("error");
      setMessage(data.error ?? "Failed to send invite");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          required
          placeholder="colleague@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="field-input"
          style={{ flex: 1 }}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn btn-primary shrink-0"
        >
          {status === "loading" ? "Sending…" : "Send invite"}
        </button>
      </form>
      {message && (
        <p
          className="mt-2"
          style={{
            fontSize: "0.8125rem",
            color: status === "success" ? "var(--success)" : "var(--error)",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
