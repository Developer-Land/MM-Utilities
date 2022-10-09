import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageActionRowComponentBuilder,
} from 'discord.js';
import { Button } from '../../Structures/Button';

export default new Button({
  customId: '\\d+\\.verification.reject',
  run: async (client, interaction) => {
    if (!interaction.member.roles.cache.has('1008423362911031367')) {
      return interaction.reply({
        content: 'You are not a gatekeeper.',
        ephemeral: true,
      });
    }

    interaction.reply({
      content:
        'Denying the verification request will kick the member. Do you still want to continue?',
      ephemeral: true,
      components: [
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setLabel("I know what I'm doing")
            .setCustomId(
              `${interaction.message.id}.verification.rejectConfirmed`
            ),

          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setLabel('Never mind')
            .setCustomId(`verification.rejectCancelled`)
        ),
      ],
    });
  },
});
