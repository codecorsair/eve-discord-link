/*
  Warnings:

  - Added the required column `refresh_token` to the `DiscordUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DiscordUser" ADD COLUMN     "refresh_token" TEXT NOT NULL;
