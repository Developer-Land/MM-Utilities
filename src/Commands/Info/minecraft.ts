import { MessageEmbed } from 'discord.js';
import moment from 'moment';
import { request } from 'undici';
import { Command } from '../../Structures/Command';

export default new Command({
  name: 'minecraft',
  description: 'Shows information about a minecraft server',
  options: [
    {
      name: 'ip',
      description: 'Ip of minecraft server',
      type: 'STRING',
      required: true,
    },
    {
      name: 'port',
      description: 'port of minecraft server',
      type: 'STRING',
      required: false,
    },
  ],
  category: 'Info',
  run: async (_client, interaction) => {
    let ip = interaction.options.getString('ip');
    let port = interaction.options.getString('port');
    let data = await request(
      `https://api.mcsrvstat.us/2/${ip}:${port ? port : '25565'}`
    ).then((res) => res.body.json());
    if (data.online !== true)
      return interaction.reply({ content: 'Server is offline' });
    let ServerInfo = new MessageEmbed()
      .setTitle('Online')
      .setThumbnail(
        `https://api.mcsrvstat.us/icon/${ip}:${port ? port : '25565'}`
      )
      .addField(ip, String(data.motd.clean[0]), true)
      .addField('Version', data.version, true)
      .addField(
        'Players',
        `${data.players.online}\/${data.players.max} ${
          data.players.list
            ? '\nPlayers: ' + data.players.list.map((x) => x).join(', ')
            : ''
        }`,
        true
      )
      .addField(
        'Software',
        `${data.software ? data.software : 'Undetected'}`,
        true
      )
      .addField('Map', `${data.map ? data.map : 'Undetected'}`, true)
      .addField(
        'Plugins',
        `${data.plugins ? data.plugins : 'Undetected'}`,
        true
      )
      .setFooter({
        text: `Cache resets in ${moment(data.debug.cachetime)
          .format('mm / ss')
          .replace('/', 'minutes')} seconds`,
      });
    interaction.reply({ embeds: [ServerInfo], ephemeral: true });
  },
});
