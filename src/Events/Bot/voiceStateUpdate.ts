import { VoiceState } from 'discord.js';
import moment from 'moment';
import { client } from '../../index';
import { leveling } from '../../Models/Leveling/leveling';
import { levelingIgnore } from '../../Models/Leveling/levelingignore';
import { Event } from '../../Structures/Event';
import { lavalink } from '../../Systems/lavalink';
const memberJoinedDate = new Map<string, Date>();

export default new Event(
  client,
  'voiceStateUpdate',
  async (oldState: VoiceState | null, newState: VoiceState) => {
    if (newState.member.user.id === client.user.id) {
      let player = lavalink.players.get(newState.guild.id);
      if (oldState.channelId && !newState.channelId && player) {
        player.destroy();
      }
    }
    if (
      oldState.channel == null &&
      newState.channel != null &&
      newState.member != null
    ) {
      if (newState.deaf) return;
      let ignoreCH = await levelingIgnore.findOne({
        guildID: newState.guild.id,
        ID: newState.channelId,
      });
      let ignoreRD = await levelingIgnore.find({
        guildID: newState.guild.id,
      });
      let ignoreRL;
      if (ignoreRD) {
        ignoreRD.forEach((x) => {
          if (newState.member.roles.cache.has(x.ID)) {
            ignoreRL = true;
          }
        });
      }
      if (!ignoreCH) {
        if (!ignoreRL) {
          memberJoinedDate.set(newState.member.id, new Date());
        }
      }
    }

    if (
      oldState.channel != null &&
      newState.channel != null &&
      newState.member != null
    ) {
      if (newState.deaf) {
        if (!memberJoinedDate.get(newState.member.id)) return;
        let time =
          new Date().valueOf() -
          memberJoinedDate.get(newState.member.id).valueOf();
        let timeAsMins = moment.duration(time).asMinutes();
        if (timeAsMins === 0) return;
        const user = await leveling.findOne({
          userID: newState.member.id,
          guildID: newState.guild.id,
        });
        let randomXp = (Math.floor(Math.random() * 6) + timeAsMins) * 40;
        const xp = randomXp;
        if (!user) {
          const newUser = new leveling({
            userID: newState.member,
            guildID: newState.guild.id,
            xp: xp,
            level: Math.floor(0.1 * Math.sqrt(xp)),
          });
          await newUser
            .save()
            .catch((e) => console.log(`Failed to save new user.`));
        } else {
          user.xp += randomXp;
          user.level = Math.floor(0.1 * Math.sqrt(user.xp));
          user.lastUpdated = new Date();
          await user
            .save()
            .catch((e) => console.log(`Failed to append xp: ${e}`));
        }
        memberJoinedDate.delete(newState.member.id);
      } else {
        if (memberJoinedDate.get(newState.member.id)) return;
        if (newState.deaf) return;
        let ignoreCH = await levelingIgnore.findOne({
          guildID: newState.guild.id,
          ID: newState.channelId,
        });
        let ignoreRD = await levelingIgnore.find({
          guildID: newState.guild.id,
        });
        let ignoreRL;
        if (ignoreRD) {
          ignoreRD.forEach((x) => {
            if (newState.member.roles.cache.has(x.ID)) {
              ignoreRL = true;
            }
          });
        }
        if (!ignoreCH) {
          if (!ignoreRL) {
            memberJoinedDate.set(newState.member.id, new Date());
          }
        }
      }
    }

    if (
      newState.channel == null &&
      oldState.channel != null &&
      oldState.member != null
    ) {
      if (!memberJoinedDate.get(oldState.member.id)) return;
      let time =
        new Date().valueOf() -
        memberJoinedDate.get(oldState.member.id).valueOf();
      let timeAsMins = moment.duration(time).asMinutes();
      if (timeAsMins === 0) return;
      const user = await leveling.findOne({
        userID: oldState.member.id,
        guildID: oldState.guild.id,
      });
      let randomXp = (Math.floor(Math.random() * 6) + timeAsMins) * 40;
      const xp = randomXp;
      if (!user) {
        const newUser = new leveling({
          userID: oldState.member,
          guildID: oldState.guild.id,
          xp: xp,
          level: Math.floor(0.1 * Math.sqrt(xp)),
        });
        await newUser
          .save()
          .catch((e) => console.log(`Failed to save new user.`));
      } else {
        user.xp += randomXp;
        user.level = Math.floor(0.1 * Math.sqrt(user.xp));
        user.lastUpdated = new Date();
        await user
          .save()
          .catch((e) => console.log(`Failed to append xp: ${e}`));
      }
      memberJoinedDate.delete(oldState.member.id);
    }
  }
);
