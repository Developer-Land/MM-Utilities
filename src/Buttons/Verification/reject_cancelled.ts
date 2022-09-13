import { Button } from '../../Structures/Button';
import { MessageActionRow, MessageButton } from "discord.js";

export default new Button({
  customId: 'verification.rejectCancelled',
  run: (client, interaction) => {
    interaction.update({ content: 'OK!' });
  },
});
