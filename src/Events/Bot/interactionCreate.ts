import {
  ApplicationCommandOptionType,
  ColorResolvable,
  EmbedBuilder,
  GuildMemberRoleManager,
  GuildTextBasedChannel,
  Interaction,
  Message,
  PermissionsBitField,
} from 'discord.js';
import { client } from '../../index';
import { Event } from '../../Structures/Event';
import { ExtendedButtonInteraction } from '../../Typings/Button';
import { ExtendedCommandInteraction } from '../../Typings/Command';
import { ExtendedSelectMenuInteraction } from '../../Typings/SelectMenu';
const { DeveloperIDs } = client.config;

export default new Event(
  client,
  'interactionCreate',
  async (interaction: Interaction) => {
    // Chat Input Commands
    if (interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command)
        return interaction.reply('You have used a non existent command');

      // Developer Only Commands
      if (command.developersOnly) {
        if (!DeveloperIDs.includes(interaction.user.id)) {
          let developersOnly_embed = new EmbedBuilder()
            .setTitle(`:x: | Only Developers Can Use That Command!`)
            .setDescription(
              `Developers: ${DeveloperIDs.map((v) => `<@${v}>`).join(', ')}`
            )
            .setColor(client.config.botColor)
            .setFooter({
              text: `${client.user.tag}`,
              iconURL: `${client.user.displayAvatarURL({
                size: 4096,
              })}`,
            })
            .setTimestamp();
          return interaction.reply({
            embeds: [developersOnly_embed],
            ephemeral: true,
          });
        }
      }

      // User Permissions
      if (
        !interaction.memberPermissions.has(
          PermissionsBitField.resolve(command.userPermissions || [])
        ) ||
        !(interaction.channel as GuildTextBasedChannel)
          .permissionsFor((interaction as ExtendedCommandInteraction).member)
          .has(PermissionsBitField.resolve(command.userPermissions || []))
      ) {
        const MissingPermissionsEmbed = new EmbedBuilder()
          .setColor(client.config.errColor as ColorResolvable)
          .setDescription(
            ` You're missing the following permission(s): \n\`${command.userPermissions
              .map((x) => x)
              .join(', ')}\``
          );
        interaction.reply({
          embeds: [MissingPermissionsEmbed],
          ephemeral: true,
        });
        return;
      }

      command
        .run(client, interaction as ExtendedCommandInteraction)
        .catch((error) => {
          if (!interaction.replied) {
            interaction.reply({
              content: 'An error has occured, tell a developer',
              ephemeral: true,
            });
          } else {
            interaction.followUp({
              content: 'An error has occured, tell a developer',
              ephemeral: true,
            });
          }
          console.log(error);
          console.log(error.code || `no code`);
          const channel = client.channels.cache.get(
            '931459849097719808'
          ) as GuildTextBasedChannel;
          channel.send(
            `\`\`\`yaml\nerror -> ${error} \n\nGuild -> ${
              interaction.guild.name
            } \n\nInteraction Author -> ${interaction.user.id} || ${
              interaction.user.username
            } \n\nInteraction Type -> Command
             \n\nInteraction Name -> ${
               interaction.commandName
             } \n\nInteraction Options -> ${
              interaction.options?.data.length === 0
                ? 'No options provided'
                : interaction.options?.data
                    .map((x) =>
                      x.type === ApplicationCommandOptionType.SubcommandGroup
                        ? x.name +
                          ' ' +
                          x.options.map(
                            (y) =>
                              y.name +
                              ' ' +
                              y.options
                                .map((z) => z.name + ': ' + z.value)
                                .join(', ')
                          )
                        : x.type === ApplicationCommandOptionType.Subcommand
                        ? x.name +
                          ' ' +
                          x.options
                            .map((y) => y.name + ': ' + y.value)
                            .join(', ')
                        : x.name + ': ' + x.value
                    )
                    .join(', ')
            } \n\nerror code -> ${error.code || 'No code'}\`\`\``
          );
        });
    }

    // Button Handling
    if (interaction.isButton()) {
      let button = client.buttons.get(interaction.customId);
      if (!button) {
        for (const x of client.buttons.values()) {
          let buttonRegex = new RegExp(`^${x.customId}$`, 'gi');
          let matches = buttonRegex.exec(interaction.customId);
          if (matches?.length === 1) {
            button = client.buttons.get(x.customId);
          }
        }
      }
      if (button) {
        if (
          !interaction.memberPermissions.has(
            PermissionsBitField.resolve(button.userPermissions || [])
          ) ||
          !(interaction.channel as GuildTextBasedChannel)
            .permissionsFor((interaction as ExtendedButtonInteraction).member)
            .has(PermissionsBitField.resolve(button.userPermissions || []))
        ) {
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.errColor as ColorResolvable)
                .setDescription(
                  ` You're missing the following permission(s): \n\`${button.userPermissions
                    .map((x) => x)
                    .join(', ')}\``
                ),
            ],
            ephemeral: true,
          });
          return;
        }
        button
          .run(client, interaction as ExtendedButtonInteraction)
          .catch((error) => {
            if (!interaction.replied) {
              interaction.reply({
                content: 'An error has occured, tell a developer',
                ephemeral: true,
              });
            } else {
              interaction.followUp({
                content: 'An error has occured, tell a developer',
                ephemeral: true,
              });
            }
            console.log(error);
            console.log(error.code || `no code`);
            const channel = client.channels.cache.get(
              '931459849097719808'
            ) as GuildTextBasedChannel;
            channel.send(
              `\`\`\`yaml\nerror -> ${error} \n\nGuild -> ${
                interaction.guild.name
              } \n\nInteraction Author -> ${interaction.user.id} || ${
                interaction.user.username
              } \n\nInteraction Type -> Button
              \n\nInteraction Name -> ${
                interaction.customId
              } \n\nerror code -> ${error.code || 'No code'}\`\`\``
            );
          });
      }
    }

    // Select Menu Handling
    if (interaction.isSelectMenu()) {
      const selectMenu = client.selectmenus.get(interaction.customId);
      if (selectMenu) {
        if (
          !interaction.memberPermissions.has(
            PermissionsBitField.resolve(selectMenu.userPermissions || [])
          ) ||
          !(interaction.channel as GuildTextBasedChannel)
            .permissionsFor(
              (interaction as ExtendedSelectMenuInteraction).member
            )
            .has(PermissionsBitField.resolve(selectMenu.userPermissions || []))
        ) {
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.errColor as ColorResolvable)
                .setDescription(
                  ` You're missing the following permission(s): \n\`${selectMenu.userPermissions
                    .map((x) => x)
                    .join(', ')}\``
                ),
            ],
            ephemeral: true,
          });
          return;
        }
        selectMenu
          .run(client, interaction as ExtendedSelectMenuInteraction)
          .catch((error) => {
            if (!interaction.replied) {
              interaction.reply({
                content: 'An error has occured, tell a developer',
                ephemeral: true,
              });
            } else {
              interaction.followUp({
                content: 'An error has occured, tell a developer',
                ephemeral: true,
              });
            }
            console.log(error);
            console.log(error.code || `no code`);
            const channel = client.channels.cache.get(
              '931459849097719808'
            ) as GuildTextBasedChannel;
            channel.send(
              `\`\`\`yaml\nerror -> ${error} \n\nGuild -> ${
                interaction.guild.name
              } \n\nInteraction Author -> ${interaction.user.id} || ${
                interaction.user.username
              } \n\nInteraction Type -> Select Menu
              \n\nInteraction Name -> ${
                interaction.customId
              } \n\nerror code -> ${error.code || 'No code'}\`\`\``
            );
          });
      }
    }

    // Button Role handling
    if (interaction.isButton()) {
      const customIds = interaction.customId.split(' ');
      const roles = customIds.map((x) => x.replace(/a|r|t/g, ''));

      const reply = (replyMessage: string) => {
        interaction.reply({
          content: replyMessage,
          ephemeral: true,
        });
      };

      //add type
      if (
        interaction.customId === roles[0] + 'a' ||
        interaction.customId === `${roles[0]}a ${roles[1]}a` ||
        interaction.customId === `${roles[0]}a ${roles[1]}a ${roles[2]}a` ||
        interaction.customId ===
          `${roles[0]}a ${roles[1]}a ${roles[2]}a ${roles[3]}a` ||
        interaction.customId ===
          `${roles[0]}a ${roles[1]}a ${roles[2]}a ${roles[3]}a ${roles[4]}a`
      ) {
        const changes = [];
        let editEmbed = interaction.message.embeds[0];
        let RoleName;
        roles.forEach((r, i) => {
          if (
            !(interaction.member.roles as GuildMemberRoleManager).cache.has(r)
          ) {
            (interaction.member.roles as GuildMemberRoleManager).add(r);
            changes.push('<:plus:930205440728510465> <@&' + r + '>');
            RoleName = interaction.guild.roles.cache.get(r).name;
            editEmbed.fields[0] = {
              name: `${RoleName} Members`,
              value: `${
                interaction.guild.members.cache.filter((member) =>
                  member.roles.cache.has(r)
                ).size
              }/${
                interaction.guild.members.cache.filter(
                  (member) => !member.user.bot
                ).size
              }`,
              inline: false,
            };
          }
        });
        if (!changes.length) reply('No role changes were made!');
        else {
          reply(`Roles updated!\n${changes.join('\n')}`);
          (interaction.message as Message).edit({ embeds: [editEmbed] });
        }
        return;
      }

      //remove type
      if (
        interaction.customId === roles[0] + 'r' ||
        interaction.customId === `${roles[0]}r ${roles[1]}r` ||
        interaction.customId === `${roles[0]}r ${roles[1]}r ${roles[2]}r` ||
        interaction.customId ===
          `${roles[0]}r ${roles[1]}r ${roles[2]}r ${roles[3]}r` ||
        interaction.customId ===
          `${roles[0]}r ${roles[1]}r ${roles[2]}r ${roles[3]}r ${roles[4]}r`
      ) {
        const changes = [];
        let editEmbed = interaction.message.embeds[0];
        let RoleName;
        roles.forEach((r) => {
          if (
            (interaction.member.roles as GuildMemberRoleManager).cache.has(r)
          ) {
            (interaction.member.roles as GuildMemberRoleManager).remove(r);
            changes.push('<:minus:930205412597301281> <@&' + r + '>');
            RoleName = interaction.guild.roles.cache.get(r).name;
            editEmbed.fields[0] = {
              name: `${RoleName} Members`,
              value: `${
                interaction.guild.members.cache.filter((member) =>
                  member.roles.cache.has(r)
                ).size
              }/${
                interaction.guild.members.cache.filter(
                  (member) => !member.user.bot
                ).size
              }`,
              inline: false,
            };
          }
        });
        if (!changes.length) reply('No role changes were made!');
        else {
          reply(`Roles updated!\n${changes.join('\n')}`);
          (interaction.message as Message).edit({ embeds: [editEmbed] });
        }
        return;
      }

      //toggle type
      if (
        interaction.customId === roles[0] + 't' ||
        interaction.customId === `${roles[0]}t ${roles[1]}t` ||
        interaction.customId === `${roles[0]}t ${roles[1]}t ${roles[2]}t` ||
        interaction.customId ===
          `${roles[0]}t ${roles[1]}t ${roles[2]}t ${roles[3]}t` ||
        interaction.customId ===
          `${roles[0]}t ${roles[1]}t ${roles[2]}t ${roles[3]}t ${roles[4]}t`
      ) {
        const changes = [];
        if (
          !(interaction.member.roles as GuildMemberRoleManager).cache.has(
            roles[0]
          )
        ) {
          roles.forEach((r) => {
            if (
              !(interaction.member.roles as GuildMemberRoleManager).cache.has(r)
            ) {
              (interaction.member.roles as GuildMemberRoleManager).add(r);
              changes.push('<:plus:930205440728510465> <@&' + r + '>');
            }
          });
        }
        if (!changes.length) {
          roles.forEach((r) => {
            if (
              (interaction.member.roles as GuildMemberRoleManager).cache.has(r)
            ) {
              (interaction.member.roles as GuildMemberRoleManager).remove(r);
              changes.push('<:minus:930205412597301281> <@&' + r + '>');
            }
          });
        }
        return reply(`Roles updated!\n${changes.join('\n')}`);
      }
    }
  }
);
