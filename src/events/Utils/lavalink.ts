import { GuildTextBasedChannel } from 'discord.js';
import { Node, Player, Track } from 'vulkava';
import { client } from '../../index.js';
import { lavalink } from '../../Utils/lavalink';

// Fired when a track starts playing
lavalink.on('trackStart', (player: Player, track: Track) => {
  let channel: GuildTextBasedChannel = client.channels.cache.get(
    player.textChannelId
  ) as GuildTextBasedChannel;

  channel.send(`Now playing \`${track.title}\``);
});

// Fired when the queue ends
lavalink.on('queueEnd', (player: Player) => {
  let channel: GuildTextBasedChannel = client.channels.cache.get(
    player.textChannelId
  ) as GuildTextBasedChannel;

  channel.send(`Queue ended!`);
});

// This event is needed to catch any errors that occur on Lavalink
lavalink.on('error', (node: Node, err: Error) => {
  console.error(`[Lavalink] Error on node ${node.identifier}`, err.message);
});
