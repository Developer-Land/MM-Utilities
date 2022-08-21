import { Command } from '../../Structures/Command';

export default new Command({
  name: 'reload',
  description: 'Reloads the bot',
  developersOnly: true,
  category: 'Developers',
  run: async (client, interaction) => {
    await interaction.reply({ content: 'Reloading' });
    await client.reload();
    client.emit('ready', client);
    interaction.editReply({ content: 'Reloaded' });
  },
});
