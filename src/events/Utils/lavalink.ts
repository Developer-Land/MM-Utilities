import chalk from 'chalk';
import { GuildTextBasedChannel } from 'discord.js';
import { Node, Player, Track } from 'vulkava';
import { client } from '../../index';
import { Events } from '../../structures/Events';
import { ExtendedPlayer } from '../../structures/ExtendedPlayer';
import { lavalink } from '../../utils/lavalink';

export default new Events(lavalink, [
  {
    event: 'trackStart',
    run: async (player: Player, track: Track) => {
      let channel: GuildTextBasedChannel = client.channels.cache.get(
        player.textChannelId
      ) as GuildTextBasedChannel;

      if (!player.trackRepeat) {
        (player as ExtendedPlayer).setPreviousTrack =
          ExtendedPlayer.prototype.setPreviousTrack;
        (player as ExtendedPlayer).setPreviousTrack(track);
        channel.send(`Now playing \`${track.title}\``);
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
