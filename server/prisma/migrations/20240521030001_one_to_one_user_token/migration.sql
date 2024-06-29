/*
  Warnings:

  - A unique constraint covering the columns `[user]` on the table `Token` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_user_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Token_user_key" ON "Token"("user");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
