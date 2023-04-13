import chalk from 'chalk';
import {
  ApplicationCommandDataResolvable,
  Client,
  Collection,
} from 'discord.js';
import { glob } from 'glob';
import mongoose from 'mongoose';
import { ButtonType } from '../Typings/Button';
import { CommandType } from '../Typings/Command';
import { Config } from '../Typings/Config';
import { SelectMenuType } from '../Typings/SelectMenu';
import { RegisterCommandsOptions } from '../Typings/client';
import { Event } from './Event';
import { Events } from './Events';

export class ExtendedClient extends Client<true> {
  commands: Collection<string, CommandType> = new Collection();
  buttons: Collection<string, ButtonType> = new Collection();
  selectmenus: Collection<string, SelectMenuType> = new Collection();
  config: Config;
  async start() {
    this.registerModules();
    await this.login(process.env.botToken);
  }
  async reload() {
    this.commands.clear();
    this.buttons.clear();
    this.selectmenus.clear();

    const folders = ['Commands', 'Buttons', 'Selectmenus'];
    const globPatterns = folders.map(
      (folder) => `${__dirname}/../${folder}/*/*{.ts,.js}`
    );
    const files = await glob(globPatterns);
    for await (const filePath of files) {
      delete require.cache[require.resolve(filePath)];
    }

    const eventFiles = await glob(`${__dirname}/../Events/*/*{.ts,.js}`);
    for await (const filePath of eventFiles) {
      delete require.cache[require.resolve(filePath)];
      const event: Event<any> | Events<any> = await this.importFile(filePath);
      if (event?.emitter?.removeAllListeners()) {
        event.emitter.removeAllListeners();
      } else {
        console.log(event.emitter);
      }
    }
    delete require.cache[require.resolve(`${__dirname}/../config.json`)];

    await this.registerModules();
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

    // Commands, Buttons, Selectmenus
    const folders = ['Commands', 'Buttons', 'Selectmenus'];
    const globPatterns = folders.map(
      (folder) => `${__dirname}/../${folder}/*/*{.ts,.js}`
    );
    const files = await glob(globPatterns);
    const slashCommands: ApplicationCommandDataResolvable[] = [];
    for await (const filePath of files) {
      let splitFilePath = filePath.split('/');
      let folder = splitFilePath[splitFilePath.length - 3];
      // Commands
      if (folder === 'Commands') {
        console.log(
          chalk.white.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫') +
            chalk.blue.bold('Slash Commands') +
            chalk.white.bold('┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        );
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
      }
      // Buttons
      if (folder === 'Buttons') {
        console.log(
          chalk.white.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫') +
            chalk.blue.bold('Buttons') +
            chalk.white.bold('┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        );
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
      }
      // Selectmenus
      if (folder === 'Selectmenus') {
        console.log(
          chalk.white.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫') +
            chalk.blue.bold('Menus') +
            chalk.white.bold('┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        );
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
      }
    }

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
        if (mongoose.connection.readyState === 0) {
          mongoose.connect(process.env.mongooseConnectionString);
        }
      }
    });

    // Event
    const eventFiles = await glob(`${__dirname}/../Events/**/*{.ts,.js}`);
    eventFiles.forEach(async (filePath) => {
      const event: Event<any> | Events<any> = await this.importFile(filePath);
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
