import { Afk } from '../../models/go/afk';
import { Duty } from '../../models/go/duty';
import { Command } from '../../structures/Command';

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
      options: [
        {
          name: 'toggle',
          description: 'toggle duty',
          type: 'BOOLEAN',
          required: true,
        },
      ],
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
      return;
    }
    if (interaction.options.getSubcommand() === 'duty') {
      let toggle = interaction.options.getBoolean('toggle');

      let duty = await Duty.findOne({
        userID: interaction.user.id,
        guildID: interaction.guildId,
      });

      if (toggle) {
        if (!duty) {
          let newDuty = new Duty({
            userID: interaction.user.id,
            guildID: interaction.guildId,
          });
          await newDuty.save();
          interaction.member.roles.add('980496476985761872', 'Duty on');
          interaction.reply({
            content: `You are now on duty`,
            ephemeral: true,
          });
        } else {
          interaction.reply({
            content: `You are already on duty`,
            ephemeral: true,
          });
        }
      } else {
        if (duty) {
          interaction.reply({
            content: `You are now off duty`,
            ephemeral: true,
          });
          await Duty.deleteOne({
            userID: interaction.user.id,
            guildID: interaction.guildId,
          });
        } else {
          interaction.reply({
            content: `You are already off duty`,
            ephemeral: true,
          });
        }
      }
    }
  },
});
