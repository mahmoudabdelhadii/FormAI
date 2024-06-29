/*
  Warnings:

  - You are about to drop the column `user` on the `Context` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `SuspiciousLogin` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Context` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Context` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Context" DROP COLUMN "user",
ADD COLUMN     "userId" VARCHAR NOT NULL;

-- AlterTable
ALTER TABLE "SuspiciousLogin" DROP COLUMN "user",
ADD COLUMN     "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" VARCHAR;

-- CreateIndex
CREATE UNIQUE INDEX "Context_userId_key" ON "Context"("userId");

-- AddForeignKey
ALTER TABLE "Context" ADD CONSTRAINT "Context_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
