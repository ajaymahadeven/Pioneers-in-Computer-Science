import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { env } from "@/env.js";

let client: BlobServiceClient | null = null;

function getBlobServiceClient() {
  if (!client) {
    const credential = new StorageSharedKeyCredential(
      env.AZURE_STORAGE_ACCOUNT_NAME,
      env.AZURE_STORAGE_ACCOUNT_KEY,
    );
    client = new BlobServiceClient(
      `https://${env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
      credential,
    );
  }
  return client;
}

export async function getBlobStream(blobName: string) {
  const containerClient = getBlobServiceClient().getContainerClient(
    env.AZURE_STORAGE_CONTAINER,
  );
  const blobClient = containerClient.getBlobClient(blobName);
  const download = await blobClient.download();
  return {
    stream: download.readableStreamBody,
    contentType: download.contentType ?? "image/webp",
    contentLength: download.contentLength,
  };
}
