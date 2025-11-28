/*
  Warnings:

  - You are about to drop the column `settingValue` on the `system_setting` table. All the data in the column will be lost.
  - Added the required column `setting_value` to the `system_setting` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `key` on the `system_setting` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SystemSettingKey" AS ENUM ('SIGNUP_BONUS_AMOUNT', 'DAILY_LOGIN_BONUS_MIN_AMOUNT');

-- AlterTable
ALTER TABLE "system_setting" DROP COLUMN "settingValue",
ADD COLUMN     "setting_value" INTEGER NOT NULL,
DROP COLUMN "key",
ADD COLUMN     "key" "SystemSettingKey" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "system_setting_key_key" ON "system_setting"("key");

-- CreateIndex
CREATE INDEX "system_setting_key_idx" ON "system_setting"("key");
