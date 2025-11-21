/*
  Warnings:

  - You are about to drop the column `disabled` on the `auth_token` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `auth_token` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "auth_token" DROP COLUMN "disabled",
DROP COLUMN "updated_at",
ADD COLUMN     "blocked" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "auth_token_fk_user_id_idx" ON "auth_token"("fk_user_id");
