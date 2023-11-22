import crypto from 'crypto';
import {
	DISCORD_CLIENT_ID,
	DISCORD_CLIENT_SECRET,
	DISCORD_REDIRECT_URI
} from '$env/static/private';
import { getDiscordUser, updateDiscordUser } from './db.server';

/**
 * Generate the url which the user will be directed to in order to approve the
 * bot, and see the list of requested scopes.
 */
export function getOAuthUrl() {
	const state = crypto.randomUUID();

	const url = new URL('https://discord.com/api/oauth2/authorize');
	url.searchParams.set('client_id', DISCORD_CLIENT_ID);
	url.searchParams.set('redirect_uri', DISCORD_REDIRECT_URI);
	url.searchParams.set('response_type', 'code');
	url.searchParams.set('state', state);
	url.searchParams.set('scope', 'role_connections.write identify');
	url.searchParams.set('prompt', 'consent');
	return { state, url: url.toString() };
}

interface Tokens {
	access_token: string;
	refresh_token: string;
	expires_in?: number;
	expires_at?: number;
}

/**
 * Given an OAuth2 code from the scope approval page, make a request to Discord's
 * OAuth2 service to retreive an access token, refresh token, and expiration.
 */
export async function getOAuthTokens(code: string): Promise<Tokens> {
	const url = 'https://discord.com/api/v10/oauth2/token';
	const body = new URLSearchParams({
		client_id: DISCORD_CLIENT_ID,
		client_secret: DISCORD_CLIENT_SECRET,
		grant_type: 'authorization_code',
		code,
		redirect_uri: DISCORD_REDIRECT_URI
	});

	const response = await fetch(url, {
		body,
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	});
	if (response.ok) {
		const data = await response.json();
		return data;
	} else {
		throw new Error(`Error fetching OAuth tokens: [${response.status}] ${response.statusText}`);
	}
}

/**
 * Given a user based access token, fetch profile information for the current user.
 */
export async function getUserData({ access_token }: Tokens) {
	const url = 'https://discord.com/api/v10/oauth2/@me';
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${access_token}`
		}
	});
	if (response.ok) {
		const data = await response.json();
		return data;
	} else {
		throw new Error(`Error fetching user data: [${response.status}] ${response.statusText}`);
	}
}

/**
 * The initial token request comes with both an access token and a refresh
 * token.  Check if the access token has expired, and if it has, use the
 * refresh token to acquire a new, fresh access token.
 */
export async function getAccessToken(userId: bigint, tokens: Tokens) {
	if (tokens.expires_at && Date.now() > tokens.expires_at) {
		const url = 'https://discord.com/api/v10/oauth2/token';
		const body = new URLSearchParams({
			client_id: DISCORD_CLIENT_ID,
			client_secret: DISCORD_CLIENT_SECRET,
			grant_type: 'refresh_token',
			refresh_token: tokens.refresh_token
		});
		const response = await fetch(url, {
			body,
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});
		if (response.ok) {
			const tokens = await response.json();
			tokens.access_token = tokens.access_token;
			tokens.expires_at = Date.now() + tokens.expires_in * 1000;
			await updateDiscordUser({
				id: userId,
				...tokens
			});
			return tokens.access_token;
		} else {
			throw new Error(`Error refreshing access token: [${response.status}] ${response.statusText}`);
		}
	}
	return tokens.access_token;
}

interface Metadata {
	character: number;
	corporation: number;
	alliance: number;
	faction: number;
}

export async function updateMetaData(userid: bigint, metadata: Metadata) {
	let discordUser;
	try {
		discordUser = await getDiscordUser(userid);
		if (discordUser !== null) {
			const access_token = await getAccessToken(userid, discordUser);
			const body = {
				platform_name: 'Eve Discord Link',
				metadata
			};

			if (!access_token) return;

			const url = `https://discord.com/api/v10/users/@me/applications/${DISCORD_CLIENT_ID}/role-connection`;
			const res = await fetch(url, {
				method: 'PUT',
				body: JSON.stringify(body),
				headers: {
					Authorization: `Bearer ${access_token}`,
					'Content-Type': 'application/json'
				}
			});

			if (!res.ok) {
				throw new Error(`Error pushing discord metadata: [${res.status}] ${res.statusText}`);
			}
		}
	} catch (err) {
		console.error(`Failed to find token in db for ${userid}`, err);
	}
}
