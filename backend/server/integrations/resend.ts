import { Resend } from "resend";

import { env } from "../utils/env";
import { AppError } from "../utils/app-error";

let client: Resend | null = null;

export function getResendClient(): Resend {
  if (!env.RESEND_API_KEY) {
    throw new AppError("RESEND_API_KEY is not configured.", "EMAIL_CONFIG_MISSING", 500);
  }

  if (!client) {
    client = new Resend(env.RESEND_API_KEY);
  }

  return client;
}
