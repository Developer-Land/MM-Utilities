import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
  GuildTextBasedChannel,
  MessageActionRowComponentBuilder,
} from 'discord.js';
import { Command } from '../../Structures/Command';

export default new Command({
  name: 'createpanel',
  description: 'Create ticketpanel',
  options: [
    {
      name: 'channel',
      description: 'Channel to send the ticket panel message',
      type: ApplicationCommandOptionType.Channel,
      channelTypes: [ChannelType.GuildText],
      required: true,
    },
  ],

  userPermissions: ['Administrator'],
  category: 'Moderation & Management',
  run: async (client, interaction) => {
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({
        content: 'You dont have permissions to setup a ticket system',
        ephemeral: true,
      });
    }
    let channel = interaction.options.getChannel(
      'channel'
    ) as GuildTextBasedChannel;
    let ticketbtn = new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('919904410803519498')
      .setLabel('Create Ticket')
      .setCustomId('create_ticket');
    let a =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([
        ticketbtn,
      ]);
    let embed = new EmbedBuilder()
      .setTitle('Help & Support')
      .setDescription(
        'Click <:MM_tickets:919904410803519498> to create/open a new ticket.'
      )
      .setColor(client.config.botColor)
      .setImage(
        'https://cdn.discordapp.com/attachments/911913804110102548/919917341012279336/20211213_171235.jpg'
      );
    interaction.reply('Done. Setting Ticket to that channel');
    channel.send({ embeds: [embed], components: [a] });
  },
});
