import { Button } from '../../Structures/Button';
import { MessageActionRow, MessageButton } from "discord.js";

export default new Button({
  customId: 'verification.rejectCancelled',
  run: (client, interaction) => {
    interaction.reply({
      content: 'OK!',
      ephemeral: true
    });
  },
});
