-- CreateEnum
CREATE TYPE "ServerMemberRole" AS ENUM ('MANAGER', 'STAFF', 'MEMBER');

-- CreateTable
CREATE TABLE "server" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "fk_manager_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "server_member" (
    "id" TEXT NOT NULL,
    "fk_server_id" TEXT NOT NULL,
    "fk_user_id" TEXT NOT NULL,
    "role" "ServerMemberRole" NOT NULL,
    "display_name" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "server_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "server_favorite" (
    "id" TEXT NOT NULL,
    "fk_server_id" TEXT NOT NULL,
    "fk_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "server_favorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "server_name_key" ON "server"("name");

-- CreateIndex
CREATE INDEX "server_fk_manager_id_idx" ON "server"("fk_manager_id");

-- CreateIndex
CREATE INDEX "server_member_fk_server_id_idx" ON "server_member"("fk_server_id");

-- CreateIndex
CREATE INDEX "server_member_fk_user_id_idx" ON "server_member"("fk_user_id");

-- CreateIndex
CREATE INDEX "server_member_role_idx" ON "server_member"("role");

-- CreateIndex
CREATE UNIQUE INDEX "server_member_fk_server_id_fk_user_id_key" ON "server_member"("fk_server_id", "fk_user_id");

-- CreateIndex
CREATE INDEX "server_favorite_fk_server_id_idx" ON "server_favorite"("fk_server_id");

-- CreateIndex
CREATE INDEX "server_favorite_fk_user_id_idx" ON "server_favorite"("fk_user_id");

-- CreateIndex
CREATE INDEX "server_favorite_created_at_idx" ON "server_favorite"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "server_favorite_fk_server_id_fk_user_id_key" ON "server_favorite"("fk_server_id", "fk_user_id");

-- AddForeignKey
ALTER TABLE "server" ADD CONSTRAINT "server_fk_manager_id_fkey" FOREIGN KEY ("fk_manager_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_member" ADD CONSTRAINT "server_member_fk_server_id_fkey" FOREIGN KEY ("fk_server_id") REFERENCES "server"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_member" ADD CONSTRAINT "server_member_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_favorite" ADD CONSTRAINT "server_favorite_fk_server_id_fkey" FOREIGN KEY ("fk_server_id") REFERENCES "server"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_favorite" ADD CONSTRAINT "server_favorite_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
