-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'BASIC');

-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'BASIC';
