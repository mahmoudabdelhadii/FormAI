/*
  Warnings:

  - Made the column `refreshToken` on table `Token` required. This step will fail if there are existing NULL values in that column.
  - Made the column `accessToken` on table `Token` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Token" ALTER COLUMN "refreshToken" SET NOT NULL,
ALTER COLUMN "accessToken" SET NOT NULL;
