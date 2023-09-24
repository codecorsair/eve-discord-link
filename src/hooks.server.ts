import { getDiscordUsers } from '$lib/db.server';
import { updateMetaData } from '$lib/discord.server';
import { getCharactersAffiliations } from '$lib/eve.server';
import cron from 'node-cron';

cron.schedule("0 * * * *", async () => {
  try {
    // once an hour fetch metadata and push to Discord
    let users = null;
    const take = 1000;
    let skip = 0;
    do {
      users = await getDiscordUsers(take, skip);

      if (users === null || users.length == 0) {
        break;
      }
        
      const ids = users.map(u => u.eve_characterid).filter(u => !!u);
      
      const affiliations = await getCharactersAffiliations(ids as number[]);
      
      if (affiliations === null) {
        throw new Error('Failed to get character affiliations');
      }

      const merged = mergeByKeys(users, 'eve_characterid', affiliations, 'character_id');

      merged.forEach(async data => {
        await updateMetaData(data.id, {
          character: data.character_id,
          coporation: data.corporation_id,
          alliance: data.alliance_id,
          faction: data.faction_id
        });
      });

      skip += take;

    } while (users !== null && users.length > 0);
  
  } catch (err) {
    console.error(err);
  }

});

function mergeByKeys<A, B>(arr1: A[], k1: keyof A, arr2: B[], k2: keyof B) {
  const map = new Map();
  arr1.forEach(element => map.set(element[k1], element));
  arr2.forEach(element => map.set(element[k2], { ...map.get(element[k2]), ...element }));
  return Array.from(map.values());
}