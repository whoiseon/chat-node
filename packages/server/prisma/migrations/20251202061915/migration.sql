/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `server` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "server" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "server_slug_key" ON "server"("slug");
