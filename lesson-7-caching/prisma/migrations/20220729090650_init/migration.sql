/*
  Warnings:

  - Added the required column `password` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "password" TEXT NOT NULL;
