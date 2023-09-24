/*
  Warnings:

  - Added the required column `eve_characterid` to the `DiscordUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DiscordUser" ADD COLUMN     "eve_characterid" BIGINT NOT NULL;

-- CreateIndex
CREATE INDEX "DiscordUser_eve_characterid_idx" ON "DiscordUser"("eve_characterid");
