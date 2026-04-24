import { type NextRequest, NextResponse } from "next/server";
import { getBlobStream } from "@/lib/azure-blob";
import { Readable } from "stream";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;

  // Allow Unicode letters/digits (covers accented names like corbató), dots, hyphens, underscores
  if (
    !filename ||
    !/^[\p{L}\p{N}\-_. ]+\.(webp|jpg|jpeg|png|gif)$/iu.test(filename)
  ) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  try {
    const { stream, contentType, contentLength } =
      await getBlobStream(filename);

    if (!stream) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const webStream = Readable.toWeb(stream as Readable) as ReadableStream;

    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    };
    if (contentLength) {
      headers["Content-Length"] = String(contentLength);
    }

    return new NextResponse(webStream, { status: 200, headers });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("BlobNotFound") || message.includes("404")) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 },
    );
  }
}
