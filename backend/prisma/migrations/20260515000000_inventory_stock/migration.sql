-- AlterTable
ALTER TABLE "Product"
ADD COLUMN "stock" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Order"
ADD COLUMN "items" JSONB;
