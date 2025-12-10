/*
  Warnings:

  - You are about to drop the column `approval_required` on the `server_setting` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ServerJoinType" AS ENUM ('DIRECT', 'APPROVED', 'PRIVATE');

-- AlterTable
ALTER TABLE "server" ADD COLUMN     "deleted_at" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "server_setting" DROP COLUMN "approval_required",
ADD COLUMN     "join_type" "ServerJoinType" NOT NULL DEFAULT 'DIRECT';
