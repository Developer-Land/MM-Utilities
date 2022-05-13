import { Command } from '../../structures/Command';

export default new Command({
  name: 'ping',
  description: 'replies with pong',
  run: async (_client, interaction) => {
    interaction.reply('Pong3');
  },
});
