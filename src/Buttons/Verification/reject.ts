import { Button } from '../../Structures/Button';

export default new Button({
  customId: '\\d+\\.verification.reject',
  run: async (client, interaction) => {
    interaction.reply('You have rejected the verification request.');
  },
});
