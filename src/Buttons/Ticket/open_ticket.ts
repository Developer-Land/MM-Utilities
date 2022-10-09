import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
  TextChannel,
} from 'discord.js';
import { Ticket } from '../../Models/Ticket/ticket';
import { Button } from '../../Structures/Button';

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
          SendMessages: true,
          ViewChannel: true,
        }
      );
      let ticketReopenEmbed = new EmbedBuilder()
        .setTitle('Ticket Reopened')
        .setDescription(
          `The ticket has been reopened by ${interaction.user} \n \nClick 🔒 to close the ticket.`
        )
        .setThumbnail(interaction.guild.iconURL())
        .setTimestamp()
        .setColor('#7BE2CD');
      let close_btn = new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('🔒')
        .setLabel('Close')
        .setCustomId('close_ticket');
      let closerow =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([
          close_btn,
        ]);
      interaction.channel.send({
        embeds: [ticketReopenEmbed],
        components: [closerow],
      });
      TicketDocument.TicketStatus = 'Opened';
      await TicketDocument.save();
    }
  },
});
