import { v2 as cloudinary } from "cloudinary";

import { env } from "../utils/env";
import { AppError } from "../utils/app-error";

let configured = false;

function ensureCloudinaryConfigured(): void {
  if (configured) {
    return;
  }

  if (
    !env.CLOUDINARY_CLOUD_NAME ||
    !env.CLOUDINARY_API_KEY ||
    !env.CLOUDINARY_API_SECRET
  ) {
    throw new AppError(
      "Cloudinary credentials are not configured.",
      "CLOUDINARY_CONFIG_MISSING",
      500,
    );
  }

  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  configured = true;
}

export function getUploadSignature(folder: string) {
  ensureCloudinaryConfigured();
  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { folder, timestamp },
    env.CLOUDINARY_API_SECRET!,
  );

  return {
    signature,
    timestamp,
    folder,
    cloudName: env.CLOUDINARY_CLOUD_NAME!,
    apiKey: env.CLOUDINARY_API_KEY!,
  };
}
