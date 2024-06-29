-- AlterTable
ALTER TABLE "Context" ADD COLUMN     "browser" VARCHAR,
ADD COLUMN     "platform" VARCHAR;

-- AlterTable
ALTER TABLE "SuspiciousLogin" ADD COLUMN     "browser" VARCHAR,
ADD COLUMN     "email" VARCHAR,
ADD COLUMN     "platform" VARCHAR;
