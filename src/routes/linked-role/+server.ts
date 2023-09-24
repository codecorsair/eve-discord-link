import { getOAuthUrl } from '$lib/discord.server';
import { redirect } from '@sveltejs/kit';

export async function GET({ cookies }) {
  const { url, state } = getOAuthUrl();

  cookies.set('discordState', state, { maxAge: 1000 * 60 * 5, secure: true, path: '/' });

  throw redirect(302, url);
}