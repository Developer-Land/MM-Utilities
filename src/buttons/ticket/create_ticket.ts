import {
  TextChannel,
  MessageEmbed,
  MessageButton,
  MessageActionRow,
} from 'discord.js';
import { Ticket } from '../../models/ticket/ticket';
import { Button } from '../../structures/Button';

export default new Button({
  customId: 'create_ticket',
  run: async (client, interaction) => {
    let ticketname = `ticket_${interaction.user.username}`;
    let topic = `Ticket opened by ${interaction.user.username}`;
    let antispamo = interaction.guild.channels.cache.find(
      (ch: TextChannel) => ch.topic === topic
    );
    if (antispamo) {
      interaction.reply({
        content:
          'You already have a ticket opened.. Please delete it before opening another ticket.',
        ephemeral: true,
      });
    } else if (!antispamo) {
      let chparent = '907221628532949052';
      let categ = interaction.guild.channels.cache.get('907221628532949052');
      if (!categ) {
        chparent = null;
      }
      interaction.guild.channels
        .create(ticketname, {
          type: 'GUILD_TEXT',
          topic: topic,
          parent: chparent,
          permissionOverwrites: [
            {
              id: interaction.guild.roles.everyone,
              deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'], //Deny permissions
              allow: ['ATTACH_FILES'],
            },
            {
              id: interaction.user.id,
              allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
            },
          ],
        })
        .then((ch) => {
          let lep = ['882253713111154700'];
          lep.forEach((e) => {
            ch.permissionOverwrites.create(e, {
              VIEW_CHANNEL: true,
              SEND_MESSAGES: true,
              READ_MESSAGE_HISTORY: true,
            });
          });

          let ticketOpenEmbed = new MessageEmbed()
            .setTitle('Ticket Created')
            .setDescription(
              `Ticket has been raised by ${interaction.user}. We ask the Staffs to summon here\n**User ID**: \`${interaction.user.id}\` | **Username**: \`${interaction.user.tag}\``
            )
            .setThumbnail(interaction.guild.iconURL())
            .setTimestamp()
            .setColor('#F5CE42');

          let close_btn = new MessageButton()
            .setStyle('SECONDARY')
            .setEmoji('🔒')
            .setLabel('Close')
            .setCustomId('close_ticket');

          let closerow = new MessageActionRow().addComponents([close_btn]);

          ch.send({
            content: `${interaction.user} \nSupport Team: <@&882253713111154700>`,
            embeds: [ticketOpenEmbed],
            components: [closerow],
          }).then(async (msg) => {
            await msg.pin();
            interaction.reply({
              content: `Created Ticket check ${ch}`,
              ephemeral: true,
            });
            let TicketNumberDocument = await Ticket.findOne({
              _id: '61b7772d0dafa4b853accb79',
            });
            TicketNumberDocument.TicketNumber = String(
              parseInt(TicketNumberDocument.TicketNumber) + 1
            );
            await TicketNumberDocument.save();
            new Ticket({
              TicketChannelID: ch.id,
              TicketMessageID: msg.id,
              TicketAuthorID: interaction.user.id,
              TicketReason: 'None',
              TicketStatus: 'Opened',
              TicketNumber: TicketNumberDocument.TicketNumber,
            }).save();
          });
        });
    }
  },
});
