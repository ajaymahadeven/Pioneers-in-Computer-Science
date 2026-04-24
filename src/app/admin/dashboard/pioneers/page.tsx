import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { db } from "@/server/db";
import { DeletePioneerButton } from "@/app/admin/_components/DeletePioneerButton";
import { blobToProxyUrl } from "@/lib/utils";
import { PioneerImage } from "@/components/avatar-placeholder/PioneerImage";
import { AvatarPlaceholder } from "@/components/avatar-placeholder/AvatarPlaceholder";

export default async function PioneersAdminPage() {
  const pioneers = await db.pioneer.findMany({
    orderBy: { contributionYear: "asc" },
    select: {
      id: true,
      name: true,
      era: true,
      birthCountry: true,
      contributionYear: true,
      imageLocal: true,
    },
  });

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-muted-foreground mb-1 text-[10px] font-medium tracking-widest uppercase">
            Manage
          </p>
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">
            Pioneers
            <span className="text-muted-foreground ml-2 font-mono text-base">
              {pioneers.length}
            </span>
          </h1>
        </div>
        <Link
          href="/admin/dashboard/pioneers/new"
          className="border-border bg-foreground text-background flex items-center gap-2 rounded border px-3 py-2 text-xs font-medium transition-colors hover:opacity-85"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          Add Pioneer
        </Link>
      </div>

      <div className="border-border bg-card rounded-lg border">
        <div className="border-border text-muted-foreground grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 border-b px-4 py-2.5 text-[10px] font-medium tracking-widest uppercase">
          <span className="w-8" />
          <span>Name</span>
          <span className="w-32">Era</span>
          <span className="w-16 text-right">Year</span>
          <span className="w-16 text-right">Action</span>
        </div>
        <div className="divide-border divide-y">
          {pioneers.map((p) => {
            const imgSrc = blobToProxyUrl(p.imageLocal);
            return (
              <div
                key={p.id}
                className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 px-4 py-3"
              >
                <div className="border-border bg-muted relative h-8 w-8 overflow-hidden rounded border">
                  {imgSrc ? (
                    <PioneerImage
                      src={imgSrc}
                      alt={p.name}
                      name={p.name}
                      sizes="32px"
                      className="object-cover object-top grayscale"
                    />
                  ) : (
                    <AvatarPlaceholder name={p.name} />
                  )}
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">
                    {p.name}
                  </p>
                  <p className="text-muted-foreground text-[11px]">
                    {p.birthCountry}
                  </p>
                </div>
                <span className="text-muted-foreground w-32 text-xs">
                  {p.era}
                </span>
                <span className="text-muted-foreground w-16 text-right font-mono text-xs">
                  {p.contributionYear}
                </span>
                <div className="w-16 text-right">
                  <DeletePioneerButton id={p.id} name={p.name} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
