-- CreateTable
CREATE TABLE "server_invitation_code" (
    "id" TEXT NOT NULL,
    "fk_server_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expires_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "server_invitation_code_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "server_invitation_code_code_key" ON "server_invitation_code"("code");

-- CreateIndex
CREATE INDEX "server_invitation_code_fk_server_id_idx" ON "server_invitation_code"("fk_server_id");

-- CreateIndex
CREATE INDEX "server_invitation_code_code_idx" ON "server_invitation_code"("code");

-- CreateIndex
CREATE INDEX "server_invitation_code_expires_at_idx" ON "server_invitation_code"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "server_invitation_code_fk_server_id_code_key" ON "server_invitation_code"("fk_server_id", "code");

-- AddForeignKey
ALTER TABLE "server_invitation_code" ADD CONSTRAINT "server_invitation_code_fk_server_id_fkey" FOREIGN KEY ("fk_server_id") REFERENCES "server"("id") ON DELETE CASCADE ON UPDATE CASCADE;
