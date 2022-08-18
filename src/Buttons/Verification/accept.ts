import { Button } from '../../Structures/Button';

export default new Button({
  customId: '\\d+\\.verification.accept',
  run: async (client, interaction) => {
    interaction.reply('You have accepted the verification request.');
  },
});
