import { GuildTextBasedChannel } from 'discord.js';
import { Node, Player, Track } from 'vulkava';
import { client } from '../../index';
import { lavalink } from '../../Utils/lavalink';
import { Events } from '../../structures/Events';

export default new Events(lavalink, [
  {
    event: 'trackStart',
    run: (player: Player, track: Track) => {
      let channel: GuildTextBasedChannel = client.channels.cache.get(
        player.textChannelId
      ) as GuildTextBasedChannel;

      channel.send(`Now playing \`${track.title}\``);
    },
  },
  {
    event: 'queueEnd',
    run: (player: Player) => {
      let channel: GuildTextBasedChannel = client.channels.cache.get(
        player.textChannelId
      ) as GuildTextBasedChannel;

      channel.send(`Queue ended!`);
    },
  },
  {
    event: 'error',
    run: (node: Node, err: Error) => {
      console.error(`[Lavalink] Error on node ${node.identifier}`, err.message);
    },
  },
]);
