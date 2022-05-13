import { MessageEmbed, PermissionResolvable } from 'discord.js';
import { client } from '../..';
import { Event } from '../../structures/Event';
import { ExtendedInteraction } from '../../typings/Command';
import { developerID } from '../../config.json';

export default new Event(
  client,
  'interactionCreate',
  async (interaction: ExtendedInteraction) => {
    // Chat Input Commands
    if (interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command)
        return interaction.reply('You have used a non existent command');

      // Developer Only Commands
      if (command.developersOnly) {
        if (!developerID.includes(interaction.user.id)) {
          let developersOnly_embed: MessageEmbed = new MessageEmbed()
            .setTitle(`:x: | Only Developers Can Use That Command!`)
            .setDescription(
              `Developers: ${developerID.map((v) => `<@${v}>`).join(', ')}`
            )
            .setColor('RED')
            .setFooter({
              text: `${client.user.tag}`,
              iconURL: `${client.user.displayAvatarURL({
                size: 4096,
                dynamic: true,
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
      let perms: PermissionResolvable;
      let MissingPermissionsArray: PermissionResolvable[];
      if (command.userPermissions?.length) {
        MissingPermissionsArray = [];
        for (perms of command.userPermissions) {
          if (
            !interaction.member.permissions.has(perms) ||
            (interaction.channel.type !== 'DM' &&
              !interaction.channel
                .permissionsFor(interaction.member)
                .has(perms))
          ) {
            MissingPermissionsArray.push(perms);
          }
        }
      }
      for (let i = 0; i < command.options?.length; i++) {
        if (
          command.options[i].userPermissions?.length &&
          (interaction.options?.getSubcommand() === command.options[i].name ||
            interaction.options?.getSubcommandGroup() ===
              command.options[i].name)
        ) {
          if (!MissingPermissionsArray) {
            MissingPermissionsArray = [];
          }
          for (perms of command.options[i].userPermissions) {
            if (
              !interaction.member.permissions.has(perms) ||
              (interaction.channel.type !== 'DM' &&
                !interaction.channel
                  .permissionsFor(interaction.member)
                  .has(perms))
            ) {
              MissingPermissionsArray.push(perms);
            }
          }
        }
      }
      if (MissingPermissionsArray?.length) {
        const MissingPermissionsEmbed = new MessageEmbed()
          .setColor(client.config.errColor)
          .setDescription(
            ` You're missing the following permission(s): \n\`${MissingPermissionsArray.map(
              (x) => x
            ).join(', ')}\``
          );
        interaction.reply({
          embeds: [MissingPermissionsEmbed],
          ephemeral: true,
        });
        return;
      }

      command.run(client, interaction);
    }
  }
);
