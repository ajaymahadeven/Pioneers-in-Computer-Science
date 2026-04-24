"use client";

import { useState } from "react";
import { CheckCircle, Send } from "lucide-react";

const inputCls =
  "w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none";
const textareaCls = `${inputCls} resize-y min-h-[140px]`;

const SUBJECTS = [
  "Dispute pioneer information",
  "Suggest a new pioneer",
  "Image copyright concern",
  "General question",
  "Other",
];

export function ContactForm() {
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const body = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      subject: fd.get("subject") as string,
      message: fd.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(json.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  if (success) {
    return (
      <div className="border-border bg-card flex flex-col items-center gap-4 rounded-lg border px-6 py-14 text-center">
        <CheckCircle className="h-10 w-10 text-green-500" />
        <h2 className="text-foreground text-lg font-semibold">Message sent</h2>
        <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
          Thanks for reaching out. We&apos;ll get back to you as soon as
          possible.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-muted-foreground text-[11px] font-medium tracking-widest uppercase">
            Name <span className="text-destructive">*</span>
          </label>
          <input
            name="name"
            required
            maxLength={100}
            className={inputCls}
            placeholder="Ada Lovelace"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-muted-foreground text-[11px] font-medium tracking-widest uppercase">
            Email <span className="text-destructive">*</span>
          </label>
          <input
            name="email"
            type="email"
            required
            className={inputCls}
            placeholder="ada@example.com"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-muted-foreground text-[11px] font-medium tracking-widest uppercase">
          Subject <span className="text-destructive">*</span>
        </label>
        <select name="subject" required defaultValue="" className={inputCls}>
          <option value="" disabled>
            Select a subject…
          </option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-muted-foreground text-[11px] font-medium tracking-widest uppercase">
          Message <span className="text-destructive">*</span>
        </label>
        <textarea
          name="message"
          required
          minLength={20}
          maxLength={2000}
          className={textareaCls}
          placeholder="Please describe the issue or question in detail (minimum 20 characters)…"
        />
      </div>

      {error && (
        <div className="border-destructive/30 bg-destructive/8 text-destructive rounded border px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="border-border bg-foreground text-background inline-flex items-center gap-2 rounded border px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          <Send className="h-3.5 w-3.5" />
          {pending ? "Sending…" : "Send message"}
        </button>
        <p className="text-muted-foreground text-[11px]">
          Max 1 message per hour
        </p>
      </div>
    </form>
  );
}
