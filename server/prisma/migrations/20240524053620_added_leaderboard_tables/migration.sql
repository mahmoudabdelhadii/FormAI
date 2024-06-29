/*
  Warnings:

  - You are about to drop the column `typeId` on the `LeaderboardSubmission` table. All the data in the column will be lost.
  - You are about to drop the `LeaderboardSubmissionType` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `weight` on table `LeaderboardSubmission` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "LeaderboardSubmissionType" DROP CONSTRAINT "LeaderboardSubmissionType_leaderboardSubmissionId_fkey";

-- AlterTable
ALTER TABLE "Leaderboard" ADD COLUMN     "liftId" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "LeaderboardSubmission" DROP COLUMN "typeId",
ADD COLUMN     "liftId" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "weight" SET NOT NULL,
ALTER COLUMN "weight" SET DEFAULT 0.0,
ALTER COLUMN "weight" SET DATA TYPE DOUBLE PRECISION;

-- DropTable
DROP TABLE "LeaderboardSubmissionType";

-- CreateTable
CREATE TABLE "Lift" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "Lift_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Leaderboard" ADD CONSTRAINT "Leaderboard_liftId_fkey" FOREIGN KEY ("liftId") REFERENCES "Lift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leaderboard" ADD CONSTRAINT "Leaderboard_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaderboardSubmission" ADD CONSTRAINT "LeaderboardSubmission_liftId_fkey" FOREIGN KEY ("liftId") REFERENCES "Lift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaderboardSubmission" ADD CONSTRAINT "LeaderboardSubmission_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaderboardSubmission" ADD CONSTRAINT "LeaderboardSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaderboardSubmission" ADD CONSTRAINT "LeaderboardSubmission_verifiedBy_fkey" FOREIGN KEY ("verifiedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
