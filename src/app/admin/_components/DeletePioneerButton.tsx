"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deletePioneer } from "@/app/admin/_actions/pioneer";

export function DeletePioneerButton({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    setPending(true);
    await deletePioneer(id);
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={pending}
          className="border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded border px-2 py-1 text-[10px] font-medium transition-colors disabled:opacity-50"
        >
          {pending ? "…" : "Yes"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="border-border text-muted-foreground hover:bg-accent rounded border px-2 py-1 text-[10px] font-medium transition-colors"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      title={`Delete ${name}`}
      className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded p-1.5 transition-colors"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
