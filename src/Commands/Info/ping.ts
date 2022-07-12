import { Command } from '../../Structures/Command';

export default new Command({
  name: 'ping',
  description: "returns the bot's websocket ping",
  category: 'Info',
  run: async (client, interaction) => {
    interaction.reply({ content: `${client.ws.ping}ms pong!` });
  },
});
