import chalk from 'chalk';
import {
  ApplicationCommandDataResolvable,
  Client,
  Collection,
} from 'discord.js';
import glob from 'glob';
import mongoose from 'mongoose';
import { promisify } from 'util';
import { ButtonType } from '../Typings/Button';
import { RegisterCommandsOptions } from '../Typings/client';
import { CommandType } from '../Typings/Command';
import { Config } from '../Typings/Config';
import { SelectMenuType } from '../Typings/SelectMenu';
import { Event } from './Event';
import { Events } from './Events';

const globPromise = promisify(glob);

export class ExtendedClient extends Client<true> {
  commands: Collection<string, CommandType> = new Collection();
  buttons: Collection<string, ButtonType> = new Collection();
  selectmenus: Collection<string, SelectMenuType> = new Collection();
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

    // Buttons
    console.log(
      chalk.white.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫') +
        chalk.blue.bold('Buttons') +
        chalk.white.bold('┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );
    const buttonFiles = await globPromise(
      `${__dirname}/../buttons/*/*{.ts,.js}`
    );
    buttonFiles.forEach(async (filePath) => {
      const button: ButtonType = await this.importFile(filePath);
      if (!button.customId) {
        return console.log(
          chalk.red('[FAILED]') +
            chalk.white.bold(' | ') +
            chalk.blue(`${new Date().toLocaleDateString()}`) +
            chalk.white.bold(' | ') +
            chalk.cyan('Button Load') +
            chalk.white.bold(' | ') +
            chalk.blue(button.customId || 'MISSING')
        );
      } else {
        console.log(
          chalk.green('[SUCCESS]') +
            chalk.white.bold(' | ') +
            chalk.blue(`${new Date().toLocaleDateString()}`) +
            chalk.white.bold(' | ') +
            chalk.cyan('Button Load') +
            chalk.white.bold(' | ') +
            chalk.blue(button.customId)
        );
      }

      this.buttons.set(button.customId, button);
    });

    // SelectMenu
    console.log(
      chalk.white.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫') +
        chalk.blue.bold('Menus') +
        chalk.white.bold('┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );
    const selectmenuFiles = await globPromise(
      `${__dirname}/../selectmenus/*/*{.ts,.js}`
    );
    selectmenuFiles.forEach(async (filePath) => {
      const selectMenu: SelectMenuType = await this.importFile(filePath);
      if (!selectMenu.customId) {
        return console.log(
          chalk.red('[FAILED]') +
            chalk.white.bold(' | ') +
            chalk.blue(`${new Date().toLocaleDateString()}`) +
            chalk.white.bold(' | ') +
            chalk.cyan('Menu Load') +
            chalk.white.bold(' | ') +
            chalk.blue(selectMenu.customId || 'MISSING')
        );
      } else {
        console.log(
          chalk.green('[SUCCESS]') +
            chalk.white.bold(' | ') +
            chalk.blue(`${new Date().toLocaleDateString()}`) +
            chalk.white.bold(' | ') +
            chalk.cyan('Menu Load') +
            chalk.white.bold(' | ') +
            chalk.blue(selectMenu.customId)
        );
      }

      this.selectmenus.set(selectMenu.customId, selectMenu);
    });

    this.on('ready', () => {
      const guildIds: string[] = JSON.parse(process.env.guildIds);
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
