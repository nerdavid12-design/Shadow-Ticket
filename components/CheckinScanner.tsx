"use client";

import { useState, useRef, useEffect } from "react";

type Result = {
  ok: boolean;
  name?: string;
  email?: string;
  eventName?: string;
  error?: string;
};

export default function CheckinScanner() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);
  const scannerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const html5QrRef = useRef<any>(null);

  async function submitCode(c: string) {
    if (!c.trim()) return;
    setLoading(true);
    setResult(null);
    const res = await fetch("/api/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: c.trim() }),
    });
    const data = await res.json();
    setLoading(false);
    setResult(data);
    if (res.ok) setCode("");
  }

  async function startScanner() {
    if (typeof window === "undefined") return;
    const { Html5Qrcode } = await import("html5-qrcode");
    const qr = new Html5Qrcode("qr-reader");
    html5QrRef.current = qr;
    setScannerActive(true);
    try {
      await qr.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          const parts = decodedText.split("/");
          const extractedCode = parts[parts.length - 1];
          await stopScanner();
          await submitCode(extractedCode);
        },
        () => {}
      );
    } catch {
      setScannerActive(false);
    }
  }

  async function stopScanner() {
    if (html5QrRef.current) {
      await html5QrRef.current.stop().catch(() => {});
      html5QrRef.current = null;
    }
    setScannerActive(false);
  }

  useEffect(() => {
    return () => {
      stopScanner();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Manual entry */}
      <div className="card">
        <p className="text-eyebrow" style={{ marginBottom: "1rem" }}>Enter code</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitCode(code);
          }}
          style={{ display: "flex", gap: "0.625rem" }}
        >
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
            maxLength={20}
            className="field-input"
            style={{
              flex: 1,
              fontSize: "1.375rem",
              letterSpacing: "0.2em",
              textAlign: "center",
              fontFamily: "var(--font-geist-mono), monospace",
              fontWeight: 300,
            }}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ padding: "0.625rem 1.25rem" }}
          >
            {loading ? "…" : "Check in"}
          </button>
        </form>
      </div>

      {/* QR scanner */}
      <div className="card">
        <p className="text-eyebrow" style={{ marginBottom: "1rem" }}>Scan QR code</p>
        <div id="qr-reader" ref={scannerRef} style={{ width: "100%" }} />
        <button
          onClick={scannerActive ? stopScanner : startScanner}
          className="btn btn-secondary"
          style={{ width: "100%", marginTop: "0.75rem" }}
        >
          {scannerActive ? "Stop camera" : "Start camera"}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            border: `1px solid ${result.ok ? "var(--success)" : "var(--error)"}`,
            backgroundColor: result.ok ? "rgba(61, 107, 79, 0.04)" : "rgba(122, 48, 48, 0.04)",
            borderRadius: "3px",
          }}
        >
          {result.ok ? (
            <>
              <p
                className="font-display"
                style={{ fontSize: "1.75rem", fontWeight: 400, color: "var(--success)", marginBottom: "0.5rem" }}
              >
                ✓ Checked in
              </p>
              {result.name && (
                <p style={{ fontSize: "1.125rem", color: "var(--ink)", fontWeight: 500 }}>{result.name}</p>
              )}
              {result.email && (
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--ink-muted)",
                    fontFamily: "var(--font-geist-mono), monospace",
                    marginTop: "0.25rem",
                  }}
                >
                  {result.email}
                </p>
              )}
            </>
          ) : (
            <>
              <p
                className="font-display"
                style={{ fontSize: "1.375rem", fontWeight: 400, color: "var(--error)", marginBottom: "0.5rem" }}
              >
                Cannot check in
              </p>
              <p style={{ fontSize: "0.875rem", color: "var(--error)", opacity: 0.8 }}>{result.error}</p>
            </>
          )}
          <button
            onClick={() => setResult(null)}
            className="btn btn-ghost"
            style={{ marginTop: "1.25rem", fontSize: "0.8125rem" }}
          >
            Next attendee →
          </button>
        </div>
      )}
    </div>
  );
}
