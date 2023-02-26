import chalk from 'chalk';
import { GuildTextBasedChannel, Message } from 'discord.js';
import { Node, Player, Track } from 'vulkava';
import { Events } from '../../Structures/Events';
import { ExtendedPlayer } from '../../Structures/ExtendedPlayer';
import { lavalink } from '../../Systems/lavalink';
import { client } from '../../index';

let lastMessage: Message<boolean>;

export default new Events<string>(lavalink, [
  {
    event: 'trackStart',
    run: async (player: Player, track: Track) => {
      if (lastMessage && lastMessage?.channelId === player.textChannelId) {
        if (!lastMessage.deletable) return;
        await lastMessage.delete().catch(() => {});
      }
      let channel: GuildTextBasedChannel = client.channels.cache.get(
        player.textChannelId
      ) as GuildTextBasedChannel;

      if (!player.trackRepeat) {
        (player as ExtendedPlayer).setPreviousTrack =
          ExtendedPlayer.prototype.setPreviousTrack;
        (player as ExtendedPlayer).setPreviousTrack(track);
        lastMessage = (await channel
          .send(`Now playing \`${track.title}\``)
          .catch(() => {})) as Message;
        (player as ExtendedPlayer).autoplay = ExtendedPlayer.prototype.autoplay;
        await (player as ExtendedPlayer).autoplay(lavalink);
      }
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
    event: 'nodeConnect',
    run: (node: Node) => {
      console.log(
        chalk.cyan('[INFO]') +
          chalk.white.bold(' | ') +
          chalk.blue(`${new Date().toLocaleDateString()}`) +
          chalk.white.bold(' | ') +
          chalk.cyan(`Lavalink Node ${node.identifier} Connection`) +
          chalk.white(': ') +
          chalk.greenBright(`Connected`)
      );
    },
  },
  {
    event: 'nodeDisconnect',
    run: (node: Node) => {
      console.log(
        chalk.cyan('[INFO]') +
          chalk.white.bold(' | ') +
          chalk.blue(`${new Date().toLocaleDateString()}`) +
          chalk.white.bold(' | ') +
          chalk.cyan(`Lavalink Node ${node.identifier} Connection`) +
          chalk.white(': ') +
          chalk.greenBright(`Disconnected`)
      );
    },
  },
  {
    event: 'error',
    run: (node: Node, err: Error) => {
      console.log(
        chalk.red('[ERROR]') +
          chalk.white.bold(' | ') +
          chalk.blue(`${new Date().toLocaleDateString()}`) +
          chalk.white.bold(' | ') +
          chalk.cyan(`Lavalink Node ${node.identifier} Error`) +
          chalk.white(': ') +
          chalk.white(err.message)
      );
    },
  },
]);
