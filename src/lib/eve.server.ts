import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';

import { EVE_CLIENT_ID, EVE_CALLBACK_URL } from '$env/static/private';

export function getOAuthUrl(state: string | number) {
	const url = new URL('https://login.eveonline.com/v2/oauth/authorize/');
	url.searchParams.set('response_type', 'code');
	url.searchParams.set('redirect_uri', EVE_CALLBACK_URL);
	url.searchParams.set('client_id', EVE_CLIENT_ID);
	url.searchParams.set('state', state + '');
	return url.toString();
}

let publicKey: any;
export async function validateToken(token: string) {
	if (!publicKey) {
		try {
			const eveJWKS = await (await fetch('https://login.eveonline.com/oauth/jwks')).json();
			publicKey = jwkToPem(eveJWKS.keys[0]);
		} catch (err) {
			console.error(`failed to get public keys`, err);
		}
	}

	try {
		const decoded = jwt.verify(token, publicKey);
		return decoded;
	} catch (err) {
		console.error(`failed to validate token`, err);
		return null;
	}
}

interface CharacterData {
	alliance_id: number;
	birthday: string;
	bloodline_id: number;
	corporation_id: number;
	description: string;
	gender: 'male' | 'female';
	name: string;
	race_id: number;
	security_status: number;
	faction_id: number;
	character_id: number;
}

export async function getCharacterPublicData(characterId: number) {
	try {
		const res = await fetch(
			`https://esi.evetech.net/latest/characters/affiliation/?datasource=tranquility`,
			{
				headers: {
					'User-Agent': 'EVE-DISCORD-LINK | jb@jb.codes - IGN: Roman Kaas'
				},
				method: 'POST',
				body: JSON.stringify([characterId])
			}
		);
		if (!res.ok) {
			console.error(`Failed to get character public data for ${characterId}`, res.statusText);
			return null;
		}

		return (await res.json())[0] as Partial<CharacterData>;
	} catch (err) {
		console.error(`Failed to get character public data for ${characterId}`, err);
		return null;
	}
}

export async function getCharactersAffiliations(characterIds: number[]) {
	try {
		// filter characterIds to only unique values
		characterIds = [...new Set(characterIds)];

		const res = await fetch(
			`https://esi.evetech.net/latest/characters/affiliation/?datasource=tranquility`,
			{
				method: 'POST',
				headers: {
					'User-Agent': 'EVE-DISCORD-LINK | jb@jb.codes - IGN: Roman Kaas',
					Accept: 'application/json'
				},
				body: JSON.stringify(characterIds)
			}
		);
		if (!res.ok) {
			console.error(`Failed to get character affiliations`, res.statusText);
			return null;
		}

		return (await res.json()) as Partial<CharacterData>[];
	} catch (err) {
		console.error(`Failed to get character affiliations`, err);
		return null;
	}
}
