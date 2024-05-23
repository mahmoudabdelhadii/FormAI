/*
  Warnings:

  - A unique constraint covering the columns `[follower,following]` on the table `Relationship` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Relationship_follower_following_key" ON "Relationship"("follower", "following");

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_follower_fkey" FOREIGN KEY ("follower") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_following_fkey" FOREIGN KEY ("following") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
