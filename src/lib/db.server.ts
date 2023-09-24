import { PrismaClient, type DiscordUser } from "@prisma/client";

const prisma = new PrismaClient();

export async function createDiscordUser(user: DiscordUser) {
  try {
    await prisma.discordUser.upsert({
      where: {
        id: user.id,
      },
      update: {
        ...user,
      },
      create: {
        ...user
      }
    })
  } catch (err) {
    console.error(`Failed to save DiscordUser.`, err);
  }
}

export async function updateDiscordUser(user: Partial<DiscordUser>) {
  try {
    const data: Partial<DiscordUser> = {};
    if (user.access_token) {
      data.access_token = user.access_token;
    }

    if (user.refresh_token) {
      data.refresh_token = user.refresh_token;
    }

    if (user.expires_at) {
      data.expires_at = user.expires_at;
    }

    if (user.eve_characterid) {
      data.eve_characterid = user.eve_characterid;
    }

    await prisma.discordUser.update({
      where: {
        id: user.id,
      },
      data
    })
  } catch (err) {
    console.error(`Failed to save DiscordUser.`, err);
  }
}

export async function getDiscordUser(id: bigint) {
  try {
    return await prisma.discordUser.findFirst({
      where: {
        id: id
      }
    })
  } catch (err) {
    console.error(`Failed to find DiscordUser for id ${id}.`, err);
    throw err;
  }
}

export async function getDiscordUsers(take: number, skip: number) {
  try {
    return await prisma.discordUser.findMany({
      take,
      skip,
      orderBy: {
        id: 'asc'
      }
    })
  } catch (err) {
    console.error(`Failed to find DiscordUsers.`, err);
    throw err;
  }
}