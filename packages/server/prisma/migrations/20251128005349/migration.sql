/*
  Warnings:

  - The primary key for the `system_setting` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `system_setting` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "system_setting" DROP CONSTRAINT "system_setting_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "system_setting_pkey" PRIMARY KEY ("id");
