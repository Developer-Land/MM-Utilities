import { Afk } from '../../models/afk/afk.js';
import { Command } from '../../structures/Command.js';

export default new Command({
  name: 'go',
  description: 'The go command',
  options: [
    {
      name: 'afk',
      description: 'go afk',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'message',
          description: 'afk message',
          type: 'STRING',
          required: false,
        },
      ],
    },
    {
      name: 'duty',
      description: 'go on duty',
      type: 'SUB_COMMAND',
    },
  ],
  userPermissions: ['MANAGE_MESSAGES'],

  category: 'Utilities',
  run: async (client, interaction) => {
    if (interaction.options.getSubcommand() === 'afk') {
      let afk = await Afk.findOne({
        userID: interaction.user.id,
        guildID: interaction.guildId,
      });
      let message = interaction.options.getString('message');
      if (!afk) {
        let newAfk = new Afk({
          userID: interaction.user.id,
          guildID: interaction.guildId,
          message: message,
          time: Date.now(),
        });
        newAfk.save();
        interaction.reply({
          content: `You are now afk with message ${message}`,
          ephemeral: true,
        });
      } else {
        interaction.reply({
          content: `You are already afk with message ${afk.message}`,
          ephemeral: true,
        });
      }
    }
  },
});
