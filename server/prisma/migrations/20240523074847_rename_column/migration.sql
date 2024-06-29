/*
  Warnings:

  - You are about to drop the column `user` on the `AdminToken` table. All the data in the column will be lost.
  - You are about to drop the column `community` on the `BannedUsers` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `BannedUsers` table. All the data in the column will be lost.
  - You are about to drop the column `post` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `community` on the `CommunityRequest` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `CommunityRequest` table. All the data in the column will be lost.
  - You are about to drop the column `community` on the `CommunityUser` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `CommunityUser` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `CommunityUser` table. All the data in the column will be lost.
  - You are about to drop the column `for` on the `Email` table. All the data in the column will be lost.
  - You are about to drop the column `community` on the `Leaderboard` table. All the data in the column will be lost.
  - You are about to drop the column `community` on the `LeaderboardSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `LeaderboardSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `LeaderboardSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `post` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `context` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `community` on the `PendingPost` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `PendingPost` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `PendingPost` table. All the data in the column will be lost.
  - You are about to drop the column `community` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `Preferences` table. All the data in the column will be lost.
  - You are about to drop the column `follower` on the `Relationship` table. All the data in the column will be lost.
  - You are about to drop the column `following` on the `Relationship` table. All the data in the column will be lost.
  - You are about to drop the column `community` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `post` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `Token` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `AdminToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,communityId]` on the table `CommunityRequest` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,communityId]` on the table `CommunityUser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,postId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Preferences` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[followerId,followingId]` on the table `Relationship` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Token` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `AdminToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `communityId` to the `BannedUsers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `BannedUsers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `communityId` to the `CommunityUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleId` to the `CommunityUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `CommunityUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `communityId` to the `Leaderboard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `communityId` to the `LeaderboardSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `LeaderboardSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postId` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `communityId` to the `PendingPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `PendingPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Preferences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followerId` to the `Relationship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followingId` to the `Relationship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postId` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AdminToken" DROP CONSTRAINT "AdminToken_user_fkey";

-- DropForeignKey
ALTER TABLE "BannedUsers" DROP CONSTRAINT "BannedUsers_community_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_post_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_user_fkey";

-- DropForeignKey
ALTER TABLE "CommunityRequest" DROP CONSTRAINT "CommunityRequest_community_fkey";

-- DropForeignKey
ALTER TABLE "CommunityUser" DROP CONSTRAINT "CommunityUser_community_fkey";

-- DropForeignKey
ALTER TABLE "CommunityUser" DROP CONSTRAINT "CommunityUser_role_fkey";

-- DropForeignKey
ALTER TABLE "CommunityUser" DROP CONSTRAINT "CommunityUser_user_fkey";

-- DropForeignKey
ALTER TABLE "Email" DROP CONSTRAINT "Email_for_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_post_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_user_fkey";

-- DropForeignKey
ALTER TABLE "Log" DROP CONSTRAINT "Log_level_fkey";

-- DropForeignKey
ALTER TABLE "Log" DROP CONSTRAINT "Log_type_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_community_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_user_fkey";

-- DropForeignKey
ALTER TABLE "Relationship" DROP CONSTRAINT "Relationship_follower_fkey";

-- DropForeignKey
ALTER TABLE "Relationship" DROP CONSTRAINT "Relationship_following_fkey";

-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_user_fkey";

-- DropIndex
DROP INDEX "AdminToken_user_key";

-- DropIndex
DROP INDEX "CommunityRequest_user_community_key";

-- DropIndex
DROP INDEX "CommunityUser_user_community_key";

-- DropIndex
DROP INDEX "Like_user_post_key";

-- DropIndex
DROP INDEX "Preferences_user_key";

-- DropIndex
DROP INDEX "Relationship_follower_following_key";

-- DropIndex
DROP INDEX "Token_user_key";

-- Rename columns in AdminToken
ALTER TABLE "AdminToken" RENAME COLUMN "user" TO "userId";

-- Rename columns in BannedUsers
ALTER TABLE "BannedUsers" RENAME COLUMN "community" TO "communityId";
ALTER TABLE "BannedUsers" RENAME COLUMN "user" TO "userId";

-- Rename columns in Comment
ALTER TABLE "Comment" RENAME COLUMN "post" TO "postId";
ALTER TABLE "Comment" RENAME COLUMN "user" TO "userId";

-- Rename columns in CommunityRequest
ALTER TABLE "CommunityRequest" RENAME COLUMN "community" TO "communityId";
ALTER TABLE "CommunityRequest" RENAME COLUMN "user" TO "userId";

-- Rename columns in CommunityUser
ALTER TABLE "CommunityUser" RENAME COLUMN "community" TO "communityId";
ALTER TABLE "CommunityUser" RENAME COLUMN "role" TO "roleId";
ALTER TABLE "CommunityUser" RENAME COLUMN "user" TO "userId";

-- Rename columns in Email
ALTER TABLE "Email" RENAME COLUMN "for" TO "forId";

-- Rename columns in Leaderboard
ALTER TABLE "Leaderboard" RENAME COLUMN "community" TO "communityId";

-- Rename columns in LeaderboardSubmission
ALTER TABLE "LeaderboardSubmission" RENAME COLUMN "community" TO "communityId";
ALTER TABLE "LeaderboardSubmission" RENAME COLUMN "type" TO "typeId";
ALTER TABLE "LeaderboardSubmission" RENAME COLUMN "user" TO "userId";

-- Rename columns in Like
ALTER TABLE "Like" RENAME COLUMN "post" TO "postId";
ALTER TABLE "Like" RENAME COLUMN "user" TO "userId";

-- Rename columns in Log
ALTER TABLE "Log" RENAME COLUMN "context" TO "contextId";
ALTER TABLE "Log" RENAME COLUMN "level" TO "levelId";
ALTER TABLE "Log" RENAME COLUMN "type" TO "typeId";
ALTER TABLE "Log" RENAME COLUMN "user" TO "userId";

-- Rename columns in PendingPost
ALTER TABLE "PendingPost" RENAME COLUMN "community" TO "communityId";
ALTER TABLE "PendingPost" RENAME COLUMN "status" TO "statusId";
ALTER TABLE "PendingPost" RENAME COLUMN "user" TO "userId";

-- Rename columns in Post
ALTER TABLE "Post" RENAME COLUMN "community" TO "communityId";
ALTER TABLE "Post" RENAME COLUMN "user" TO "userId";

-- Rename columns in Preferences
ALTER TABLE "Preferences" RENAME COLUMN "user" TO "userId";

-- Rename columns in Relationship
ALTER TABLE "Relationship" RENAME COLUMN "follower" TO "followerId";
ALTER TABLE "Relationship" RENAME COLUMN "following" TO "followingId";

-- Rename columns in Report
ALTER TABLE "Report" RENAME COLUMN "community" TO "communityId";
ALTER TABLE "Report" RENAME COLUMN "post" TO "postId";

-- Rename columns in Token
ALTER TABLE "Token" RENAME COLUMN "user" TO "userId";


-- CreateIndex
CREATE UNIQUE INDEX "AdminToken_userId_key" ON "AdminToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityRequest_userId_communityId_key" ON "CommunityRequest"("userId", "communityId");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityUser_userId_communityId_key" ON "CommunityUser"("userId", "communityId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_postId_key" ON "Like"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "Preferences_userId_key" ON "Preferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Relationship_followerId_followingId_key" ON "Relationship"("followerId", "followingId");

-- CreateIndex
CREATE UNIQUE INDEX "Token_userId_key" ON "Token"("userId");

-- AddForeignKey
ALTER TABLE "AdminToken" ADD CONSTRAINT "AdminToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Admin"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BannedUsers" ADD CONSTRAINT "BannedUsers_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityRequest" ADD CONSTRAINT "CommunityRequest_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "LogLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "LogType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_forId_fkey" FOREIGN KEY ("forId") REFERENCES "EmailFor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityUser" ADD CONSTRAINT "CommunityUser_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityUser" ADD CONSTRAINT "CommunityUser_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "UserRoles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityUser" ADD CONSTRAINT "CommunityUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
