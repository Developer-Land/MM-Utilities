import { MessageActionRow, MessageActionRowComponent } from 'discord.js';
import { Button } from '../../Structures/Button';

export default new Button({
  customId: 'appeal_for_rewards_claimed_button',
  run: async (client, interaction) => {
    interaction.message.components[0].components[0] = (
      interaction.message.components[0]
        .components[0] as MessageActionRowComponent
    ).setDisabled(true);
    interaction.update({
      components: interaction.message.components as MessageActionRow[],
    });
  },
});
