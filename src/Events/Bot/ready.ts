import chalk from 'chalk';
import { ExcludeEnum } from 'discord.js';
import { ActivityTypes } from 'discord.js/typings/enums';
import { client } from '../../index';
import { Event } from '../../Structures/Event';
import { lavalink } from '../../Systems/lavalink';

export default new Event(client, 'ready', () => {
  console.log(
    chalk.white.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫') +
      chalk.blue.bold('Client Status') +
      chalk.white.bold('┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
  console.log(
    chalk.cyan('[INFO]') +
      chalk.white.bold(' | ') +
      chalk.blue(`${new Date().toLocaleDateString()}`) +
      chalk.white.bold(' | ') +
      chalk.cyan('Logged in as') +
      chalk.white(': ') +
      chalk.greenBright(`${client.user.tag}`)
  );

  console.log(
    chalk.cyan('[INFO]') +
      chalk.white.bold(' | ') +
      chalk.blue(`${new Date().toLocaleDateString()}`) +
      chalk.white.bold(' | ') +
      chalk.cyan('Guilds') +
      chalk.white(': ') +
      chalk.greenBright(
        `${client.guilds.cache.map((guild) => guild.name).join(', ')}`
      )
  );

  client.user.setPresence({
    status: 'online',
  });
  client.user.setActivity(client.config.activityName, {
    type: client.config.activityType as ExcludeEnum<
      typeof ActivityTypes,
      'CUSTOM'
    >,
    url: `https://www.youtube.com/watch?v=dbpMXfbS-Sc`,
  });
  lavalink.start(client.user.id);
});
