/*
  Warnings:

  - You are about to drop the column `reasonId` on the `BannedUsers` table. All the data in the column will be lost.
  - Made the column `userId` on table `CommunityRequest` required. This step will fail if there are existing NULL values in that column.
  - Made the column `communityId` on table `CommunityRequest` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable

ALTER TABLE "BannedUsers" RENAME COLUMN "reasonId" TO "reason";

-- AlterTable
ALTER TABLE "CommunityRequest" ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "communityId" SET NOT NULL;
-- AddForeignKey
ALTER TABLE "BannedUsers" ADD CONSTRAINT "BannedUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reportedBy_fkey" FOREIGN KEY ("reportedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
