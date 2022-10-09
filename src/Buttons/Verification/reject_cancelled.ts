import { Button } from '../../Structures/Button';

export default new Button({
  customId: 'verification.rejectCancelled',
  run: (client, interaction) => {
    interaction.update({ content: 'OK!' });
  },
});
