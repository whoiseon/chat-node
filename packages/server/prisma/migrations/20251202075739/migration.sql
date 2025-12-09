-- CreateTable
CREATE TABLE "server_setting" (
    "id" TEXT NOT NULL,
    "fk_server_id" TEXT NOT NULL,
    "approval_required" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "server_setting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "server_setting_fk_server_id_idx" ON "server_setting"("fk_server_id");

-- CreateIndex
CREATE UNIQUE INDEX "server_setting_fk_server_id_key" ON "server_setting"("fk_server_id");

-- CreateIndex
CREATE INDEX "server_slug_idx" ON "server"("slug");

-- AddForeignKey
ALTER TABLE "server_setting" ADD CONSTRAINT "server_setting_fk_server_id_fkey" FOREIGN KEY ("fk_server_id") REFERENCES "server"("id") ON DELETE CASCADE ON UPDATE CASCADE;
