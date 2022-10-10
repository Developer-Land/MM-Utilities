import {
  ActionRowBuilder,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
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

    let row = ActionRowBuilder.from(
      interaction.message.components[0]
    ) as ActionRowBuilder<MessageActionRowComponentBuilder>;
    row.components[1] = row.components[1].setDisabled(true);
    row.components[0] = row.components[0].setDisabled(false);

    await interaction.update({
      embeds: [AI],
      components: [row],
    });
  },
});
