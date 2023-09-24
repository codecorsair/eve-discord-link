/*
  Warnings:

  - The primary key for the `DiscordUser` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "DiscordUser" DROP CONSTRAINT "DiscordUser_pkey",
ALTER COLUMN "id" SET DATA TYPE BIGINT,
ALTER COLUMN "expires_at" SET DATA TYPE BIGINT,
ADD CONSTRAINT "DiscordUser_pkey" PRIMARY KEY ("id");
