import {
  TextChannel,
  MessageEmbed,
  MessageButton,
  MessageActionRow,
} from 'discord.js';
import { Ticket } from '../../models/ticket/ticket';
import { Button } from '../../structures/Button';

export default new Button({
  customId: 'open_ticket',
  run: async (client, interaction) => {
    let TicketDocument = await Ticket.findOne({
      TicketChannelID: interaction.channel.id,
    });
    if (TicketDocument) {
      if (TicketDocument.TicketStatus !== 'Closed') return;
      interaction.deferUpdate();
      let ticketCreator = TicketDocument.TicketAuthorID;
      (interaction.channel as TextChannel).permissionOverwrites.create(
        ticketCreator,
        {
          SEND_MESSAGES: true,
          VIEW_CHANNEL: true,
        }
      );
      let ticketReopenEmbed = new MessageEmbed()
        .setTitle('Ticket Reopened')
        .setDescription(
          `The ticket has been reopened by ${interaction.user} \n \nClick 🔒 to close the ticket.`
        )
        .setThumbnail(interaction.guild.iconURL())
        .setTimestamp()
        .setColor('#7BE2CD');
      let close_btn = new MessageButton()
        .setStyle('SECONDARY')
        .setEmoji('🔒')
        .setLabel('Close')
        .setCustomId('close_ticket');
      let closerow = new MessageActionRow().addComponents([close_btn]);
      interaction.channel.send({
        embeds: [ticketReopenEmbed],
        components: [closerow],
      });
      TicketDocument.TicketStatus = 'Opened';
      await TicketDocument.save();
    }
  },
});
