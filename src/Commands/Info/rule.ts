import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { Command } from '../../Structures/Command';

export default new Command({
  name: 'rule',
  description: 'Lookup a rule',
  options: [
    {
      name: 'number',
      description: 'The rule you want to lookup for',
      type: ApplicationCommandOptionType.Integer,
      required: true,
      minValue: 1,
      maxValue: 13,
    },
  ],
  category: 'Info',
  run: async (client, interaction) => {
    let RuleNum = interaction.options.getInteger('number');
    let rule: string;
    //1st rule
    if (RuleNum === 1) {
      rule =
        'Follow all Discord ToS. [Guidelines](https://dis.gd/guidelines), [Terms](https://dis.gd/terms)';
    }
    //2nd rule
    if (RuleNum === 2) {
      rule = 'Be respectful to everyone. (Use common sense)';
    }
    //3rd rule
    if (RuleNum === 3) {
      rule = 'No hate speech. Racism, Homophobia, Sexism etc.';
    }
    //4th rule
    if (RuleNum === 4) {
      rule = 'Keep toxicity to a minimum. Trolling, Harassment, self-harm etc.';
    }
    //5th rule
    if (RuleNum === 5) {
      rule = 'Do not ping for no reason.';
    }
    //6th rule
    if (RuleNum === 6) {
      rule = 'No spamming. This includes flood, copypastes etc.';
    }
    //7th rule
    if (RuleNum === 7) {
      rule =
        'No NSFW or obscene content. This includes text, images, or links featuring nudity, sex, hard violence, or other graphically disturbing content.';
    }
    //8th rule
    if (RuleNum === 8) {
      rule =
        'No advertising. This includes DMs, Username, Nickname & Talking about other servers.';
    }
    //9th rule
    if (RuleNum === 9) {
      rule = 'No Raiding. This includes participating and promoting.';
    }
    //10th rule
    if (RuleNum === 10) {
      rule =
        'No sub-servers/member poaching. (servers that involve many of our members)';
    }
    //11th rule
    if (RuleNum === 11) {
      rule =
        'You cannot have symbols in your name. (including invisible names)';
    }
    //12th rule
    if (RuleNum === 12) {
      rule =
        'No controversial conversations. Any sorts of political, religious, and/or controversial topics are disallowed.';
    }
    //13th rule
    if (RuleNum === 13) {
      rule =
        'Do not use Zalgo Text in Chat. Everything in Chat must be in a standard English QWERTY keyboard.';
    }
    let RuleEmbed = new EmbedBuilder()
      .setAuthor({
        name: `Rule #${RuleNum}`,
        iconURL:
          'https://cdn.discordapp.com/emojis/829587068480258068.png?v=1&size=4096',
      })
      .setColor(client.config.botColor)
      .setDescription(rule);
    interaction.reply({ embeds: [RuleEmbed] });
  },
});
