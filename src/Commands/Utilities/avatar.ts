import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { Command } from '../../Structures/Command';

export default new Command({
  name: 'avatar',
  description: 'get pfp of a user or yours',
  options: [
    {
      name: 'user',
      description: 'The user you want to get pfp of',
      type: ApplicationCommandOptionType.User,
      required: false,
    },
  ],

  category: 'Utilities',
  run: async (client, interaction) => {
    let user = interaction.user;
    if (interaction.options.getUser('user')) {
      user = interaction.options.getUser('user');
    }

    let avatar = user.displayAvatarURL({ size: 4096 });

    let embed = new EmbedBuilder()
      .setTitle(`${user.tag}'s avatar`)
      .setDescription(`[Avatar URL of ${user.tag}](${avatar})`)
      .setColor(client.config.botColor)
      .setImage(avatar);

    interaction.reply({ embeds: [embed] });
  },
});
