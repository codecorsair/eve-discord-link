/*
  Warnings:

  - Added the required column `expires_at` to the `DiscordUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DiscordUser" ADD COLUMN     "expires_at" INTEGER NOT NULL;
