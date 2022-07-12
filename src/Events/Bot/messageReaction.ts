import { GuildMember, MessageReaction, User } from 'discord.js';
import { client } from '../../index';
import { leveling } from '../../Models/Leveling/leveling';
import { levelingIgnore } from '../../Models/Leveling/levelingignore';
import { Events } from '../../Structures/Events';
import { starboardClient } from '../../Systems/starboard';
const earnedReactionXpRecently = new Set();

export default new Events(client, [
  {
    event: 'messageReactionAdd',
    run: async (reaction: MessageReaction, user: User) => {
      if (
        !earnedReactionXpRecently.has(user.id) &&
        !user.bot &&
        reaction.message.guild
      ) {
        let ignoreCH = await levelingIgnore.findOne({
          guildID: reaction.message.guild.id,
          ID: reaction.message.channel.id,
        });
        let ignoreRD = await levelingIgnore.find({
          guildID: reaction.message.guild.id,
        });
        let ignoreRL: boolean;
        let member = (await reaction.message.guild.members
          .fetch(user.id)
          .catch(() => {})) as GuildMember;
        if (ignoreRD && member) {
          ignoreRD.forEach((x) => {
            if (member.roles.cache.has(x.ID)) {
              ignoreRL = true;
            }
          });
        }
        if (!ignoreCH) {
          if (!ignoreRL) {
            const findUser = await leveling.findOne({
              userID: user.id,
              guildID: reaction.message.guild.id,
            });
            let randomXp = Math.floor(Math.random() * 6) + 5;
            const xp = randomXp;
            if (!findUser) {
              const newUser = new leveling({
                userID: user.id,
                guildID: reaction.message.guild.id,
                xp: xp,
                level: Math.floor(0.1 * Math.sqrt(xp)),
              });
              await newUser
                .save()
                .catch((e) => console.log(`Failed to save new user.`));
            } else {
              findUser.xp += randomXp;
              findUser.level = Math.floor(0.1 * Math.sqrt(findUser.xp));
              findUser.lastUpdated = new Date();
              await findUser
                .save()
                .catch((e) => console.log(`Failed to append xp: ${e}`));
            }
            earnedReactionXpRecently.add(user.id);
            setTimeout(() => {
              earnedReactionXpRecently.delete(user.id);
            }, 45000);
          }
        }
      }
      starboardClient.listener(reaction);
    },
  },
  {
    event: 'messageReactionRemove',
    run: async (reaction: MessageReaction, user: User) => {
      starboardClient.listener(reaction);
    },
  },
]);
