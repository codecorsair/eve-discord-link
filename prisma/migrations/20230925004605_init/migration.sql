/*
  Warnings:

  - You are about to alter the column `eve_characterid` on the `DiscordUser` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "DiscordUser" ALTER COLUMN "eve_characterid" SET DATA TYPE INTEGER;
