import { Command } from '../../Structures/Command';

import { GuildMember, MessageEmbed } from 'discord.js';
import moment from 'moment';

export default new Command({
  name: 'userinfo',
  description: 'Shows information about a user',
  options: [
    {
      type: 'USER',
      name: 'user',
      description: 'The user to show information about',
    },
  ],
  category: 'Info',
  run: async (client, interaction) => {
    let user = interaction.options.getUser('user');
    if (!user) {
      user = interaction.user;
    }
    let target = (await interaction.guild.members
      .fetch(user.id)
      .catch(() => {})) as GuildMember;
    let avatar = user.displayAvatarURL({ size: 4096, dynamic: true });
    let daysSinceCreation = moment(new Date()).diff(user.createdAt, 'days');
    let startCreated = moment();
    let endCreated = moment().add(daysSinceCreation, 'days');
    let yearsCreated = endCreated.diff(startCreated, 'years');
    startCreated.add(yearsCreated, 'years');
    let monthsCreated = endCreated.diff(startCreated, 'months');
    startCreated.add(monthsCreated, 'months');
    let daysCreated = endCreated.diff(startCreated, 'days');
    startCreated.add(daysCreated, 'days');

    let userinfo = new MessageEmbed()
      .setAuthor({ name: user.tag, iconURL: avatar })
      .setThumbnail(avatar)
      .setColor(client.config.botColor)
      .setDescription(`<@${user.id}>`)
      .addFields(
        {
          name: 'ID',
          value: user.id,
        },
        {
          name: 'Avatar URL',
          value: `[click here](${avatar})`,
        },
        {
          name: 'Account Created',
          value: `${moment(user.createdAt).format(
            'llll'
          )} (${yearsCreated} years ${monthsCreated} months ${daysCreated} days ago)`,
        }
      );
    if (target) {
      let daysSinceJoined = moment(new Date()).diff(target.joinedAt, 'days');
      let startJoined = moment();
      let endJoined = moment().add(daysSinceJoined, 'days');
      let yearsJoined = endJoined.diff(startJoined, 'years');
      startJoined.add(yearsJoined, 'years');
      let monthsJoined = endJoined.diff(startJoined, 'months');
      startJoined.add(monthsJoined, 'months');
      let daysJoined = endJoined.diff(startJoined, 'days');
      startJoined.add(daysJoined, 'days');
      let RolePos = target.roles.cache.map((r) => r);
      RolePos.sort(function (a, b) {
        return b.rawPosition - a.rawPosition;
      });
      userinfo.fields.push(
        {
          name: 'Joined Server',
          value: `${moment(target.joinedAt).format(
            'llll'
          )} (${yearsJoined} years ${monthsJoined} months ${daysJoined} days ago)`,
          inline: false,
        },
        {
          name: `Roles(${target.roles.cache.size - 1})`,
          value: RolePos.join(' ').replace('@everyone', ' ') || 'none',
          inline: false,
        }
      );
    }
    if (target?.presence?.clientStatus) {
      let Devices = [];
      if (target.presence.clientStatus.desktop) Devices.push('🖥️ Desktop');
      if (target.presence.clientStatus.mobile) Devices.push('📱 Mobile');
      if (target.presence.clientStatus.web) Devices.push('🌐 Web');
      userinfo.fields.push({
        name: `Device${Devices.length > 1 ? `s(${Devices.length})` : ''}`,
        value: `${Devices.join(', ')}`,
        inline: false,
      });
    }
    interaction.reply({ embeds: [userinfo] });
  },
});
