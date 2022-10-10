import { ActionRowBuilder, MessageActionRowComponentBuilder } from 'discord.js';
import { Button } from '../../Structures/Button';

export default new Button({
  customId: 'appeal_for_rewards_claimed_button',
  run: async (client, interaction) => {
    let row = ActionRowBuilder.from(
      interaction.message.components[0]
    ) as ActionRowBuilder<MessageActionRowComponentBuilder>;
    row.components[0] = row.components[0].setDisabled(true);

    interaction.update({
      components: [row],
    });
  },
});
