/*
  Warnings:

  - You are about to drop the column `display_name` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."idx_display_name";

-- DropIndex
DROP INDEX "public"."user_display_name_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "display_name";
