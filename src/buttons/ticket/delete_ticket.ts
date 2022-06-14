import { createTranscript } from 'discord-html-transcripts';
import { TextChannel, Message, MessageEmbed } from 'discord.js';
import { Ticket } from '../../models/ticket/ticket';
import { Button } from '../../structures/Button';

export default new Button({
  customId: 'delete_ticket',
  run: async (client, interaction) => {
    let TicketDocument = await Ticket.findOne({
      TicketChannelID: interaction.channel.id,
    });
    if (TicketDocument) {
      if (TicketDocument.TicketStatus !== 'Closed') return;
      let attach = await createTranscript(interaction.channel as TextChannel, {
        fileName: `${
          (interaction.channel as TextChannel).name
        }_transcript.html`,
      });
      interaction.reply({
        content: 'Deleting the ticket and channel.. Please wait.',
      });
      let logch = (interaction.message as Message).guild.channels.cache.get(
        '903877432887623720'
      ) as TextChannel;
      let Channel = interaction.channel as TextChannel;
      if (logch) {
        let embbb = new MessageEmbed()
          .setTitle('Ticket Deleted!')
          .setDescription(
            `Ticket just got deleted by *<@${interaction.user.id}>* | Username: ***${interaction.user.tag}***\n\nTicket Channel Name: \`${Channel.name}\` | Ticket Channel ID: \`${interaction.channel.id}\`\n${Channel.topic}`
          )
          .setTimestamp()
          .setColor('#7BE2CD');
        setTimeout(async () => {
          logch.send({ embeds: [embbb], components: [] }).then((c) => {
            c.channel.send({
              content: `***Transcript:*** \`#${Channel.name}\``,
              files: [attach],
            });
          });
        }, 3000);
      }
      setTimeout(() => {
        let delch = (interaction.message as Message).guild.channels.cache.get(
          (interaction.message as Message).channel.id
        );
        delch.delete().catch((err) => {
          console.log(err);
        });
      }, 2000);
      await Ticket.findOneAndDelete({
        TicketChannelID: Channel.id,
      });
    }
  },
});
