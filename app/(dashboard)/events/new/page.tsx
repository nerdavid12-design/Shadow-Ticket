"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewEventPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    date: "",
    location: "",
    capacity: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        date: form.date,
        location: form.location,
        capacity: form.capacity ? parseInt(form.capacity) : undefined,
        description: form.description || undefined,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to create event");
    } else {
      router.push(`/events/${data.event.id}`);
    }
  }

  return (
    <div style={{ maxWidth: "40rem" }}>
      <Link href="/dashboard" className="back-link" style={{ display: "inline-block", marginBottom: "2.5rem" }}>
        ← All events
      </Link>

      <div style={{ marginBottom: "2.5rem" }}>
        <p className="text-eyebrow" style={{ marginBottom: "0.5rem" }}>New event</p>
        <h1
          className="font-display"
          style={{ fontSize: "2.25rem", fontWeight: 400, fontStyle: "italic", color: "var(--ink)" }}
        >
          Create event
        </h1>
      </div>

      <div className="card" style={{ padding: "2.5rem" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label className="field-label">Event name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="field-input"
              placeholder="Opening night, Annual gala…"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label className="field-label">Date & time</label>
              <input
                type="datetime-local"
                required
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                className="field-input"
              />
            </div>
            <div>
              <label className="field-label">
                Capacity{" "}
                <span style={{ textTransform: "none", letterSpacing: 0, fontSize: "0.75rem", color: "var(--ink-faint)" }}>
                  optional
                </span>
              </label>
              <input
                type="number"
                min="1"
                value={form.capacity}
                onChange={(e) => set("capacity", e.target.value)}
                className="field-input"
                placeholder="250"
              />
            </div>
          </div>

          <div>
            <label className="field-label">Location</label>
            <input
              type="text"
              required
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              className="field-input"
              placeholder="Venue name, city…"
            />
          </div>

          <div>
            <label className="field-label">
              Description{" "}
              <span style={{ textTransform: "none", letterSpacing: 0, fontSize: "0.75rem", color: "var(--ink-faint)" }}>
                optional
              </span>
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="field-input"
              style={{ resize: "vertical" }}
              placeholder="A brief description of the event…"
            />
          </div>

          {error && <p className="msg-error">{error}</p>}

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", paddingTop: "0.5rem" }}>
            <Link href="/dashboard" className="btn btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ padding: "0.625rem 2rem" }}
            >
              {loading ? "Creating…" : "Create event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
