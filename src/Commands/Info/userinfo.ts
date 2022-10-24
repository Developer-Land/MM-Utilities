import { Command } from '../../Structures/Command';

import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  GuildMember,
} from 'discord.js';
import moment from 'moment';

export default new Command({
  name: 'userinfo',
  description: 'Shows information about a user',
  options: [
    {
      type: ApplicationCommandOptionType.User,
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
    let avatar = user.displayAvatarURL({ size: 4096 });
    let secondsSinceCreation = moment(new Date()).diff(
      user.createdAt,
      'seconds'
    );
    let userCreated = {} as {
      years: number;
      months: number;
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
    };
    let startCreated = moment();
    let endCreated = moment().add(secondsSinceCreation, 'seconds');
    userCreated.years = endCreated.diff(startCreated, 'years');
    startCreated.add(userCreated.years, 'years');
    userCreated.months = endCreated.diff(startCreated, 'months');
    startCreated.add(userCreated.months, 'months');
    userCreated.days = endCreated.diff(startCreated, 'days');
    startCreated.add(userCreated.days, 'days');
    userCreated.hours = endCreated.diff(startCreated, 'hours');
    startCreated.add(userCreated.hours, 'hours');
    userCreated.minutes = endCreated.diff(startCreated, 'minutes');
    startCreated.add(userCreated.minutes, 'minutes');
    userCreated.seconds = endCreated.diff(startCreated, 'seconds');
    startCreated.add(userCreated.seconds, 'seconds');

    let userCreatedString =
      (userCreated.years + ' years ')
        .replace(/\b0 years\b /, '')
        .replace(/\b1 years\b/, '1 year') +
        (userCreated.months + ' months ')
          .replace(/\b0 months\b /, '')
          .replace(/\b1 months\b/, '1 month') +
        (userCreated.days + ' days')
          .replace(/\b0 days\b /, '')
          .replace(/\b1 days\b/, '1 day') !==
      ''
        ? (userCreated.years + ' years ')
            .replace(/\b0 years\b /, '')
            .replace(/\b1 years\b/, '1 year') +
          (userCreated.months + ' months ')
            .replace(/\b0 months\b /, '')
            .replace(/\b1 months\b/, '1 month') +
          (userCreated.days + ' days')
            .replace(/\b0 days\b /, '')
            .replace(/\b1 days\b/, '1 day')
        : (userCreated.hours + ' hours ')
            .replace(/\b0 hours\b /, '')
            .replace(/\b1 hours\b/, '1 hour') +
          (userCreated.minutes + ' minutes ')
            .replace(/\b0 minutes\b /, '')
            .replace(/\b1 minutes\b/, '1 minute') +
          (userCreated.seconds + ' seconds')
            .replace(/\b0 seconds\b /, '')
            .replace(/\b1 seconds\b/, '1 second');

    let userinfo = new EmbedBuilder()
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
          )} (${userCreatedString.replace(/[^\S\r\n]{2,}/gi, '')} ago)`,
        }
      );
    if (target) {
      let secondsSinceJoined = moment(new Date()).diff(
        target.joinedAt,
        'seconds'
      );
      let userJoined = {} as {
        years: number;
        months: number;
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
      };
      let startJoined = moment();
      let endJoined = moment().add(secondsSinceJoined, 'seconds');
      userJoined.years = endJoined.diff(startJoined, 'years');
      startJoined.add(userJoined.years, 'years');
      userJoined.months = endJoined.diff(startJoined, 'months');
      startJoined.add(userJoined.months, 'months');
      userJoined.days = endJoined.diff(startJoined, 'days');
      startJoined.add(userJoined.days, 'days');
      userJoined.hours = endJoined.diff(startJoined, 'hours');
      startJoined.add(userJoined.hours, 'hours');
      userJoined.minutes = endJoined.diff(startJoined, 'minutes');
      startJoined.add(userJoined.minutes, 'minutes');
      userJoined.seconds = endJoined.diff(startJoined, 'seconds');
      startJoined.add(userJoined.seconds, 'seconds');

      let userJoinedString =
        (userJoined.years + ' years ')
          .replace(/\b0 years\b /, '')
          .replace(/\b1 years\b/, '1 year') +
          (userJoined.months + ' months ')
            .replace(/\b0 months\b /, '')
            .replace(/\b1 months\b/, '1 month') +
          (userJoined.days + ' days ')
            .replace(/\b0 days\b /, '')
            .replace(/\b1 days\b/, '1 day') !==
        ''
          ? (userJoined.years + ' years ')
              .replace(/\b0 years\b /, '')
              .replace(/\b1 years\b/, '1 year') +
            (userJoined.months + ' months ')
              .replace(/\b0 months\b /, '')
              .replace(/\b1 months\b/, '1 month') +
            (userJoined.days + ' days')
              .replace(/\b0 days\b /, '')
              .replace(/\b1 days\b/, '1 day')
          : (userJoined.hours + ' hours ')
              .replace(/\b0 hours\b /, '')
              .replace(/\b1 hours\b/, '1 hour') +
            (userJoined.minutes + ' minutes ')
              .replace(/\b0 minutes\b /, '')
              .replace(/\b1 minutes\b/, '1 minute') +
            (userJoined.seconds + ' seconds')
              .replace(/\b0 seconds\b /, '')
              .replace(/\b1 seconds\b/, '1 second');

      let RolePos = target.roles.cache.map((r) => r);
      RolePos.sort(function (a, b) {
        return b.rawPosition - a.rawPosition;
      });
      userinfo.addFields(
        {
          name: 'Joined Server',
          value: `${moment(target.joinedAt).format(
            'llll'
          )} (${userJoinedString.replace(/[^\S\r\n]{2,}/gi, '')} ago)`,
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
      userinfo.addFields({
        name: `Device${Devices.length > 1 ? `s(${Devices.length})` : ''}`,
        value: `${Devices.join(', ')}`,
        inline: false,
      });
    }
    interaction.reply({ embeds: [userinfo] });
  },
});
