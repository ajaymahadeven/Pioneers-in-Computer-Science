"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { updatePioneer } from "@/app/admin/_actions/pioneer";
import { ERA_LABELS } from "@/lib/utils";

const ERAS = Object.keys(ERA_LABELS);
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

interface PioneerData {
  id: number;
  name: string;
  knownFor: string | null;
  intro: string;
  longBio: string | null;
  achievement: string;
  birthYear: number | null;
  deathYear: number | null;
  birthCity: string | null;
  birthCountry: string;
  nationality: string | null;
  century: number;
  contributionYear: number;
  era: string;
  gender: string;
  latitude: number | null;
  longitude: number | null;
  imageLocal: string | null;
  classifications: { classification: { name: string } }[];
  funFacts: { fact: string }[];
  awards: { name: string; year: number | null }[];
  institutions: { name: string; role: string | null; years: string | null }[];
  notableWorks: {
    title: string;
    type: string;
    year: number | null;
  }[];
}

export function EditPioneerForm({ pioneer }: { pioneer: PioneerData }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(pioneer.imageLocal);
  const [imagePreview, setImagePreview] = useState<string | null>(
    pioneer.imageLocal,
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [funFacts, setFunFacts] = useState<string[]>(
    pioneer.funFacts.map((f) => f.fact).length > 0
      ? pioneer.funFacts.map((f) => f.fact)
      : [""],
  );
  const [classifications, setClassifications] = useState<string[]>(
    pioneer.classifications.map((c) => c.classification.name).length > 0
      ? pioneer.classifications.map((c) => c.classification.name)
      : [""],
  );
  const [awards, setAwards] = useState<{ name: string; year: string }[]>(
    pioneer.awards.length > 0
      ? pioneer.awards.map((a) => ({
          name: a.name,
          year: a.year?.toString() ?? "",
        }))
      : [{ name: "", year: "" }],
  );
  const [institutions, setInstitutions] = useState<
    { name: string; role: string; years: string }[]
  >(
    pioneer.institutions.length > 0
      ? pioneer.institutions.map((i) => ({
          name: i.name,
          role: i.role ?? "",
          years: i.years ?? "",
        }))
      : [{ name: "", role: "", years: "" }],
  );
  const [notableWorks, setNotableWorks] = useState<
    { title: string; type: string; year: string }[]
  >(
    pioneer.notableWorks.length > 0
      ? pioneer.notableWorks.map((w) => ({
          title: w.title,
          type: w.type,
          year: w.year?.toString() ?? "",
        }))
      : [{ title: "", type: "Other", year: "" }],
  );

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) {
        throw new Error(json.error ?? "Upload failed");
      }
      setImageUrl(json.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
      setImagePreview(pioneer.imageLocal);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const fd = new FormData(formRef.current!);
    if (imageUrl) fd.set("imageLocal", imageUrl);

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
      await updatePioneer(pioneer.id, fd);
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
              defaultValue={pioneer.name}
              className={inputCls}
              placeholder="Alan Turing"
            />
          </Field>
          <Field label="Known For">
            <input
              name="knownFor"
              defaultValue={pioneer.knownFor ?? ""}
              className={inputCls}
              placeholder="Turing machine, AI foundations"
            />
          </Field>
          <Field label="Era" required>
            <select
              name="era"
              required
              defaultValue={pioneer.era}
              className={selectCls}
            >
              <option value="" disabled>
                Select era…
              </option>
              {ERAS.map((e) => (
                <option key={e} value={e}>
                  {ERA_LABELS[e] ?? e}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Gender" required>
            <select
              name="gender"
              required
              defaultValue={pioneer.gender}
              className={selectCls}
            >
              <option value="" disabled>
                Select gender…
              </option>
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
              defaultValue={pioneer.birthCountry}
              className={inputCls}
              placeholder="United Kingdom"
            />
          </Field>
          <Field label="Birth City">
            <input
              name="birthCity"
              defaultValue={pioneer.birthCity ?? ""}
              className={inputCls}
              placeholder="London"
            />
          </Field>
          <Field label="Nationality">
            <input
              name="nationality"
              defaultValue={pioneer.nationality ?? ""}
              className={inputCls}
              placeholder="British"
            />
          </Field>
          <Field label="Contribution Year" required>
            <input
              name="contributionYear"
              type="number"
              required
              defaultValue={pioneer.contributionYear}
              className={inputCls}
              placeholder="1936"
            />
          </Field>
          <Field label="Century" required>
            <input
              name="century"
              type="number"
              required
              defaultValue={pioneer.century}
              className={inputCls}
              placeholder="20"
            />
          </Field>
          <Field label="Birth Year">
            <input
              name="birthYear"
              type="number"
              defaultValue={pioneer.birthYear ?? ""}
              className={inputCls}
              placeholder="1912"
            />
          </Field>
          <Field label="Death Year">
            <input
              name="deathYear"
              type="number"
              defaultValue={pioneer.deathYear ?? ""}
              className={inputCls}
              placeholder="1954"
            />
          </Field>
        </div>
      </section>

      {/* Portrait Image */}
      <section className="border-border bg-card rounded-lg border p-6">
        <h2 className="text-muted-foreground mb-5 text-xs font-medium tracking-widest uppercase">
          Portrait Image
        </h2>
        <div className="flex items-start gap-6">
          <div className="border-border bg-muted relative h-32 w-24 flex-none overflow-hidden rounded-lg border">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-cover object-top"
                sizes="96px"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-muted-foreground/40 text-[10px] tracking-widest uppercase">
                  No image
                </span>
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="text-[10px] text-white">Uploading…</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="border-border bg-muted text-foreground hover:bg-accent inline-flex cursor-pointer items-center gap-2 rounded border px-4 py-2 text-sm font-medium transition-colors">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={handleFileChange}
                disabled={uploading}
              />
              {uploading ? "Uploading…" : "Change image"}
            </label>
            <p className="text-muted-foreground/60 text-[11px]">
              JPEG, PNG, WebP or GIF · max 5 MB
            </p>
            {uploadError && (
              <p className="text-destructive text-[11px]">{uploadError}</p>
            )}
            {imageUrl && !uploading && (
              <p className="text-[11px] text-green-600 dark:text-green-400">
                ✓ Image set
              </p>
            )}
          </div>
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
              defaultValue={pioneer.intro}
              className={textareaCls}
              placeholder="Short 1-2 sentence introduction"
            />
          </Field>
          <Field label="Achievement" required>
            <textarea
              name="achievement"
              required
              defaultValue={pioneer.achievement}
              className={textareaCls}
              placeholder="Main technical achievement"
            />
          </Field>
          <Field label="Long Bio">
            <textarea
              name="longBio"
              defaultValue={pioneer.longBio ?? ""}
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
              defaultValue={pioneer.latitude ?? ""}
              className={inputCls}
              placeholder="51.5074"
            />
          </Field>
          <Field label="Longitude">
            <input
              name="longitude"
              type="number"
              step="any"
              defaultValue={pioneer.longitude ?? ""}
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
          {pending ? "Saving…" : "Save Changes"}
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
