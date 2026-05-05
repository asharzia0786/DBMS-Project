-- AlterTable
ALTER TABLE "Product"
ADD COLUMN "category" TEXT,
ADD COLUMN "material" TEXT,
ADD COLUMN "finish" TEXT,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Product_category_idx" ON "Product"("category");

-- CreateIndex
CREATE INDEX "Product_material_idx" ON "Product"("material");

-- CreateIndex
CREATE INDEX "Product_finish_idx" ON "Product"("finish");
