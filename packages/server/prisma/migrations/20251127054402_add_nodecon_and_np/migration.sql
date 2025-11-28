-- CreateEnum
CREATE TYPE "NpTransactionType" AS ENUM ('CHARGE', 'PURCHASE', 'BONUS', 'EARNED', 'WITHDRAW', 'GIFT');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "fk_main_node_con_id" TEXT,
ADD COLUMN     "np" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "node_con" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "np" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "node_con_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_node_con" (
    "id" TEXT NOT NULL,
    "fk_user_id" TEXT NOT NULL,
    "fk_node_con_id" TEXT NOT NULL,
    "purchased_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fk_transaction_id" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_node_con_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "node_con_tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "node_con_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "node_con_tag_relation" (
    "id" TEXT NOT NULL,
    "fk_node_con_id" TEXT NOT NULL,
    "fk_tag_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "node_con_tag_relation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "np_transaction" (
    "id" TEXT NOT NULL,
    "fk_user_id" TEXT NOT NULL,
    "type" "NpTransactionType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "balance_before" INTEGER NOT NULL,
    "balance_after" INTEGER NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "np_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "node_con_name_key" ON "node_con"("name");

-- CreateIndex
CREATE INDEX "node_con_name_idx" ON "node_con"("name");

-- CreateIndex
CREATE INDEX "node_con_np_idx" ON "node_con"("np");

-- CreateIndex
CREATE UNIQUE INDEX "user_node_con_fk_transaction_id_key" ON "user_node_con"("fk_transaction_id");

-- CreateIndex
CREATE INDEX "user_node_con_fk_user_id_idx" ON "user_node_con"("fk_user_id");

-- CreateIndex
CREATE INDEX "user_node_con_fk_node_con_id_idx" ON "user_node_con"("fk_node_con_id");

-- CreateIndex
CREATE INDEX "user_node_con_purchased_at_idx" ON "user_node_con"("purchased_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_node_con_fk_user_id_fk_node_con_id_key" ON "user_node_con"("fk_user_id", "fk_node_con_id");

-- CreateIndex
CREATE UNIQUE INDEX "node_con_tag_name_key" ON "node_con_tag"("name");

-- CreateIndex
CREATE INDEX "node_con_tag_name_idx" ON "node_con_tag"("name");

-- CreateIndex
CREATE INDEX "node_con_tag_relation_fk_node_con_id_idx" ON "node_con_tag_relation"("fk_node_con_id");

-- CreateIndex
CREATE INDEX "node_con_tag_relation_fk_tag_id_idx" ON "node_con_tag_relation"("fk_tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "node_con_tag_relation_fk_node_con_id_fk_tag_id_key" ON "node_con_tag_relation"("fk_node_con_id", "fk_tag_id");

-- CreateIndex
CREATE INDEX "np_transaction_fk_user_id_idx" ON "np_transaction"("fk_user_id");

-- CreateIndex
CREATE INDEX "np_transaction_type_idx" ON "np_transaction"("type");

-- CreateIndex
CREATE INDEX "np_transaction_created_at_idx" ON "np_transaction"("created_at");

-- CreateIndex
CREATE INDEX "np_transaction_fk_user_id_created_at_idx" ON "np_transaction"("fk_user_id", "created_at");

-- CreateIndex
CREATE INDEX "user_np_idx" ON "user"("np");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_fk_main_node_con_id_fkey" FOREIGN KEY ("fk_main_node_con_id") REFERENCES "node_con"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_node_con" ADD CONSTRAINT "user_node_con_fk_transaction_id_fkey" FOREIGN KEY ("fk_transaction_id") REFERENCES "np_transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_node_con" ADD CONSTRAINT "user_node_con_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_node_con" ADD CONSTRAINT "user_node_con_fk_node_con_id_fkey" FOREIGN KEY ("fk_node_con_id") REFERENCES "node_con"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "node_con_tag_relation" ADD CONSTRAINT "node_con_tag_relation_fk_node_con_id_fkey" FOREIGN KEY ("fk_node_con_id") REFERENCES "node_con"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "node_con_tag_relation" ADD CONSTRAINT "node_con_tag_relation_fk_tag_id_fkey" FOREIGN KEY ("fk_tag_id") REFERENCES "node_con_tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "np_transaction" ADD CONSTRAINT "np_transaction_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
