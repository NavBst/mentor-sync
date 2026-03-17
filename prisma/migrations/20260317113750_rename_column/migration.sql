/*
  Warnings:

  - You are about to drop the column `lastUdpated` on the `IndustryInsight` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "IndustryInsight" RENAME COLUMN "lastUdpated" TO  "lastUpdated";
