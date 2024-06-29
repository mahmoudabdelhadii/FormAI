/*
  Warnings:

  - Made the column `for` on table `EmailFor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user` on table `LeaderboardSubmission` required. This step will fail if there are existing NULL values in that column.
  - Made the column `community` on table `LeaderboardSubmission` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isEmailVerified` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `role` on table `UserRoles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "EmailFor" ALTER COLUMN "for" SET NOT NULL;

-- AlterTable
ALTER TABLE "LeaderboardSubmission" ALTER COLUMN "user" SET NOT NULL,
ALTER COLUMN "community" SET NOT NULL;

-- AlterTable
ALTER TABLE "Token" ALTER COLUMN "salt" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "salt" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "isEmailVerified" SET NOT NULL;

-- AlterTable
ALTER TABLE "UserRoles" ALTER COLUMN "role" SET NOT NULL;
