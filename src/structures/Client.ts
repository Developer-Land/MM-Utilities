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
      console.log(
        `Registering commands to ${this.guilds.cache.get(guildId).name}`
      );
    } else {
      this.application?.commands.set(commands);
      console.log('Registering global commands');
    }
  }

  async registerModules() {
    // Commands
    const slashCommands: ApplicationCommandDataResolvable[] = [];
    const commandFiles = await globPromise(
      `${__dirname}/../commands/*/*{.ts,.js}`
    );
    commandFiles.forEach(async (filePath) => {
      const command: CommandType = await this.importFile(filePath);
      if (command.init) command.init(this);
      if (!command.name) return;

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
    });

    // Event
    const eventFiles = await globPromise(
      `${__dirname}/../events/**/*{.ts,.js}`
    );
    eventFiles.forEach(async (filePath) => {
      const event: Event<string | symbol> = await this.importFile(filePath);
      event.emitter.on(event.event, event.run);
    });

    // Config
    this.config = await this.importFile(`${__dirname}/../config.json`);

    // Mongoose
    if (!process.env.mongooseConnectionString) return;
    mongoose
      .connect(process.env.mongooseConnectionString)
      .then(() => console.log('Connected to mongodb'));
  }
}
