import Safepay from "@sfpy/node-core";

import { env } from "../utils/env";
import { AppError } from "../utils/app-error";

type SafepayClient = InstanceType<typeof Safepay>;

let client: SafepayClient | null = null;

export function getSafepayClient(): SafepayClient {
  if (client) {
    return client;
  }

  if (!env.SAFEPAY_SECRET_KEY || !env.SAFEPAY_MERCHANT_API_KEY) {
    throw new AppError(
      "SafePay credentials are not configured.",
      "SAFEPAY_CONFIG_MISSING",
      500,
    );
  }

  client = new Safepay(env.SAFEPAY_SECRET_KEY, {
    authType: "secret",
    host:
      env.SAFEPAY_ENVIRONMENT === "production"
        ? "https://api.getsafepay.com"
        : "https://sandbox.api.getsafepay.com",
  });

  return client;
}

export function getSafepayMerchantApiKey(): string {
  if (!env.SAFEPAY_MERCHANT_API_KEY) {
    throw new AppError(
      "SAFEPAY_MERCHANT_API_KEY is not configured.",
      "SAFEPAY_CONFIG_MISSING",
      500,
    );
  }

  return env.SAFEPAY_MERCHANT_API_KEY;
}
