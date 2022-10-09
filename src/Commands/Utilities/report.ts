import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  GuildTextBasedChannel,
} from 'discord.js';
import { Command } from '../../Structures/Command';

export default new Command({
  name: 'report',
  description: 'Report a user',
  options: [
    {
      name: 'target',
      description: 'The user you want to report',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'reason',
      description: 'Input reason here',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  category: 'Utilities',
  run: async (client, interaction) => {
    let user = interaction.options.getUser('target');
    let reason = interaction.options.getString('reason');
    if (user.id === interaction.member.id)
      return interaction.reply({
        content: "You can't report yourself, silly!",
        ephemeral: true,
      });
    let channel = interaction.guild.channels.cache.get(
      '913129319063232533'
    ) as GuildTextBasedChannel;
    let reportEmbed = new EmbedBuilder()
      .setAuthor({
        name: `${interaction.user.tag} (ID: ${interaction.member.id})`,
        iconURL: `${interaction.member.user.displayAvatarURL({
          size: 64,
        })}`,
      })
      .setColor(client.config.botColor)
      .addFields(
        {
          name: '🔎 Reported:',
          value: `${client.users.cache.get(user.id).tag} (ID: ${user.id})`,
        },
        { name: '📃 Reason:', value: `${reason}` },
        { name: '🗨️ Channel:', value: `${interaction.channel}` }
      );

    channel.send({
      content: `${interaction.member} reported ${user}`,
      embeds: [reportEmbed],
    });
    interaction.reply({
      content: 'User reported to the proper authorities!',
      ephemeral: true,
    });
  },
});
