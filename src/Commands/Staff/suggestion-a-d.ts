import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  GuildTextBasedChannel,
} from 'discord.js';
import { Command } from '../../Structures/Command';

export default new Command({
  name: 'suggestion',
  description: 'Approve/Decline a suggestion',
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'approve',
      description: 'Approve a good suggestion',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'message',
          description: 'The ID of the suggestion you want to approve',
          required: true,
        },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'decline',
      description: 'decline a suggestion',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'message',
          description: 'The ID of the suggestion you want to decline',
          required: true,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: 'reason',
          description: 'The reason',
          required: true,
        },
      ],
    },
  ],

  userPermissions: ['ManageGuild'],
  category: 'Moderation & Management',
  subcommands: ['suggestion approve', 'suggestion decline'],
  run: async (client, interaction) => {
    let { options, guild, user } = interaction;

    let errEmbed = new EmbedBuilder().setColor(client.config.errColor);

    let messageId = options.getString('message');
    let channel = guild.channels.cache.find(
      (c) => c.name === 'suggestions'
    ) as GuildTextBasedChannel;
    let targetMessage = await channel.messages.fetch({
      message: messageId,
      cache: true,
      force: true,
    });

    if (!targetMessage) {
      errEmbed.setDescription('Invalid message ID.');
      interaction.reply({
        embeds: [errEmbed],
        ephemeral: true,
      });
      return;
    }

    if (targetMessage.author.id !== client.user?.id) {
      errEmbed.setDescription('Unknown suggestion!');
      interaction.reply({
        embeds: [errEmbed],
        ephemeral: true,
      });
      return;
    }

    let SE = targetMessage.embeds[0];

    if (options.getSubcommand() === 'approve') {
      let approvedEmbed = new EmbedBuilder()
        .setAuthor({
          name: SE.author.name,
          iconURL:
            'https://cdn.discordapp.com/attachments/911913804110102548/932925444590796830/916464124177829929.png',
        })
        .setTitle(SE.title.replace('Pending', 'Approved'))
        .setDescription(SE.description)
        .setFooter({
          text: `Approved by ${user.tag}`,
          iconURL: user.displayAvatarURL({ size: 512 }),
        })
        .setColor('#31FF6B');

      targetMessage.edit({ embeds: [approvedEmbed] });
      interaction.reply({
        content: `You approved ${SE.author.name}'s suggestion!`,
        ephemeral: true,
      });
      return;
    }

    if (options.getSubcommand() === 'decline') {
      let approvedEmbed = new EmbedBuilder()
        .setAuthor({
          name: SE.author.name,
          iconURL:
            'https://cdn.discordapp.com/attachments/911913804110102548/932925481655877692/916464040635662346.png',
        })
        .setTitle(SE.title.replace('Pending', 'Declined'))
        .setDescription(SE.description)
        .setFooter({
          text: `Declined by ${user.tag}`,
          iconURL: user.displayAvatarURL({ size: 512 }),
        })
        .addFields({ name: 'Reason:', value: options.getString('reason') })
        .setColor('#FF3232');

      targetMessage.edit({ embeds: [approvedEmbed] });
      interaction.reply({
        content: `You declined ${SE.author.name}'s suggestion!`,
        ephemeral: true,
      });
      return;
    }
  },
});
