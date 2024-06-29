-- CreateTable
CREATE TABLE "Admin" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "username" VARCHAR,
    "password" VARCHAR,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminToken" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "user" VARCHAR NOT NULL,
    "accessToken" VARCHAR,

    CONSTRAINT "AdminToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BannedUsers" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "community" VARCHAR NOT NULL,
    "user" VARCHAR NOT NULL,
    "reasonId" TEXT,

    CONSTRAINT "BannedUsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "body" VARCHAR,
    "user" VARCHAR NOT NULL,
    "post" VARCHAR NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Community" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR,
    "description" VARCHAR,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityRequest" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "user" VARCHAR,
    "community" VARCHAR,
    "requestedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "message" VARCHAR,

    CONSTRAINT "CommunityRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Context" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "user" VARCHAR,
    "ip" VARCHAR,
    "country" VARCHAR,
    "city" VARCHAR,
    "os" VARCHAR,
    "device" VARCHAR,
    "deviceType" VARCHAR,
    "isTrusted" BOOLEAN,

    CONSTRAINT "Context_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "user" VARCHAR NOT NULL,
    "post" VARCHAR NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "user" VARCHAR,
    "context" VARCHAR,
    "message" VARCHAR,
    "type" INTEGER,
    "level" INTEGER,
    "timestamp" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingPost" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "content" VARCHAR,
    "fileUrl" VARCHAR NOT NULL,
    "community" VARCHAR NOT NULL,
    "user" VARCHAR NOT NULL,
    "caption" VARCHAR,
    "status" VARCHAR,
    "confirmationToken" VARCHAR,

    CONSTRAINT "PendingPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "content" VARCHAR,
    "fileUrl" VARCHAR NOT NULL,
    "community" VARCHAR NOT NULL,
    "user" VARCHAR NOT NULL,
    "caption" VARCHAR,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Preferences" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "user" VARCHAR,
    "enableContextBasedAuth" BOOLEAN,

    CONSTRAINT "Preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Relationship" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "follower" VARCHAR NOT NULL,
    "following" VARCHAR NOT NULL,

    CONSTRAINT "Relationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "reportedBy" VARCHAR NOT NULL,
    "post" VARCHAR NOT NULL,
    "community" VARCHAR NOT NULL,
    "reportReason" VARCHAR,
    "reportDate" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "user" VARCHAR NOT NULL,
    "refreshToken" VARCHAR,
    "accessToken" VARCHAR,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "salt" INTEGER NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "username" VARCHAR NOT NULL,
    "firstName" VARCHAR NOT NULL,
    "lastName" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "avatarUrl" VARCHAR,
    "bio" VARCHAR,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "isEmailVerified" BOOLEAN DEFAULT false,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "age" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRoles" (
    "id" SERIAL NOT NULL,
    "role" VARCHAR,

    CONSTRAINT "UserRoles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Email" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR,
    "verificationCode" VARCHAR,
    "messageId" VARCHAR,
    "for" INTEGER,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailFor" (
    "id" SERIAL NOT NULL,
    "for" VARCHAR,

    CONSTRAINT "EmailFor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leaderboard" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "community" VARCHAR NOT NULL,

    CONSTRAINT "Leaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaderboardSubmission" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "user" VARCHAR,
    "community" VARCHAR,
    "entryUrl" VARCHAR,
    "verifiedBy" VARCHAR,
    "weight" INTEGER,
    "type" INTEGER,
    "verifiedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "rank" INTEGER,
    "leaderboardId" VARCHAR,

    CONSTRAINT "LeaderboardSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaderboardSubmissionType" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR,
    "leaderboardSubmissionId" VARCHAR,

    CONSTRAINT "LeaderboardSubmissionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingPostStatus" (
    "id" SERIAL NOT NULL,
    "status" VARCHAR,

    CONSTRAINT "PendingPostStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogLevel" (
    "id" SERIAL NOT NULL,
    "level" VARCHAR,

    CONSTRAINT "LogLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogType" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR,

    CONSTRAINT "LogType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuspiciousLogin" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "user" VARCHAR,
    "ip" VARCHAR,
    "country" VARCHAR,
    "city" VARCHAR,
    "os" VARCHAR,
    "device" VARCHAR,
    "deviceType" VARCHAR,
    "isTrusted" BOOLEAN,
    "unverifiedAttempts" INTEGER,
    "isBlocked" BOOLEAN,

    CONSTRAINT "SuspiciousLogin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityUser" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "community" VARCHAR NOT NULL,
    "user" VARCHAR NOT NULL,
    "role" INTEGER NOT NULL,
    "verifiedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PendingPostToPendingPostStatus" (
    "A" VARCHAR NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "AdminToken_user_key" ON "AdminToken"("user");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityRequest_user_community_key" ON "CommunityRequest"("user", "community");

-- CreateIndex
CREATE UNIQUE INDEX "Like_user_post_key" ON "Like"("user", "post");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UserRoles_role_key" ON "UserRoles"("role");

-- CreateIndex
CREATE UNIQUE INDEX "_PendingPostToPendingPostStatus_AB_unique" ON "_PendingPostToPendingPostStatus"("A", "B");

-- CreateIndex
CREATE INDEX "_PendingPostToPendingPostStatus_B_index" ON "_PendingPostToPendingPostStatus"("B");

-- AddForeignKey
ALTER TABLE "AdminToken" ADD CONSTRAINT "AdminToken_user_fkey" FOREIGN KEY ("user") REFERENCES "Admin"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BannedUsers" ADD CONSTRAINT "BannedUsers_community_fkey" FOREIGN KEY ("community") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_post_fkey" FOREIGN KEY ("post") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityRequest" ADD CONSTRAINT "CommunityRequest_community_fkey" FOREIGN KEY ("community") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_post_fkey" FOREIGN KEY ("post") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_level_fkey" FOREIGN KEY ("level") REFERENCES "LogLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_type_fkey" FOREIGN KEY ("type") REFERENCES "LogType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_for_fkey" FOREIGN KEY ("for") REFERENCES "EmailFor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaderboardSubmission" ADD CONSTRAINT "LeaderboardSubmission_leaderboardId_fkey" FOREIGN KEY ("leaderboardId") REFERENCES "Leaderboard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaderboardSubmissionType" ADD CONSTRAINT "LeaderboardSubmissionType_leaderboardSubmissionId_fkey" FOREIGN KEY ("leaderboardSubmissionId") REFERENCES "LeaderboardSubmission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityUser" ADD CONSTRAINT "CommunityUser_community_fkey" FOREIGN KEY ("community") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityUser" ADD CONSTRAINT "CommunityUser_role_fkey" FOREIGN KEY ("role") REFERENCES "UserRoles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityUser" ADD CONSTRAINT "CommunityUser_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PendingPostToPendingPostStatus" ADD CONSTRAINT "_PendingPostToPendingPostStatus_A_fkey" FOREIGN KEY ("A") REFERENCES "PendingPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PendingPostToPendingPostStatus" ADD CONSTRAINT "_PendingPostToPendingPostStatus_B_fkey" FOREIGN KEY ("B") REFERENCES "PendingPostStatus"("id") ON DELETE CASCADE ON UPDATE CASCADE;
