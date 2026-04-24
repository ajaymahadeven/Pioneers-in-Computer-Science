import { redirect } from "next/navigation";
import { db } from "@/server/db";

export const dynamic = "force-dynamic";

export default async function RandomPage() {
  const count = await db.pioneer.count();
  const skip = Math.floor(Math.random() * count);
  const pioneer = await db.pioneer.findFirst({
    skip,
    select: { slug: true },
  });

  redirect(pioneer ? `/pioneer/${pioneer.slug}` : "/explore");
}
