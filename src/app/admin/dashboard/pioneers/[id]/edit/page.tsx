import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getPioneerForEdit } from "@/app/admin/_actions/pioneer";
import { EditPioneerForm } from "@/app/admin/_components/EditPioneerForm";

export default async function EditPioneerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pioneer = await getPioneerForEdit(Number(id));

  if (!pioneer) notFound();

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link
          href="/admin/dashboard/pioneers"
          className="text-muted-foreground hover:text-foreground mb-3 inline-flex items-center gap-1.5 text-xs transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Back to Pioneers
        </Link>
        <p className="text-muted-foreground mb-1 text-[10px] font-medium tracking-widest uppercase">
          Edit
        </p>
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">
          {pioneer.name}
        </h1>
      </div>

      <EditPioneerForm pioneer={pioneer} />
    </div>
  );
}
