import { leveling } from '../../Models/Leveling/leveling';
import { levelingIgnore } from '../../Models/Leveling/levelingignore';
import { levelRoles } from '../../Models/Leveling/levelroles';
import { levelUserSettings } from '../../Models/Leveling/usersettings';
import { Command } from '../../Structures/Command';

export default new Command({
  name: 'leveling',
  description: 'Main leveling command',
  options: [
    {
      type: 'SUB_COMMAND_GROUP',
      name: 'staff',
      description: 'Staff commands',
      options: [
        {
          type: 'SUB_COMMAND',
          name: 'ignore',
          description: 'Add/remove a role or channel to ignore from getting xp',
          options: [
            {
              type: 'STRING',
              name: 'type',
              description: 'select the thing you want to do add or remove',
              required: true,
              choices: [
                {
                  name: 'add',
                  value: 'add',
                },
                {
                  name: 'remove',
                  value: 'remove',
                },
              ],
            },
            {
              type: 'ROLE',
              name: 'role',
              description: 'the role',
              required: false,
            },
            {
              type: 'CHANNEL',
              name: 'channel',
              description: 'the channel',
              channelTypes: ['GUILD_TEXT', 'GUILD_VOICE'],
              required: false,
            },
          ],
        },
        {
          type: 'SUB_COMMAND',
          name: 'setlevel',
          description: 'Set level of a user',
          options: [
            {
              type: 'USER',
              name: 'user',
              description: 'The user to set',
              required: true,
            },
            {
              type: 'NUMBER',
              name: 'level',
              description: 'The level to set',
              required: true,
            },
          ],
        },
        {
          type: 'SUB_COMMAND',
          name: 'setxp',
          description: 'Set xp of a user',
          options: [
            {
              type: 'USER',
              name: 'user',
              description: 'The user to set',
              required: true,
            },
            {
              type: 'NUMBER',
              name: 'xp',
              description: 'The xp to set',
              required: true,
            },
          ],
        },
        {
          type: 'SUB_COMMAND',
          name: 'levelroles',
          description: 'Set level roles',
          options: [
            {
              type: 'STRING',
              name: 'type',
              description: 'select the thing you want to do add or remove',
              choices: [
                {
                  name: 'add',
                  value: 'add',
                },
                {
                  name: 'remove',
                  value: 'remove',
                },
                {
                  name: 'view',
                  value: 'view',
                },
              ],
              required: true,
            },
            {
              type: 'NUMBER',
              name: 'level',
              description: 'The level to set roles for',
              required: false,
            },
            {
              type: 'ROLE',
              name: 'role',
              description: 'The role to set',
              required: false,
            },
          ],
        },
      ],
    },
    {
      type: 'SUB_COMMAND_GROUP',
      name: 'user',
      description: 'User commands',
      options: [
        {
          type: 'SUB_COMMAND',
          name: 'levelupmsg',
          description: 'Toggle level up message ping for yourself',
          options: [
            {
              type: 'STRING',
              name: 'change',
              description: 'Enable/disable level up message',
              required: true,
              choices: [
                {
                  name: 'enable',
                  value: 'true',
                },
                {
                  name: 'disable',
                  value: 'false',
                },
              ],
            },
          ],
        },
        {
          type: 'SUB_COMMAND',
          name: 'rankcardbg',
          description: 'Set rankcard background or delete it',
          options: [
            {
              type: 'STRING',
              name: 'url',
              description: 'The url of the background',
              required: false,
            },
          ],
        },
        {
          type: 'SUB_COMMAND',
          name: 'rankcardcolor',
          description: 'Set rankcard color or delete it',
          options: [
            {
              type: 'STRING',
              name: 'hex',
              description: 'The hex of the color',
              required: false,
            },
          ],
        },
        {
          type: 'SUB_COMMAND',
          name: 'rankcardavatar',
          description: 'Set rankcard avatar shape',
          options: [
            {
              type: 'STRING',
              name: 'shape',
              description: 'The shape of the avatar',
              required: true,
              choices: [
                {
                  name: 'circle',
                  value: 'true',
                },
                {
                  name: 'square',
                  value: 'false',
                },
              ],
            },
          ],
        },
      ],
    },
  ],

  category: 'Moderation & Management',
  subcommands: ['leveling ignore'],
  run: async (client, interaction) => {
    if (interaction.options.getSubcommandGroup() === 'staff') {
      if (!interaction.member.permissions.has('MANAGE_GUILD'))
        return interaction.reply({ content: "You can't do that" });
      if (interaction.options.getSubcommand() === 'ignore') {
        let type = interaction.options.getString('type');
        let channel = interaction.options.getChannel('channel');
        let role = interaction.options.getRole('role');
        if (!channel && !role)
          return interaction.reply({
            content: 'select atleast one role or channel',
            ephemeral: true,
          });
        if (channel && role)
          return interaction.reply({
            content: 'select only one role or channel',
            ephemeral: true,
          });
        let id;
        if (role) {
          id = role.id;
        } else {
          id = channel.id;
        }
        let found = await levelingIgnore.findOne({
          guildID: interaction.guild.id,
          ID: id,
        });
        if (type === 'add') {
          if (found)
            return interaction.reply({
              content: `that ${
                role ? 'role' : 'channel'
              } already exists in database`,
              ephemeral: true,
            });
          let ignore = new levelingIgnore({
            guildID: interaction.guild.id,
            ID: id,
          });
          await ignore.save();
          interaction.reply({
            content: `added ${role ? role : channel} to ignore`,
          });
        }
        if (type === 'remove') {
          if (!found)
            return interaction.reply({
              content: `that ${
                role ? 'role' : 'channel'
              } doesn't exists in database`,
              ephemeral: true,
            });
          await levelingIgnore.findOneAndDelete({
            guildID: interaction.guild.id,
            ID: id,
          });
          interaction.reply({
            content: `removed ${role ? role : channel} from ignore`,
          });
        }
      }
      if (interaction.options.getSubcommand() === 'setlevel') {
        let user = interaction.options.getUser('user');
        let level = interaction.options.getNumber('level');
        let findUser = await leveling.findOne({
          userID: user.id,
          guildID: interaction.guildId,
        });
        if (!findUser) {
          let newUser = new leveling({
            userID: user.id,
            guildID: interaction.guildId,
            xp: level * level * 100,
            level: level,
          });
          await newUser
            .save()
            .catch((e) => console.log(`Failed to save new user.`));
        } else {
          findUser.level = level;
          findUser.xp = level * level * 100;
          findUser.lastUpdated = new Date();
          findUser
            .save()
            .catch((e) => console.log(`Failed to set level: ${e}`));
        }
        interaction.reply({
          content: `Successfully set **${user.username}**'s level to ${String(
            level
          )}`,
        });
      }
      if (interaction.options.getSubcommand() === 'setxp') {
        let user = interaction.options.getUser('user');
        let xp = interaction.options.getNumber('xp');
        let findUser = await leveling.findOne({
          userID: user.id,
          guildID: interaction.guildId,
        });
        if (!findUser) {
          let newUser = new leveling({
            userID: user.id,
            guildID: interaction.guildId,
            xp: xp,
            level: Math.floor(0.1 * Math.sqrt(xp)),
          });
          await newUser
            .save()
            .catch((e) => console.log(`Failed to save new user.`));
        } else {
          findUser.level = Math.floor(0.1 * Math.sqrt(xp));
          findUser.xp = xp;
          findUser.lastUpdated = new Date();
          findUser.save().catch((e) => console.log(`Failed to set xp: ${e}`));
        }
        interaction.reply({
          content: `Successfully set **${user.username}**'s xp to ${String(
            xp
          )}`,
        });
      }
      if (interaction.options.getSubcommand() === 'levelroles') {
        let findLevelRoles = await levelRoles.findOne({
          guildID: interaction.guildId,
        });
        if (interaction.options.getString('type') === 'view') {
          if (!findLevelRoles) {
            interaction.reply({ content: 'No level roles set' });
            return;
          }
          let RolesJson = findLevelRoles.levelRoles;
          let RolesObj = JSON.parse(RolesJson);
          let RolesMap = new Map(Object.entries(RolesObj));
          let Roles = Array.from(RolesMap.values());
          let RolesString = Roles.join('>, <@&');
          interaction.reply({ content: `Level Roles: <@&${RolesString}>` });
          return;
        }
        let level = interaction.options.getNumber('level');
        if (!level)
          return interaction.reply({
            content: 'Please enter a level',
            ephemeral: true,
          });
        if (interaction.options.getString('type') === 'add') {
          let role = interaction.options.getRole('role');
          if (!role)
            return interaction.reply({
              content: 'select a role',
              ephemeral: true,
            });
          if (!findLevelRoles) {
            let RoleObj = {};
            RoleObj[level] = role.id;
            let RolesJson = JSON.stringify(RoleObj);
            let newLevelRoles = new levelRoles({
              guildID: interaction.guildId,
              levelRoles: RolesJson,
            });
            await newLevelRoles
              .save()
              .catch((e) => console.log(`Failed to save new level roles.`));
          } else {
            let RolesJson = findLevelRoles.levelRoles;
            let RolesObj = JSON.parse(RolesJson);
            RolesObj[level] = role.id;
            RolesJson = JSON.stringify(RolesObj);
            findLevelRoles.levelRoles = RolesJson;
            findLevelRoles
              .save()
              .catch((e) => console.log(`Failed to set level roles: ${e}`));
          }
          interaction.reply({
            content: `Successfully set level ${level} to role ${role}`,
          });
        }
        if (interaction.options.getString('type') === 'remove') {
          if (!findLevelRoles) {
            interaction.reply({
              content: `No level roles set`,
              ephemeral: true,
            });
          } else {
            let RolesJson = findLevelRoles.levelRoles;
            let RolesObj = JSON.parse(RolesJson);
            delete RolesObj[level];
            RolesJson = JSON.stringify(RolesObj);
            findLevelRoles.levelRoles = RolesJson;
            findLevelRoles
              .save()
              .catch((e) => console.log(`Failed to set level roles: ${e}`));
            interaction.reply({
              content: `Successfully removed level ${level} from roles`,
            });
          }
        }
      }
    }
    if (interaction.options.getSubcommandGroup() === 'user') {
      let findUser = await levelUserSettings.findOne({
        userID: interaction.user.id,
        guildID: interaction.guildId,
      });
      if (interaction.options.getSubcommand() === 'levelupmsg') {
        if (findUser) {
          findUser.levelUpMsg = interaction.options.getString('change');
          findUser
            .save()
            .catch((e) => console.log(`Failed to set level up message: ${e}`));
        } else {
          let newUser = new levelUserSettings({
            userID: interaction.user.id,
            guildID: interaction.guildId,
            levelUpMsg: interaction.options.getString('change'),
          });
          await newUser
            .save()
            .catch((e) => console.log(`Failed to save new user.`));
        }
        interaction.reply({
          content: `Successfully ${interaction.options
            .getString('change')
            .replace('true', 'enabled')
            .replace('false', 'disabled')} level up message`,
        });
      }
      if (interaction.options.getSubcommand() === 'rankcardbg') {
        let image = interaction.options.getString('url');
        if (!image) {
          image = 'none';
        } else {
          let imageUrlRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/;
          if (!imageUrlRegex.test(image))
            return interaction.reply({
              content: 'Invalid URL',
              ephemeral: true,
            });
        }
        if (findUser) {
          findUser.rankcardBg = image;
          findUser
            .save()
            .catch((e) =>
              console.log(`Failed to set rank card background: ${e}`)
            );
        } else {
          let newUser = new levelUserSettings({
            userID: interaction.user.id,
            guildID: interaction.guildId,
            rankcardBg: image,
          });
          await newUser
            .save()
            .catch((e) => console.log(`Failed to save new user.`));
        }
        interaction.reply({
          content: `Successfully changed rankcard background to \`${image}\``,
        });
      }
      if (interaction.options.getSubcommand() === 'rankcardcolor') {
        let hex = interaction.options.getString('hex');
        if (!hex) {
          hex = '#5153F9';
        }
        if (!hex.startsWith('#')) {
          hex = `#${interaction.options.getString('hex')}`;
        }
        let hexRegex = /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/gi;
        if (!hexRegex.test(hex))
          return interaction.reply({
            content: 'Please enter a valid hex color',
            ephemeral: true,
          });
        if (findUser) {
          findUser.rankcardColor = hex;
          findUser
            .save()
            .catch((e) => console.log(`Failed to set rank card color: ${e}`));
        } else {
          let newUser = new levelUserSettings({
            userID: interaction.user.id,
            guildID: interaction.guildId,
            rankcardColor: hex,
          });
          await newUser
            .save()
            .catch((e) => console.log(`Failed to save new user.`));
        }
        interaction.reply({
          content: `Successfully changed rankcard color to \`${hex}\``,
        });
      }
      if (interaction.options.getSubcommand() === 'rankcardavatar') {
        if (findUser) {
          findUser.rankcardAvatar = interaction.options.getString('shape');
          findUser
            .save()
            .catch((e) => console.log(`Failed to set rank card avatar: ${e}`));
        } else {
          let newUser = new levelUserSettings({
            userID: interaction.user.id,
            guildID: interaction.guildId,
            rankcardAvatar: interaction.options.getString('shape'),
          });
          await newUser
            .save()
            .catch((e) => console.log(`Failed to save new user.`));
        }
        interaction.reply({
          content: `Successfully changed rankcard avatar to \`${interaction.options
            .getString('shape')
            .replace('true', 'circle')
            .replace('false', 'square')}\``,
        });
      }
    }
  },
});
