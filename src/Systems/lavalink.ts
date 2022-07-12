import { Vulkava } from 'vulkava';
import { NodeOptions, OutgoingDiscordPayload } from 'vulkava/lib/@types';
import { client } from '../index';

const nodeIdentifiers: string[] = JSON.parse(process.env.LAVALINK_IDENTIFIER);
const nodeHosts: string[] = JSON.parse(process.env.LAVALINK_HOST);
const nodePasswords: string[] = JSON.parse(process.env.LAVALINK_PASSWORD);
const nodes: NodeOptions[] = [];

for (let i = 0; i < nodeIdentifiers.length; i++) {
  nodes.push({
    id: nodeIdentifiers[i],
    hostname: nodeHosts[i].split(':')[0],
    port: parseInt(nodeHosts[i].split(':')[1]),
    password: nodePasswords[i],
    secure: false,
    resumeKey: 'MM-Utilities',
  });
}

export const lavalink = new Vulkava({
  nodes: nodes,
  sendWS: (guildId: string, payload: OutgoingDiscordPayload) => {
    client.guilds.cache.get(guildId)?.shard.send(payload);
  },
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  },
  unresolvedSearchSource: 'youtube',
});
