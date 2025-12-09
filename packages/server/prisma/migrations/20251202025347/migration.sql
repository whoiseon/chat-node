-- CreateTable
CREATE TABLE "server_tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "server_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "server_tag_relation" (
    "id" TEXT NOT NULL,
    "fk_server_id" TEXT NOT NULL,
    "fk_tag_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "server_tag_relation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "server_tag_name_key" ON "server_tag"("name");

-- CreateIndex
CREATE INDEX "server_tag_name_idx" ON "server_tag"("name");

-- CreateIndex
CREATE INDEX "server_tag_relation_fk_server_id_idx" ON "server_tag_relation"("fk_server_id");

-- CreateIndex
CREATE INDEX "server_tag_relation_fk_tag_id_idx" ON "server_tag_relation"("fk_tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "server_tag_relation_fk_server_id_fk_tag_id_key" ON "server_tag_relation"("fk_server_id", "fk_tag_id");

-- AddForeignKey
ALTER TABLE "server_tag_relation" ADD CONSTRAINT "server_tag_relation_fk_server_id_fkey" FOREIGN KEY ("fk_server_id") REFERENCES "server"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_tag_relation" ADD CONSTRAINT "server_tag_relation_fk_tag_id_fkey" FOREIGN KEY ("fk_tag_id") REFERENCES "server_tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
