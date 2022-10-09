import {
  ButtonBuilder,
  ButtonComponent,
  EmbedBuilder,
  MessageActionRowComponent,
} from 'discord.js';
import { Button } from '../../Structures/Button';

export default new Button({
  customId: 'AI_BTN_HELP_CMD',
  run: async (client, interaction) => {
    let AI = new EmbedBuilder()
      .setAuthor({
        name: 'Artificial Intelligence',
        iconURL: 'https://cdn.discordapp.com/emojis/926515055594455100.png',
      })
      .setColor(client.config.botColor)
      .setDescription(
        `${client.user?.username} has an advanced Artificial Intelligence. \n<:MM_arrowGREEN:932674760960245840> To chat, start by pinging the bot. \n(Example: <@${client.user?.id}> hello)`
      )
      .addFields({
        name: 'Special Features',
        value: '<:MM_arrowGREEN:932674760960245840> `joke, translate`',
        inline: false,
      });

    interaction.message.components[0].components[1] = ButtonBuilder.from(
      interaction.message.components[0].components[1] as ButtonComponent
    ).setDisabled(true).data as MessageActionRowComponent;

    interaction.message.components[0].components[0] = ButtonBuilder.from(
      interaction.message.components[0].components[0] as ButtonComponent
    ).setDisabled(false).data as MessageActionRowComponent;

    await interaction.update({
      embeds: [AI],
      components: interaction.message.components,
    });
  },
});
