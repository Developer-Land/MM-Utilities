import {
  MessageActionRow,
  MessageActionRowComponent,
  MessageEmbed,
} from 'discord.js';
import { Button } from '../../Structures/Button';

export default new Button({
  customId: 'AI_BTN_HELP_CMD',
  run: async (client, interaction) => {
    let AI = new MessageEmbed()
      .setAuthor({
        name: 'Artificial Intelligence',
        iconURL: 'https://cdn.discordapp.com/emojis/926515055594455100.png',
      })
      .setColor(client.config.botColor)
      .setDescription(
        `${client.user?.username} has an advanced Artificial Intelligence. \n<:MM_arrowGREEN:932674760960245840> To chat, start by pinging the bot. \n(Example: <@${client.user?.id}> hello)`
      )
      .addField(
        'Special Features',
        '<:MM_arrowGREEN:932674760960245840> `joke, translate`'
      );

    interaction.message.components[0].components[1] = (
      interaction.message.components[0]
        .components[1] as MessageActionRowComponent
    ).setDisabled(true);
    interaction.message.components[0].components[0] = (
      interaction.message.components[0]
        .components[0] as MessageActionRowComponent
    ).setDisabled(false);
    await interaction.update({
      embeds: [AI],
      components: interaction.message.components as MessageActionRow[],
    });
  },
});
