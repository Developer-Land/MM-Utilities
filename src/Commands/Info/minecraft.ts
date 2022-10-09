import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
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
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'port',
      description: 'port of minecraft server',
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  category: 'Info',
  run: async (_client, interaction) => {
    let ip = interaction.options.getString('ip');
    let port = interaction.options.getString('port');
    let data = await request(
      `https://api.mcsrvstat.us/2/${ip}${port ? ':' + port : ''}`
    ).then((res) => res.body.json());
    if (data.online !== true)
      return interaction.reply({ content: 'Server is offline' });
    let ServerInfo = new EmbedBuilder()
      .setTitle('Online')
      .setThumbnail(
        `https://api.mcsrvstat.us/icon/${ip}:${port ? port : '25565'}`
      )
      .addFields(
        {
          name: ip,
          value: String(data.motd.clean[0]),
          inline: true,
        },
        {
          name: 'Version',
          value: data.version,
          inline: true,
        },
        {
          name: 'Players',
          value: `${data.players.online}\/${data.players.max} ${
            data.players.list
              ? '\nPlayers: ' + data.players.list.map((x) => x).join(', ')
              : ''
          }`,
          inline: true,
        },
        {
          name: 'Software',
          value: data.software ? data.software : 'Undetected',
          inline: true,
        },
        {
          name: 'Map',
          value: data.map ? data.map : 'Undetected',
          inline: true,
        },
        {
          name: 'Plugins',
          value: data.plugins ? data.plugins : 'Undetected',
          inline: true,
        }
      )
      .setFooter({
        text: `Cache resets in ${moment(data.debug.cachetime)
          .format('mm / ss')
          .replace('/', 'minutes')} seconds`,
      });
    interaction.reply({ embeds: [ServerInfo], ephemeral: true });
  },
});
