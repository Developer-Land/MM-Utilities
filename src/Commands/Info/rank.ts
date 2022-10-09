import { ApplicationCommandOptionType, AttachmentBuilder } from 'discord.js';
import { leveling } from '../../Models/Leveling/leveling';
import { levelUserSettings } from '../../Models/Leveling/usersettings';
import { Command } from '../../Structures/Command';

export default new Command({
  name: 'rank',
  description: "Check your/someone's rank",
  options: [
    {
      name: 'user',
      description: 'the user you want to check',
      type: ApplicationCommandOptionType.User,
      required: false,
    },
  ],
  category: 'Info',
  run: async (client, interaction) => {
    await interaction.reply({
      content: 'Generating your rankcard please wait!',
    });
    let user = interaction.options.getUser('user');
    if (!user) {
      user = interaction.user;
    }
    let target = await interaction.guild.members.fetch(user.id);
    let staff = false;
    let booster = false;
    if (target?.roles.cache.has('866291838288396298')) {
      staff = true;
    } else if (target?.roles.cache.has('859324167224033282')) {
      booster = true;
    }
    let rank = await leveling.findOne({
      userID: user.id,
      guildID: interaction.guildId,
    });
    let leaderboard = await leveling
      .find({
        guildID: interaction.guildId,
      })
      .sort({ xp: 'descending' })
      .exec();
    let userSettings = await levelUserSettings.findOne({
      userID: user.id,
      guildID: interaction.guildId,
    });
    let AvatarShape = userSettings?.rankcardAvatar
      ? userSettings.rankcardAvatar
      : 'true';
    let barColor = userSettings?.rankcardColor
      ? userSettings.rankcardColor.replace('#', '')
      : '5153F9';
    let background = userSettings?.rankcardBg
      ? userSettings.rankcardBg
      : 'none';
    let xp = 0;
    let NextLevelxp = 100;
    let level = 0;
    let position = 100;
    if (rank) {
      level = rank.level;
      xp = rank.xp - rank.level * rank.level * 100;
      NextLevelxp =
        (rank.level + 1) * (rank.level + 1) * 100 -
        rank.level * rank.level * 100;
      position = leaderboard.findIndex((i) => i.userID === user.id) + 1;
    }
    let avatar = user.displayAvatarURL({
      size: 4096,
      extension: 'png',
      forceStatic: true,
    });
    let rankcard = new AttachmentBuilder(
      `https://developerland.ml/api/rankcard?username=${target.displayName}&avatar=${avatar}&level=${level}&rank=${position}&currentXp=${xp}&xpNeeded=${NextLevelxp}&background=${background}&boosting=${booster}&staff=${staff}&bar=${barColor}&circle=${AvatarShape}`,
      {
        name: 'rankcard.png',
      }
    );
    await interaction.editReply({
      content: `${user}'s rankcard`,
      files: [rankcard],
      allowedMentions: { users: [] },
    });
  },
});
