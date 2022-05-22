import { leveling, levelingInterface } from '../../models/leveling/leveling';
import {
  levelRoles,
  levelRolesInterface,
} from '../../models/leveling/levelroles';
import {
  levelUserSettings,
  levelUserSettingsInterface,
} from '../../models/leveling/usersettings';
import { client } from '../../index';
import { HydratedDocument } from 'mongoose';
import { Guild, GuildMember, GuildTextBasedChannel } from 'discord.js';
import { Event } from '../../structures/Event';

export default new Event(leveling.watch(), 'change', async (data) => {
  if (data.updateDescription?.updatedFields?.level) {
    let RolesArray: string[];
    let RemoveRolesArray: string[];
    let RoleToAdd: string;
    const Document: HydratedDocument<levelingInterface> =
      await leveling.findById(data.documentKey._id);
    if (Document.guildID !== '485463924007763970') return;
    const guild: Guild = client.guilds.cache.get(Document.guildID);
    const member: GuildMember = guild.members.cache.get(Document.userID);
    const findUserSettings: HydratedDocument<levelUserSettingsInterface> =
      await levelUserSettings.findOne({
        userID: Document.userID,
        guildID: Document.guildID,
      });
    const findLevelRoles: HydratedDocument<levelRolesInterface> =
      await levelRoles.findOne({
        guildID: Document.guildID,
      });
    if (findLevelRoles) {
      const LevelRolesObj: object = JSON.parse(findLevelRoles.levelRoles);
      const sortedLevelRolesObj: object = {};
      Object.keys(LevelRolesObj)
        .sort()
        .forEach(function (key) {
          sortedLevelRolesObj[key] = LevelRolesObj[key];
        });
      for (const level in sortedLevelRolesObj) {
        if (Document.level >= parseInt(level)) {
          RolesArray.push(sortedLevelRolesObj[level]);
        }
        if (Document.level < parseInt(level)) {
          RemoveRolesArray.push(sortedLevelRolesObj[level]);
        }
      }
      RoleToAdd = RolesArray[RolesArray.length - 1];
      if (RolesArray?.length > 1) {
        RolesArray.pop();
        await member.roles.remove(
          RolesArray,
          "Leveling System don't stack roles"
        );
      }
      if (RemoveRolesArray?.length) {
        await member.roles.remove(
          RemoveRolesArray,
          'Leveling System role remove on level down'
        );
      }
      if (!member.roles.cache.has(RoleToAdd)) {
        member.roles.add(RoleToAdd, 'Leveling System level up role');
      }
    }
    const levelUpChannel: GuildTextBasedChannel = client.channels.cache.get(
      '854647919956852746'
    ) as GuildTextBasedChannel;
    levelUpChannel.send({
      content: `<@${Document.userID}> has just reached ${
        Document.level
      } level!${
        !member.roles.cache.has(RoleToAdd)
          ? ` And they have been given the role <@&${RoleToAdd}>`
          : ''
      }`,
      allowedMentions: {
        users:
          findUserSettings?.levelUpMsg !== 'false' ? [Document.userID] : [],
        roles: [],
      },
    });
  }
});
