/*
  Warnings:

  - A unique constraint covering the columns `[fk_user_id]` on the table `admin_user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "admin_user_fk_user_id_key" ON "admin_user"("fk_user_id");
