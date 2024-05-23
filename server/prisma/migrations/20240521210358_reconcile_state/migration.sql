/*
  Warnings:

  - You are about to drop the column `forId` on the `Email` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Email" DROP CONSTRAINT "Email_forId_fkey";

-- AlterTable
ALTER TABLE "Email" DROP COLUMN "forId",
ADD COLUMN     "for" INTEGER;

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_for_fkey" FOREIGN KEY ("for") REFERENCES "EmailFor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
