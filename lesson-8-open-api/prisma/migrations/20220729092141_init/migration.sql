/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Agent` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Agent_email_key" ON "Agent"("email");
