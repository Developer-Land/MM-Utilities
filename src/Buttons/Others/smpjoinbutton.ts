import { MessageEmbed } from 'discord.js';
import { Button } from '../../Structures/Button';

export default new Button({
  customId: 'smpjoinbutton',
  run: async (client, interaction) => {
    let smpinfo = new MessageEmbed()
      .setAuthor({
        name: 'Here you go!',
        iconURL:
          'https://cdn.discordapp.com/attachments/914596197551976518/915543218391773224/20211201_153108.png',
      })
      .setDescription('https://smp.mmgamer.ml')
      .setColor('#37B3C8');

    await interaction.reply({ embeds: [smpinfo], ephemeral: true });
  },
});
