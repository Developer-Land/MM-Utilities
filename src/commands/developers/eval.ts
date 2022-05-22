import { MessageEmbed, Options } from 'discord.js';
import { Command } from '../../structures/Command';

export default new Command({
  name: 'eval',
  description: 'Evaluates arbitrary javascript code',
  options: [
    {
      type: 'STRING',
      name: 'code',
      description: 'The code to evaluate',
      required: true,
    },
  ],
  developersOnly: true,
  category: 'Developers',
  run: async (client, interaction) => {
    await interaction.reply({ content: 'Trying to eval' });
    let code = interaction.options.getString('code');
    try {
      let evaled = await eval(code);
      if (typeof evaled !== 'string')
        evaled = require('util').inspect(evaled, { depth: 1 });
      let embed = new MessageEmbed()
        .setAuthor({ name: 'Eval', iconURL: interaction.user.avatarURL() })
        .addField('Input', `\`\`\`${code}\`\`\``)
        .addField('Output', `\`\`\`${evaled}\`\`\``)
        .setColor(client.config.botColor);
      await interaction.editReply({ content: 'Evaled', embeds: [embed] });
    } catch (err) {
      interaction.editReply({ content: `\`Error\` \`\`\`js\n${err}\n\`\`\`` });
    }
  },
});
