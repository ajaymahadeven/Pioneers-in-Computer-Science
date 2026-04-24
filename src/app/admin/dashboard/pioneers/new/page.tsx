import { AddPioneerForm } from "@/app/admin/_components/AddPioneerForm";

export default function NewPioneerPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <p className="text-muted-foreground mb-1 text-[10px] font-medium tracking-widest uppercase">
          Pioneers
        </p>
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">
          Add Pioneer
        </h1>
      </div>
      <AddPioneerForm />
    </div>
  );
}
