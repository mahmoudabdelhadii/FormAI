/*
  Warnings:

  - You are about to drop the column `for` on the `Email` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user,community]` on the table `CommunityUser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Email" DROP CONSTRAINT "Email_for_fkey";

-- AlterTable
ALTER TABLE "Email" DROP COLUMN "for",
ADD COLUMN     "forId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "CommunityUser_user_community_key" ON "CommunityUser"("user", "community");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_forId_fkey" FOREIGN KEY ("forId") REFERENCES "EmailFor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
