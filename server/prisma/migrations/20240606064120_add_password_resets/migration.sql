-- CreateTable
CREATE TABLE "PasswordReset" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "userId" VARCHAR NOT NULL,
    "token" VARCHAR NOT NULL,
    "tokenExpires" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "PasswordReset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordReset_token_key" ON "PasswordReset"("token");

-- AddForeignKey
ALTER TABLE "PasswordReset" ADD CONSTRAINT "PasswordReset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
