import {
  ApplicationCommandDataResolvable,
  Client,
  Collection,
} from 'discord.js';
import { CommandType } from '../typings/Command';
import glob from 'glob';
import { promisify } from 'util';
import { RegisterCommandsOptions } from '../typings/client';
import { Event } from './Event';
import { Config } from '../typings/Config';
import mongoose from 'mongoose';
import { Events } from './Events';
import chalk from 'chalk';

const globPromise = promisify(glob);

export class ExtendedClient extends Client<true> {
  commands: Collection<string, CommandType> = new Collection();
  config: Config;
  async start() {
    this.registerModules();
    this.login(process.env.botToken);
  }
  async importFile(filePath: string) {
    return (await import(filePath))?.default;
  }

  async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
    if (guildId) {
      this.guilds.cache.get(guildId)?.commands.set(commands);
    } else {
      this.application?.commands.set(commands);
    }
  }

  async registerModules() {
    // Config
    this.config = await this.importFile(`${__dirname}/../config.json`);

    // Commands
    console.log(
      chalk.white.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫') +
        chalk.blue.bold('Slash Commands') +
        chalk.white.bold('┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );
    const slashCommands: ApplicationCommandDataResolvable[] = [];
    const commandFiles = await globPromise(
      `${__dirname}/../commands/*/*{.ts,.js}`
    );
    commandFiles.forEach(async (filePath) => {
      const command: CommandType = await this.importFile(filePath);
      if (command.init) command.init(this);
      if (!command.name) {
        return console.log(
          chalk.red('[FAILED]') +
            chalk.white.bold(' | ') +
            chalk.blue(`${new Date().toLocaleDateString()}`) +
            chalk.white.bold(' | ') +
            chalk.cyan('Slash Command Load') +
            chalk.white.bold(' | ') +
            chalk.blue(command.name || 'MISSING')
        );
      } else {
        console.log(
          chalk.green('[SUCCESS]') +
            chalk.white.bold(' | ') +
            chalk.blue(`${new Date().toLocaleDateString()}`) +
            chalk.white.bold(' | ') +
            chalk.cyan('Slash Command Load') +
            chalk.white.bold(' | ') +
            chalk.blue(command.name)
        );
      }

      this.commands.set(command.name, command);
      slashCommands.push(command);
    });

    this.on('ready', () => {
      const guildIds = process.env.guildIds.split(',');
      guildIds.forEach((guildId) => {
        this.registerCommands({
          commands: slashCommands,
          guildId: guildId,
        });
      });
      // Mongoose
      if (process.env.mongooseConnectionString) {
        mongoose.connect(process.env.mongooseConnectionString);
      }
    });

    // Event
    const eventFiles = await globPromise(
      `${__dirname}/../events/**/*{.ts,.js}`
    );
    eventFiles.forEach(async (filePath) => {
      const event: Event | Events = await this.importFile(filePath);
      if (event instanceof Event) {
        if (event.options?.once) {
          event.emitter.once(event.event, event.run);
        } else {
          event.emitter.on(event.event, event.run);
        }
      } else if (event instanceof Events) {
        event.events.forEach(async (events) => {
          if (events.options?.once) {
            event.emitter.once(events.event, events.run);
          } else {
            event.emitter.on(events.event, events.run);
          }
        });
      }
    });
  }
}
