/*
  Warnings:

  - You are about to drop the column `agentId` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the `Agent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_agentId_fkey";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "agentId";

-- DropTable
DROP TABLE "Agent";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
