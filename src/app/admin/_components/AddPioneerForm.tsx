"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createPioneer } from "@/app/admin/_actions/pioneer";

const ERAS = [
  "AncientMedieval",
  "Mechanical",
  "EarlyElectronic",
  "ColdWar",
  "PersonalComputing",
  "InternetAge",
  "AIEra",
] as const;
const GENDERS = ["Male", "Female", "Unknown"] as const;
const WORK_TYPES = [
  "Paper",
  "Book",
  "System",
  "Language",
  "Algorithm",
  "Other",
] as const;

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-muted-foreground text-[11px] font-medium tracking-widest uppercase">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none";
const selectCls = inputCls;
const textareaCls = `${inputCls} resize-y min-h-[80px]`;

export function AddPioneerForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamic list states
  const [funFacts, setFunFacts] = useState<string[]>([""]);
  const [classifications, setClassifications] = useState<string[]>([""]);
  const [awards, setAwards] = useState<{ name: string; year: string }[]>([
    { name: "", year: "" },
  ]);
  const [institutions, setInstitutions] = useState<
    { name: string; role: string; years: string }[]
  >([{ name: "", role: "", years: "" }]);
  const [notableWorks, setNotableWorks] = useState<
    { title: string; type: string; year: string }[]
  >([{ title: "", type: "Other", year: "" }]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const fd = new FormData(formRef.current!);

    // Append dynamic lists
    funFacts.filter(Boolean).forEach((f) => fd.append("funFacts", f));
    classifications
      .filter(Boolean)
      .forEach((c) => fd.append("classifications", c));
    fd.set("awards", JSON.stringify(awards.filter((a) => a.name)));
    fd.set("institutions", JSON.stringify(institutions.filter((i) => i.name)));
    fd.set(
      "notableWorks",
      JSON.stringify(
        notableWorks
          .filter((w) => w.title)
          .map((w) => ({ ...w, type: w.type || "Other" })),
      ),
    );

    try {
      await createPioneer(fd);
      router.push("/admin/dashboard/pioneers");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setPending(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      {/* Core */}
      <section className="border-border bg-card rounded-lg border p-6">
        <h2 className="text-muted-foreground mb-5 text-xs font-medium tracking-widest uppercase">
          Core Details
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" required>
            <input
              name="name"
              required
              className={inputCls}
              placeholder="Alan Turing"
            />
          </Field>
          <Field label="Known For">
            <input
              name="knownFor"
              className={inputCls}
              placeholder="Turing machine, AI foundations"
            />
          </Field>
          <Field label="Era" required>
            <select name="era" required className={selectCls}>
              {ERAS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Gender" required>
            <select name="gender" required className={selectCls}>
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Birth Country" required>
            <input
              name="birthCountry"
              required
              className={inputCls}
              placeholder="United Kingdom"
            />
          </Field>
          <Field label="Birth City">
            <input name="birthCity" className={inputCls} placeholder="London" />
          </Field>
          <Field label="Nationality">
            <input
              name="nationality"
              className={inputCls}
              placeholder="British"
            />
          </Field>
          <Field label="Contribution Year" required>
            <input
              name="contributionYear"
              type="number"
              required
              className={inputCls}
              placeholder="1936"
            />
          </Field>
          <Field label="Century" required>
            <input
              name="century"
              type="number"
              required
              className={inputCls}
              placeholder="20"
            />
          </Field>
          <Field label="Birth Year">
            <input
              name="birthYear"
              type="number"
              className={inputCls}
              placeholder="1912"
            />
          </Field>
          <Field label="Death Year">
            <input
              name="deathYear"
              type="number"
              className={inputCls}
              placeholder="1954"
            />
          </Field>
        </div>
      </section>

      {/* Biography */}
      <section className="border-border bg-card rounded-lg border p-6">
        <h2 className="text-muted-foreground mb-5 text-xs font-medium tracking-widest uppercase">
          Biography
        </h2>
        <div className="grid gap-4">
          <Field label="Intro" required>
            <textarea
              name="intro"
              required
              className={textareaCls}
              placeholder="Short 1-2 sentence introduction"
            />
          </Field>
          <Field label="Achievement" required>
            <textarea
              name="achievement"
              required
              className={textareaCls}
              placeholder="Main technical achievement"
            />
          </Field>
          <Field label="Long Bio">
            <textarea
              name="longBio"
              className={`${textareaCls} min-h-[140px]`}
              placeholder="Extended biography..."
            />
          </Field>
        </div>
      </section>

      {/* Location */}
      <section className="border-border bg-card rounded-lg border p-6">
        <h2 className="text-muted-foreground mb-5 text-xs font-medium tracking-widest uppercase">
          Location
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Latitude">
            <input
              name="latitude"
              type="number"
              step="any"
              className={inputCls}
              placeholder="51.5074"
            />
          </Field>
          <Field label="Longitude">
            <input
              name="longitude"
              type="number"
              step="any"
              className={inputCls}
              placeholder="-0.1278"
            />
          </Field>
        </div>
      </section>

      {/* Classifications */}
      <section className="border-border bg-card rounded-lg border p-6">
        <h2 className="text-muted-foreground mb-5 text-xs font-medium tracking-widest uppercase">
          Classifications
        </h2>
        <div className="space-y-2">
          {classifications.map((c, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={c}
                onChange={(e) => {
                  const next = [...classifications];
                  next[i] = e.target.value;
                  setClassifications(next);
                }}
                className={`${inputCls} flex-1`}
                placeholder="e.g. Artificial Intelligence"
              />
              <button
                type="button"
                onClick={() =>
                  setClassifications(classifications.filter((_, j) => j !== i))
                }
                className="border-border text-muted-foreground hover:bg-accent rounded border px-2 text-xs"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setClassifications([...classifications, ""])}
            className="text-muted-foreground hover:text-foreground text-xs underline-offset-2 hover:underline"
          >
            + Add classification
          </button>
        </div>
      </section>

      {/* Fun Facts */}
      <section className="border-border bg-card rounded-lg border p-6">
        <h2 className="text-muted-foreground mb-5 text-xs font-medium tracking-widest uppercase">
          Fun Facts
        </h2>
        <div className="space-y-2">
          {funFacts.map((f, i) => (
            <div key={i} className="flex gap-2">
              <textarea
                value={f}
                onChange={(e) => {
                  const next = [...funFacts];
                  next[i] = e.target.value;
                  setFunFacts(next);
                }}
                className={`${textareaCls} flex-1`}
                placeholder="Interesting fact..."
                rows={2}
              />
              <button
                type="button"
                onClick={() => setFunFacts(funFacts.filter((_, j) => j !== i))}
                className="border-border text-muted-foreground hover:bg-accent self-start rounded border px-2 py-1 text-xs"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFunFacts([...funFacts, ""])}
            className="text-muted-foreground hover:text-foreground text-xs underline-offset-2 hover:underline"
          >
            + Add fact
          </button>
        </div>
      </section>

      {/* Awards */}
      <section className="border-border bg-card rounded-lg border p-6">
        <h2 className="text-muted-foreground mb-5 text-xs font-medium tracking-widest uppercase">
          Awards
        </h2>
        <div className="space-y-2">
          {awards.map((a, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={a.name}
                onChange={(e) => {
                  const n = [...awards];
                  n[i] = { ...(n[i] ?? {}), name: e.target.value };
                  setAwards(n);
                }}
                className={`${inputCls} flex-1`}
                placeholder="Turing Award"
              />
              <input
                value={a.year}
                type="number"
                onChange={(e) => {
                  const n = [...awards];
                  n[i] = { ...(n[i] ?? {}), year: e.target.value };
                  setAwards(n);
                }}
                className={`${inputCls} w-24`}
                placeholder="1966"
              />
              <button
                type="button"
                onClick={() => setAwards(awards.filter((_, j) => j !== i))}
                className="border-border text-muted-foreground hover:bg-accent rounded border px-2 text-xs"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setAwards([...awards, { name: "", year: "" }])}
            className="text-muted-foreground hover:text-foreground text-xs underline-offset-2 hover:underline"
          >
            + Add award
          </button>
        </div>
      </section>

      {/* Notable Works */}
      <section className="border-border bg-card rounded-lg border p-6">
        <h2 className="text-muted-foreground mb-5 text-xs font-medium tracking-widest uppercase">
          Notable Works
        </h2>
        <div className="space-y-2">
          {notableWorks.map((w, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={w.title}
                onChange={(e) => {
                  const n = [...notableWorks];
                  n[i] = { ...(n[i] ?? {}), title: e.target.value };
                  setNotableWorks(n);
                }}
                className={`${inputCls} flex-1`}
                placeholder="On Computable Numbers"
              />
              <select
                value={w.type}
                onChange={(e) => {
                  const n = [...notableWorks];
                  n[i] = { ...(n[i] ?? {}), type: e.target.value };
                  setNotableWorks(n);
                }}
                className={`${selectCls} w-32`}
              >
                {WORK_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <input
                value={w.year}
                type="number"
                onChange={(e) => {
                  const n = [...notableWorks];
                  n[i] = { ...(n[i] ?? {}), year: e.target.value };
                  setNotableWorks(n);
                }}
                className={`${inputCls} w-24`}
                placeholder="1936"
              />
              <button
                type="button"
                onClick={() =>
                  setNotableWorks(notableWorks.filter((_, j) => j !== i))
                }
                className="border-border text-muted-foreground hover:bg-accent rounded border px-2 text-xs"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setNotableWorks([
                ...notableWorks,
                { title: "", type: "Other", year: "" },
              ])
            }
            className="text-muted-foreground hover:text-foreground text-xs underline-offset-2 hover:underline"
          >
            + Add work
          </button>
        </div>
      </section>

      {/* Institutions */}
      <section className="border-border bg-card rounded-lg border p-6">
        <h2 className="text-muted-foreground mb-5 text-xs font-medium tracking-widest uppercase">
          Institutions
        </h2>
        <div className="space-y-2">
          {institutions.map((inst, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={inst.name}
                onChange={(e) => {
                  const n = [...institutions];
                  n[i] = { ...(n[i] ?? {}), name: e.target.value };
                  setInstitutions(n);
                }}
                className={`${inputCls} flex-1`}
                placeholder="MIT"
              />
              <input
                value={inst.role}
                onChange={(e) => {
                  const n = [...institutions];
                  n[i] = { ...(n[i] ?? {}), role: e.target.value };
                  setInstitutions(n);
                }}
                className={`${inputCls} w-36`}
                placeholder="Professor"
              />
              <input
                value={inst.years}
                onChange={(e) => {
                  const n = [...institutions];
                  n[i] = { ...(n[i] ?? {}), years: e.target.value };
                  setInstitutions(n);
                }}
                className={`${inputCls} w-28`}
                placeholder="1939–1945"
              />
              <button
                type="button"
                onClick={() =>
                  setInstitutions(institutions.filter((_, j) => j !== i))
                }
                className="border-border text-muted-foreground hover:bg-accent rounded border px-2 text-xs"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setInstitutions([
                ...institutions,
                { name: "", role: "", years: "" },
              ])
            }
            className="text-muted-foreground hover:text-foreground text-xs underline-offset-2 hover:underline"
          >
            + Add institution
          </button>
        </div>
      </section>

      {error && (
        <div className="border-destructive/30 bg-destructive/8 text-destructive rounded border px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3 pb-4">
        <button
          type="submit"
          disabled={pending}
          className="border-border bg-foreground text-background rounded border px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save Pioneer"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border-border text-muted-foreground hover:bg-accent hover:text-foreground rounded border px-5 py-2.5 text-sm font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
