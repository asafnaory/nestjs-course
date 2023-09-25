-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_agentId_fkey";

-- AlterTable
ALTER TABLE "Player" ALTER COLUMN "agentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
