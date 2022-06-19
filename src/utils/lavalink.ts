import { Vulkava } from 'vulkava';
import { NodeOptions, OutgoingDiscordPayload } from 'vulkava/lib/@types';
import { client } from '../index';

const nodeHosts: string[] = JSON.parse(process.env.LAVALINK_HOST);
const nodePorts: string[] = JSON.parse(process.env.LAVALINK_PORT);
const nodePasswords: string[] = JSON.parse(process.env.LAVALINK_PASSWORD);
const nodes: NodeOptions[] = [];

nodeHosts.forEach((host, index) => {
  nodes.push({
    hostname: host,
    port: parseInt(nodePorts[index]),
    password: nodePasswords[index],
    secure: false,
    resumeKey: 'MM-Utilities',
  });
});

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
