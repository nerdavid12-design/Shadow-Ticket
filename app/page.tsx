import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Link from "next/link";

export default async function Home() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <div
      style={{
        backgroundColor: "var(--cream)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorations */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
        <svg
          style={{ position: "absolute", top: "-80px", right: "-80px" }}
          width="640" height="640" viewBox="0 0 640 640" fill="none"
        >
          <circle cx="320" cy="320" r="300" stroke="#D4611A" strokeWidth="1" opacity="0.10" />
          <circle cx="320" cy="320" r="230" stroke="#D4611A" strokeWidth="0.5" opacity="0.05" />
        </svg>
        <svg
          style={{ position: "absolute", bottom: "-120px", left: "-120px" }}
          width="480" height="480" viewBox="0 0 480 480" fill="none"
        >
          <circle cx="0" cy="480" r="400" stroke="#EDE0CC" strokeWidth="0.5" opacity="0.06" />
        </svg>
        <svg
          style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
          width="1" height="480" viewBox="0 0 1 480"
        >
          <line x1="0.5" y1="0" x2="0.5" y2="480" stroke="#D4611A" strokeWidth="0.75" opacity="0.08" />
        </svg>
      </div>

      {/* Nav */}
      <header
        style={{
          position: "relative",
          zIndex: 1,
          padding: "1.75rem 2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <span
          className="font-display"
          style={{
            fontSize: "1.125rem",
            fontStyle: "italic",
            fontWeight: 400,
            color: "var(--ink)",
            letterSpacing: "0.01em",
          }}
        >
          Shadow Ticket
        </span>
        <nav style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <Link
            href="/login"
            className="btn btn-ghost"
            style={{ fontSize: "0.8125rem", letterSpacing: "0.04em" }}
          >
            Sign in
          </Link>
          <Link href="/signup" className="btn btn-primary" style={{ borderRadius: "2px" }}>
            Get started
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "6rem 2rem 4rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <p className="text-eyebrow" style={{ marginBottom: "1.5rem" }}>
          Event Intelligence Platform
        </p>

        <h1
          className="font-display"
          style={{
            fontSize: "clamp(3rem, 8vw, 6rem)",
            fontWeight: 400,
            fontStyle: "italic",
            color: "var(--ink)",
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
            marginBottom: "1.75rem",
            maxWidth: "18ch",
          }}
        >
          Every ticket casts a shadow.
        </h1>

        <p
          style={{
            fontSize: "1.0625rem",
            color: "var(--ink-mid)",
            lineHeight: 1.65,
            maxWidth: "40ch",
            marginBottom: "3rem",
          }}
        >
          Shadow Ticket turns invite-only gatherings into fully tracked events — from the
          first RSVP to the last scan at the door.
        </p>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Link
            href="/signup"
            className="btn btn-primary"
            style={{ padding: "0.875rem 2rem", fontSize: "0.875rem", borderRadius: "2px" }}
          >
            Create an account
          </Link>
          <Link
            href="/login"
            className="btn btn-secondary"
            style={{ padding: "0.875rem 2rem", fontSize: "0.875rem", borderRadius: "2px" }}
          >
            Sign in
          </Link>
        </div>

        {/* Decorative rule */}
        <div
          aria-hidden="true"
          style={{
            width: "1px",
            height: "4rem",
            background: "var(--border-mid)",
            margin: "4rem auto 0",
          }}
        />
      </main>

      {/* Features */}
      <section
        style={{
          position: "relative",
          zIndex: 1,
          padding: "2rem 2.5rem 6rem",
          maxWidth: "960px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {[
            {
              eyebrow: "01",
              title: "Create events",
              body: "Define your event, set the date, and configure every detail before a single invite goes out.",
            },
            {
              eyebrow: "02",
              title: "Track invites",
              body: "Send personalised QR codes to guests and watch RSVPs roll in — or not — in real time.",
            },
            {
              eyebrow: "03",
              title: "Gate the door",
              body: "Scan tickets at entry. Every check-in is logged instantly so you always know who made it.",
            },
          ].map((f) => (
            <div key={f.eyebrow} className="card" style={{ padding: "1.75rem" }}>
              <p
                className="text-eyebrow"
                style={{ color: "var(--accent)", marginBottom: "0.875rem" }}
              >
                {f.eyebrow}
              </p>
              <h2
                className="font-display"
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: "var(--ink)",
                  marginBottom: "0.625rem",
                }}
              >
                {f.title}
              </h2>
              <p style={{ fontSize: "0.875rem", color: "var(--ink-muted)", lineHeight: 1.6 }}>
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          position: "relative",
          zIndex: 1,
          borderTop: "1px solid var(--border)",
          padding: "1.5rem 2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <span
          className="font-display"
          style={{ fontSize: "0.875rem", fontStyle: "italic", color: "var(--ink-faint)" }}
        >
          Shadow Ticket
        </span>
        <p
          style={{ fontSize: "0.75rem", color: "var(--ink-faint)", letterSpacing: "0.04em" }}
        >
          Invite-only event intelligence
        </p>
      </footer>
    </div>
  );
}
