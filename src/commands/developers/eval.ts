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
    let code = interaction.options.getString('code');
    try {
      let evaled = await eval(code);
      let embed = new MessageEmbed()
        .setAuthor({ name: 'Eval', iconURL: interaction.user.avatarURL() })
        .addField('Input', `\`\`\`${code}\`\`\``)
        .addField('Output', `\`\`\`${evaled}\`\`\``)
        .setColor(client.config.botColor);
      await interaction.reply({ content: 'Trying to eval' });
      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      interaction.reply({ content: `\`ERROR\` \`\`\`js\n${err}\n\`\`\`` });
    }
  },
});
