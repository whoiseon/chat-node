/*
  Warnings:

  - You are about to drop the column `value` on the `system_setting` table. All the data in the column will be lost.
  - Added the required column `settingValue` to the `system_setting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admin_user" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "node_con_tag" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "system_setting" DROP COLUMN "value",
ADD COLUMN     "settingValue" TEXT NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "updated_at" DROP NOT NULL;
