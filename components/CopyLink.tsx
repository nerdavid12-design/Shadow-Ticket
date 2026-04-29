"use client";

import { useState } from "react";

export default function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2">
      <input
        readOnly
        value={url}
        className="field-input font-mono truncate"
        style={{ flex: 1, fontSize: "0.8125rem" }}
      />
      <button
        onClick={copy}
        className="btn btn-primary shrink-0"
        style={{ minWidth: "5rem" }}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
