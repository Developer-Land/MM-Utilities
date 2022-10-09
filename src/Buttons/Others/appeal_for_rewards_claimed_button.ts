import {
  ButtonBuilder,
  ButtonComponent,
  MessageActionRowComponent,
} from 'discord.js';
import { Button } from '../../Structures/Button';

export default new Button({
  customId: 'appeal_for_rewards_claimed_button',
  run: async (client, interaction) => {
    interaction.message.components[0].components[0] = ButtonBuilder.from(
      interaction.message.components[0].components[0] as ButtonComponent
    ).setDisabled(true).data as MessageActionRowComponent;

    interaction.update({
      components: interaction.message.components,
    });
  },
});
