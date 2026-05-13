ALTER TABLE "Order" ADD COLUMN "paymentMethod" TEXT;
ALTER TABLE "Order" ADD COLUMN "safepayTrackerToken" TEXT;
ALTER TABLE "Order" ADD COLUMN "paidAt" TIMESTAMP(3);

CREATE INDEX "Order_safepayTrackerToken_idx" ON "Order"("safepayTrackerToken");
