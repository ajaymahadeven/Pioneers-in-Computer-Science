import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminSession } from "@/app/_lib/admin-session";
import { ADMIN_COOKIE_NAME } from "@/app/_lib/admin-session";
import { uploadBlob } from "@/lib/azure-blob";
import { slugify } from "@/lib/utils";

export const runtime = "nodejs";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token || !(await verifyAdminSession(token))) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP, or GIF allowed" },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File exceeds 5 MB limit" },
      { status: 400 },
    );
  }

  const ext = file.type.split("/")[1] ?? "jpg";
  const baseName = slugify(file.name.replace(/\.[^.]+$/, ""));
  const blobName = `${baseName}-${Date.now()}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await uploadBlob(blobName, buffer, file.type);

  return NextResponse.json({ url });
}
