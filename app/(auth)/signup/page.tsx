"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ShapeDecor from "@/components/ShapeDecor";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: name || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Sign up failed");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--cream)", padding: "2rem" }}
    >
      <ShapeDecor variant="auth" />

      <div className="relative w-full" style={{ maxWidth: "26rem", zIndex: 1 }}>
        {/* Wordmark */}
        <div className="text-center mb-10">
          <h1
            className="font-display"
            style={{
              fontSize: "2rem",
              fontWeight: 400,
              fontStyle: "italic",
              color: "var(--ink)",
              letterSpacing: "0.01em",
            }}
          >
            Shadow Tixs
          </h1>
          <p
            className="mt-2 text-eyebrow"
            style={{ color: "var(--ink-faint)" }}
          >
            Event intelligence platform
          </p>
        </div>

        {/* Form card */}
        <div className="card" style={{ padding: "2.5rem" }}>
          <h2
            className="font-display mb-8"
            style={{ fontSize: "1.375rem", fontWeight: 400, color: "var(--ink)" }}
          >
            Create account
          </h2>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label className="field-label">
                Name{" "}
                <span style={{ textTransform: "none", letterSpacing: 0, fontSize: "0.75rem", color: "var(--ink-faint)" }}>
                  (optional)
                </span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="field-input"
                autoComplete="name"
              />
            </div>

            <div>
              <label className="field-label">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field-input"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="field-label">
                Password{" "}
                <span style={{ textTransform: "none", letterSpacing: 0, fontSize: "0.75rem", color: "var(--ink-faint)" }}>
                  (min. 8 chars)
                </span>
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field-input"
                autoComplete="new-password"
              />
            </div>

            {error && <p className="msg-error">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "0.5rem", padding: "0.75rem 1.5rem" }}
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p
            className="text-center mt-6"
            style={{ fontSize: "0.8125rem", color: "var(--ink-muted)" }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
