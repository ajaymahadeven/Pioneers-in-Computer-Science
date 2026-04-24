"use client";

import { useState } from "react";
import { Link2 } from "lucide-react";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleClick}
      className="border-border bg-muted text-muted-foreground hover:bg-accent hover:text-foreground inline-flex items-center gap-1.5 rounded border px-3 py-1.5 font-mono text-xs transition-colors"
    >
      <Link2 className="h-3 w-3" />
      {copied ? "Copied!" : "Share"}
    </button>
  );
}
