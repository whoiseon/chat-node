-- CreateTable
CREATE TABLE "admin_user" (
    "id" TEXT NOT NULL,
    "fk_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "admin_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_token" (
    "id" TEXT NOT NULL,
    "fk_user_id" TEXT NOT NULL,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "auth_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_user_id" ON "admin_user"("fk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_display_name_key" ON "user"("display_name");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE INDEX "idx_display_name" ON "user"("display_name");

-- CreateIndex
CREATE INDEX "idx_username" ON "user"("username");

-- AddForeignKey
ALTER TABLE "admin_user" ADD CONSTRAINT "admin_user_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth_token" ADD CONSTRAINT "auth_token_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
