/*
  Warnings:

  - The primary key for the `Friendship` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Friendship_id_seq";

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,
    "friendshipId" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resources" (
    "id" TEXT NOT NULL,
    "friendshipId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "couponBankId" TEXT NOT NULL,

    CONSTRAINT "Resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LastViewd" (
    "resourcesId" TEXT NOT NULL,
    "coupons" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LastViewd_pkey" PRIMARY KEY ("resourcesId")
);

-- CreateTable
CREATE TABLE "CouponBank" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "public" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CouponBank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "bankId" TEXT,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Resources_friendshipId_userId_key" ON "Resources"("friendshipId", "userId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_friendshipId_fkey" FOREIGN KEY ("friendshipId") REFERENCES "Friendship"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resources" ADD CONSTRAINT "Resources_friendshipId_fkey" FOREIGN KEY ("friendshipId") REFERENCES "Friendship"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resources" ADD CONSTRAINT "Resources_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resources" ADD CONSTRAINT "Resources_couponBankId_fkey" FOREIGN KEY ("couponBankId") REFERENCES "CouponBank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LastViewd" ADD CONSTRAINT "LastViewd_resourcesId_fkey" FOREIGN KEY ("resourcesId") REFERENCES "Resources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "CouponBank"("id") ON DELETE SET NULL ON UPDATE CASCADE;
