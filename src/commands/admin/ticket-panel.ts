import {
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  GuildTextBasedChannel,
} from 'discord.js';
import { Command } from '../../structures/Command';

export default new Command({
  name: 'createpanel',
  description: 'Create ticketpanel',
  options: [
    {
      name: 'channel',
      description: 'Channel to send the ticket panel message',
      type: 'CHANNEL',
      channelTypes: ['GUILD_TEXT'],
      required: true,
    },
  ],

  userPermissions: ['ADMINISTRATOR'],
  category: 'Moderation & Management',
  run: async (client, interaction) => {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply({
        content: 'You dont have permissions to setup a ticket system',
        ephemeral: true,
      });
    }
    let channel = interaction.options.getChannel(
      'channel'
    ) as GuildTextBasedChannel;
    let ticketbtn = new MessageButton()
      .setStyle('SECONDARY')
      .setEmoji('919904410803519498')
      .setLabel('Create Ticket')
      .setCustomId('create_ticket');
    let a = new MessageActionRow().addComponents([ticketbtn]);
    let embed = new MessageEmbed()
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
