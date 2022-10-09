import { ChannelType, EmbedBuilder } from 'discord.js';
import { Command } from '../../Structures/Command';

export default new Command({
  name: 'serverinfo',
  description: "Shows information about MM Gamer's server",
  category: 'Info',
  run: async (client, interaction) => {
    let ServerInfoEmbed = new EmbedBuilder()
      .setAuthor({
        name: `${interaction.guild.name}`,
        iconURL: `${interaction.guild.iconURL({ size: 64 })}`,
      })
      .setColor(client.config.botColor)
      .setThumbnail(`${interaction.guild.iconURL({ size: 4096 })}`)
      .setFooter({ text: `ID: ${interaction.guild.id}` })
      .addFields(
        {
          name: 'Owner:',
          value: `> \<@${interaction.guild.ownerId}\>`,
        },
        {
          name: 'Members:',
          value: `> Humans: ${
            interaction.guild.members.cache.filter((member) => !member.user.bot)
              .size
          } \n> Bots: ${
            interaction.guild.members.cache.filter((member) => member.user.bot)
              .size
          }  `,
        },
        {
          name: 'Roles:',
          value: `> ${interaction.guild.roles.cache.size}`,
        },
        {
          name: 'Channels:',
          value: `> Text: ${
            interaction.guild.channels.cache.filter(
              (c) => c.type === ChannelType.GuildText
            ).size
          } \n> Voice: ${
            interaction.guild.channels.cache.filter(
              (c) => c.type === ChannelType.GuildVoice
            ).size
          } \n> Categories: ${
            interaction.guild.channels.cache.filter(
              (c) => c.type === ChannelType.GuildCategory
            ).size
          }`,
        },
        {
          name: 'Time Created:',
          value: interaction.guild.createdAt.toLocaleString(),
        }
      );

    interaction.reply({ embeds: [ServerInfoEmbed] });
  },
});
