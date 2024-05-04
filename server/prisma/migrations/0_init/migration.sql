-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR,
    "password" VARCHAR,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminToken" (
    "id" SERIAL NOT NULL,
    "user" VARCHAR NOT NULL,
    "accessToken" VARCHAR,

    CONSTRAINT "AdminToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BannedUsers" (
    "id" SERIAL NOT NULL,
    "community" INTEGER NOT NULL,
    "user" VARCHAR NOT NULL,
    "reasonId" INTEGER,

    CONSTRAINT "BannedUsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "body" VARCHAR,
    "user" VARCHAR NOT NULL,
    "post" INTEGER NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Community" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "description" VARCHAR,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityRequest" (
    "id" SERIAL NOT NULL,
    "user" VARCHAR,
    "community" INTEGER,
    "requestedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "message" VARCHAR,

    CONSTRAINT "CommunityRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityUser" (
    "id" SERIAL NOT NULL,
    "community" INTEGER NOT NULL,
    "user" VARCHAR NOT NULL,
    "role" INTEGER NOT NULL,
    "verifiedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Context" (
    "id" SERIAL NOT NULL,
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
    "id" INTEGER NOT NULL,
    "for" VARCHAR,

    CONSTRAINT "EmailFor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leaderboard" (
    "id" SERIAL NOT NULL,
    "community" INTEGER NOT NULL,

    CONSTRAINT "Leaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaderboardSubmission" (
    "id" SERIAL NOT NULL,
    "user" VARCHAR,
    "community" INTEGER,
    "entryUrl" VARCHAR,
    "verifiedBy" INTEGER,
    "weight" VARCHAR,
    "type" INTEGER,
    "verifiedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "rank" INTEGER,

    CONSTRAINT "LeaderboardSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaderboardSubmissionType" (
    "id" INTEGER NOT NULL,
    "type" VARCHAR,

    CONSTRAINT "LeaderboardSubmissionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "id" SERIAL NOT NULL,
    "user" VARCHAR NOT NULL,
    "post" INTEGER NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "user" VARCHAR,
    "context" INTEGER,
    "message" VARCHAR,
    "type" INTEGER,
    "level" INTEGER,
    "timestamp" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogLevel" (
    "id" INTEGER NOT NULL,
    "level" VARCHAR,

    CONSTRAINT "LogLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogType" (
    "id" INTEGER NOT NULL,
    "type" VARCHAR,

    CONSTRAINT "LogType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingPost" (
    "id" SERIAL NOT NULL,
    "Content" VARCHAR,
    "fileUrl" VARCHAR NOT NULL,
    "community" INTEGER NOT NULL,
    "user" VARCHAR NOT NULL,
    "caption" VARCHAR,
    "status" INTEGER,
    "confirmationToken" VARCHAR,

    CONSTRAINT "PendingPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingPostStatus" (
    "id" INTEGER NOT NULL,
    "status" VARCHAR,

    CONSTRAINT "PendingPostStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "Content" VARCHAR,
    "fileUrl" VARCHAR NOT NULL,
    "community" INTEGER NOT NULL,
    "user" VARCHAR NOT NULL,
    "caption" VARCHAR,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Preferences" (
    "id" SERIAL NOT NULL,
    "user" VARCHAR,
    "enableContextBasedAuth" BOOLEAN,

    CONSTRAINT "Preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Relationship" (
    "id" SERIAL NOT NULL,
    "follower" VARCHAR NOT NULL,
    "following" VARCHAR NOT NULL,

    CONSTRAINT "Relationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "reportedBy" VARCHAR NOT NULL,
    "post" INTEGER NOT NULL,
    "community" INTEGER NOT NULL,
    "reportReason" VARCHAR,
    "reportDate" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuspiciousLogin" (
    "id" SERIAL NOT NULL,
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
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "user" VARCHAR NOT NULL,
    "refreshToken" VARCHAR,
    "accessToken" VARCHAR,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
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

    CONSTRAINT "User_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "UserRoles" (
    "id" INTEGER NOT NULL,
    "role" VARCHAR,

    CONSTRAINT "UserRoles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CommunityUser" ADD CONSTRAINT "CommunityUser_community_fkey" FOREIGN KEY ("community") REFERENCES "Community"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CommunityUser" ADD CONSTRAINT "CommunityUser_role_fkey" FOREIGN KEY ("role") REFERENCES "UserRoles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CommunityUser" ADD CONSTRAINT "CommunityUser_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_for_fkey" FOREIGN KEY ("for") REFERENCES "EmailFor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PendingPost" ADD CONSTRAINT "PendingPost_status_fkey" FOREIGN KEY ("status") REFERENCES "PendingPostStatus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

