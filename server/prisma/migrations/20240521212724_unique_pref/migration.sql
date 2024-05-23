/*
  Warnings:

  - A unique constraint covering the columns `[user]` on the table `Preferences` will be added. If there are existing duplicate values, this will fail.
  - Made the column `user` on table `Preferences` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Preferences" ALTER COLUMN "user" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Preferences_user_key" ON "Preferences"("user");
