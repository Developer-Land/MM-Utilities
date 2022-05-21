import { MessageEmbed } from 'discord.js';
import { leveling } from '../../models/leveling/leveling';
import { Command } from '../../structures/Command';

export default new Command({
  name: 'leaderboard',
  description: 'Check the leaderboard',
  options: [
    {
      name: 'page',
      description: 'The page you want to check',
      type: 'NUMBER',
      required: false,
      minValue: 1,
    },
  ],

  category: 'Info',
  run: async (client, interaction) => {
    let optionPage = interaction.options.getNumber('page');
    let page = 1;
    if (optionPage) {
      page = optionPage;
    }
    let users = await leveling
      .find({ guildID: interaction.guildId })
      .sort([['xp', 'descending']])
      .exec();
    let leaderboard = users.slice((page - 1) * 10, 10 + (page - 1) * 10);
    if (leaderboard.length < 1 && optionPage) {
      return interaction.reply({
        content: "That leaderboard page doesn't exist",
      });
    }
    if (leaderboard.length < 1) {
      return interaction.reply({ content: 'Nobody is in leaderboard yet.' });
    }
    let computedArray = [];
    leaderboard.map((key) =>
      computedArray.push({
        guildID: key.guildID,
        userID: key.userID,
        xp: key.xp,
        level: key.level,
        position:
          leaderboard.findIndex(
            (i) => i.guildID === key.guildID && i.userID === key.userID
          ) + 1,
        username: client.users.cache.get(key.userID)
          ? client.users.cache.get(key.userID).username
          : 'Unknown',
        discriminator: client.users.cache.get(key.userID)
          ? client.users.cache.get(key.userID).discriminator
          : '0000',
      })
    );
    let lb = computedArray.map(
      (e) =>
        `**${e.position + (page - 1) * 10}.** [${e.username}#${
          e.discriminator
        }](https://mmgamer.ml), Level: ${e.level} (${e.xp.toLocaleString()} XP)`
    );
    let LBEmbed = new MessageEmbed()
      .setTitle('Leaderboard')
      .setDescription(lb.join('\n'))
      .setColor(client.config.botColor)
      .setFooter({ text: `Page ${String(page)}` });

    interaction.reply({
      embeds: [LBEmbed],
    });
  },
});
