import { client } from '../index';
import { Vulkava } from 'vulkava';
import { OutgoingDiscordPayload } from 'vulkava/lib/@types';

export const lavalink = new Vulkava({
  nodes: [
    {
      id: 'Lavalink',
      hostname: process.env.LAVALINK_HOST,
      port: 443,
      password: process.env.LAVALINK_PASSWORD,
      secure: true,
      resumeKey: 'MM-Utilities',
    },
  ],
  sendWS: (guildId: string, payload: OutgoingDiscordPayload) => {
    client.guilds.cache.get(guildId)?.shard.send(payload);
  },
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  },
  unresolvedSearchSource: 'youtube',
});
