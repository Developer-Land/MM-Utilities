import { Command } from '../../structures/Command';

import {
  ColorResolvable,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  Role,
} from 'discord.js';

export default new Command({
  name: 'inrole',
  description: 'check users on a role',
  options: [
    {
      name: 'role',
      description: 'the role you want to check',
      type: 'ROLE',
      required: true,
    },
  ],
  category: 'Info',
  run: async (_client, interaction) => {
    let backButton = new MessageButton({
      style: 'SECONDARY',
      label: 'Back',
      emoji: '⬅️',
      customId: 'inroleBack',
    });
    let forwardButton = new MessageButton({
      style: 'SECONDARY',
      label: 'Forward',
      emoji: '➡️',
      customId: 'inroleForward',
    });
    let role = interaction.options.getRole('role') as Role;
    let RoleMembers = [...role.members.values()];
    let generateEmbed = async (start: number) => {
      let current = RoleMembers.slice(start, start + 10);
      return new MessageEmbed({
        title: `Showing members from role ${start + 1}-${
          start + current.length
        } out of ${role.members.size}`,
        color: role.hexColor.replace('#', '0x') as ColorResolvable,
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
        : [new MessageActionRow({ components: [forwardButton] })],
    });
    if (canFitOnOnePage) return;
    let filter = (inrole) => inrole.user.id === interaction.user.id;
    let collector = interaction.channel.createMessageComponentCollector({
      componentType: 'BUTTON',
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
            new MessageActionRow({
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
            new MessageActionRow({
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
