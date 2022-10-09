import { Command } from '../../Structures/Command';

import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
  Role,
} from 'discord.js';

export default new Command({
  name: 'inrole',
  description: 'check users on a role',
  options: [
    {
      name: 'role',
      description: 'the role you want to check',
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
  ],
  category: 'Info',
  run: async (_client, interaction) => {
    let backButton = new ButtonBuilder({
      style: ButtonStyle.Secondary,
      label: 'Back',
      emoji: '⬅️',
      customId: 'inroleBack',
    });
    let forwardButton = new ButtonBuilder({
      style: ButtonStyle.Secondary,
      label: 'Forward',
      emoji: '➡️',
      customId: 'inroleForward',
    });
    let role = interaction.options.getRole('role') as Role;
    let RoleMembers = [...role.members.values()];
    let generateEmbed = async (start: number) => {
      let current = RoleMembers.slice(start, start + 10);
      return new EmbedBuilder({
        title: `Showing members from ${role.name} role ${start + 1}-${
          start + current.length
        } out of ${role.members.size}`,
        color: role.color,
        fields: await Promise.all(
          current.map(async (m) => ({
            name: m.user.tag,
            value: `**ID:** ${m.user.id}`,
          }))
        ),
      });
    };
    let canFitOnOnePage = RoleMembers.length <= 10;
    let embedMessage = await interaction.reply({
      embeds: [await generateEmbed(0)],
      components: canFitOnOnePage
        ? []
        : [
            new ActionRowBuilder<MessageActionRowComponentBuilder>({
              components: [forwardButton],
            }),
          ],
    });
    if (canFitOnOnePage) return;
    let filter = (inrole) => inrole.user.id === interaction.user.id;
    let collector = interaction.channel.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter,
      time: 20000,
    });
    let currentIndex = 0;
    collector.on('collect', async (inrole) => {
      if (inrole.customId === 'inroleBack') {
        currentIndex -= 10;
        await inrole.update({
          embeds: [await generateEmbed(currentIndex)],
          components: [
            new ActionRowBuilder<MessageActionRowComponentBuilder>({
              components: [
                // back button if it isn't the start
                ...(currentIndex ? [backButton] : []),
                // forward button if it isn't the end
                ...(currentIndex + 10 < RoleMembers.length
                  ? [forwardButton]
                  : []),
              ],
            }),
          ],
        });
      } else if (inrole.customId === 'inroleForward') {
        currentIndex += 10;
        await inrole.update({
          embeds: [await generateEmbed(currentIndex)],
          components: [
            new ActionRowBuilder<MessageActionRowComponentBuilder>({
              components: [
                // back button if it isn't the start
                ...(currentIndex ? [backButton] : []),
                // forward button if it isn't the end
                ...(currentIndex + 10 < RoleMembers.length
                  ? [forwardButton]
                  : []),
              ],
            }),
          ],
        });
      } else {
        collector.stop('not valid button');
      }
    });
  },
});
