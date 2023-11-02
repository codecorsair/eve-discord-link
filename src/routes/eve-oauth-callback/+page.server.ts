import { EVE_SECRET_KEY, EVE_CLIENT_ID } from '$env/static/private';
import { updateDiscordUser } from '$lib/db.server.js';
import { updateMetaData } from '$lib/discord.server.js';
import { getCharacterPublicData, validateToken } from '$lib/eve.server.js';
import { error } from '@sveltejs/kit';

export async function load({ url, cookies }) {
	if (!url.searchParams.get('state')) {
		throw error(404, 'Not found');
	}

	const code = url.searchParams.get('code') || '';
	const state = BigInt(url.searchParams.get('state') || '');

	const characterId = Number.parseInt(await authenticate(code));
	const characterInfo = await getCharacterPublicData(characterId);

	const discordState = cookies.get('discordState') || '';
	const discordUserId = state;
	try {
		await updateDiscordUser({
			id: state,
			eve_characterid: characterId
		});

		await updateMetaData(discordUserId, {
			corporation: characterInfo?.corporation_id || -1,
			alliance: characterInfo?.alliance_id || -1,
			character: characterId,
			faction: characterInfo?.faction_id || -1
		});
	} catch (err) {
		console.error('Failed up update metadata', err);
	}

	console.log(`Updated ${discordUserId} with ${characterId}`);
	console.log(`affiliations: ${JSON.stringify(characterInfo)}`);

	return characterInfo;
}

async function authenticate(code: string) {
	try {
		const res = await fetch('https://login.eveonline.com/v2/oauth/token', {
			method: 'POST',
			headers: {
				Authorization:
					'Basic ' + Buffer.from(`${EVE_CLIENT_ID}:${EVE_SECRET_KEY}`, 'utf-8').toString('base64'),
				'Content-Type': 'application/x-www-form-urlencoded',
				Host: 'login.eveonline.com',
				Accept: 'application/json'
			},
			body: new URLSearchParams({
				grant_type: 'authorization_code',
				code: code
			})
		});

		const json = await res.json();
		const decoded = (await validateToken(json.access_token)) as any;
		if (!decoded) {
			console.error('Failed to validate');
			throw error(401, 'Failed to validate token');
		}

		const characterId = decoded.sub.split(':')[2];
		return characterId;
	} catch (err) {
		console.error(`login failed`, err);
	}
}
