import { getOAuthTokens, getUserData } from '$lib/discord.server.js';
import { getOAuthUrl } from '$lib/eve.server';
import { error, redirect } from '@sveltejs/kit';
import { createDiscordUser } from '$lib/db.server.js';

export async function GET({ cookies, url }) {

  //TODO: validate discord client data and save from url
  const code = url.searchParams.get('code') || '';
  const state = url.searchParams.get('state') || '';
  const originalDiscordState = cookies.get('discordState') || '';
  // if (state != originalDiscordState) {
  //   throw error(401, 'State mismatch, please try again.');
  // }

  let discordUserId = '';
  try {
    const tokens = await getOAuthTokens(code);
    if (!tokens) throw error(500, 'Failed to get Discord Auth tokens');
    const user = await getUserData(tokens);
    discordUserId = user.user.id;
    tokens.expires_at = Date.now() + (tokens.expires_in || 0) * 1000;

    await createDiscordUser({
      id: BigInt(discordUserId),
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: BigInt(tokens.expires_at),
    });
    
  } catch (err) {
    console.error('Failed to get discord user', err);
    throw error(500, 'Failed to get Discord user');
  }

  const eveOAuthUrl = getOAuthUrl(discordUserId);
  throw redirect(302, eveOAuthUrl);
}