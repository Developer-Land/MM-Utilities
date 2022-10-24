import { ApplicationCommandOptionType, GuildMember } from 'discord.js';
import { Command } from '../../Structures/Command';

export default new Command({
  name: 'sanitize',
  description: 'Sanitize username',
  options: [
    {
      name: 'user',
      description: 'User to sanitize username',
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
  ],
  category: 'Moderation & Management',
  userPermissions: ['ManageNicknames'],
  run: async (client, interaction) => {
    let confusables = (
      await import(`${__dirname}/../../../data/confusables.json`)
    )?.default;
    let user = interaction.options.getMentionable('user') as GuildMember;
    let displayName = user.displayName;
    let sanitizedName = [...displayName]
      .map((character) => {
        return confusables[character] || character;
      })
      .join('');
    if (sanitizedName === displayName)
      return interaction.reply('The username/nickname is already fine!');
    user.setNickname(sanitizedName);
    interaction.reply(
      `Successfully sanitized the username/nickname of ${user} (${displayName} to ${sanitizedName})!`
    );
  },
});
