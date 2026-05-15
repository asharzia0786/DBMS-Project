-- Bring the Inquiry table in line with the current Prisma model.
-- The initial migration used "name" and did not include "email".
ALTER TABLE "Inquiry"
  RENAME COLUMN "name" TO "fullName";

ALTER TABLE "Inquiry"
  ADD COLUMN "email" TEXT NOT NULL DEFAULT 'unknown@example.com';

UPDATE "Inquiry"
SET "message" = 'Consultation requested from website.'
WHERE "message" IS NULL OR btrim("message") = '';

ALTER TABLE "Inquiry"
  ALTER COLUMN "message" SET NOT NULL;

ALTER TABLE "Inquiry"
  ALTER COLUMN "email" DROP DEFAULT;
