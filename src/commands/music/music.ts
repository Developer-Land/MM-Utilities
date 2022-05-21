import { lavalink } from '../../Utils/lavalink';
import { getVoiceConnection } from '@discordjs/voice';
import moment from 'moment';
import { Command } from '../../structures/Command';

export default new Command({
  name: 'music',
  description: 'main music command',
  options: [
    {
      type: 'SUB_COMMAND',
      name: 'play',
      description: 'play a song',
      options: [
        {
          name: 'query',
          description: 'The song you want to play',
          type: 'STRING',
          required: true,
        },
      ],
    },
    {
      type: 'SUB_COMMAND',
      name: 'nowplaying',
      description: 'shows information about the current song',
    },
    {
      type: 'SUB_COMMAND',
      name: 'queue',
      description: 'display the song queue',
    },
    {
      type: 'SUB_COMMAND',
      name: 'skip',
      description: 'skip track(s)',
      options: [
        {
          name: 'count',
          description: 'how many track to remove',
          type: 'INTEGER',
          minValue: 2,
          required: false,
        },
      ],
    },
    {
      type: 'SUB_COMMAND',
      name: 'remove',
      description: 'remove a track from queue',
      options: [
        {
          name: 'position',
          description: 'the position of the track to remove',
          type: 'INTEGER',
          minValue: 1,
          required: true,
        },
      ],
    },
    {
      type: 'SUB_COMMAND',
      name: 'loop',
      description: 'loop Off/Song/Queue',
      options: [
        {
          name: 'mode',
          description: 'loop mode',
          type: 'STRING',
          required: false,
          choices: [
            {
              name: 'off',
              value: '0',
            },
            {
              name: 'Song',
              value: '1',
            },
            {
              name: 'Queue',
              value: '2',
            },
          ],
        },
      ],
    },
    {
      type: 'SUB_COMMAND',
      name: 'leave',
      description: 'clear the queue and disconnect from vc',
      userPermissions: ['MOVE_MEMBERS'],
    },
    {
      type: 'SUB_COMMAND',
      name: 'pause',
      description: 'pause the current song',
    },
    {
      type: 'SUB_COMMAND',
      name: 'volume',
      description: 'change or check the volume of the current song',
      options: [
        {
          name: 'percentage',
          description: 'percentage to change the volume to',
          type: 'INTEGER',
          required: false,
          minValue: 1,
          maxValue: 500,
        },
      ],
    },
    {
      type: 'SUB_COMMAND',
      name: 'resume',
      description: 'resume the current song',
    },
  ],

  category: 'Music',
  subcommands: [
    'music play',
    'music nowplaying',
    'music queue',
    'music skip',
    'music remove',
    'music loop',
    'music leave',
    'music pause',
    'music volume',
    'music resume',
  ],

  run: async (client, interaction) => {
    if (interaction.options.getSubcommand() === 'play') {
      const track = interaction.options.getString('query');

      if (!interaction.member.voice.channel)
        return interaction.reply({
          content: 'Please join a voice channel first!',
        });

      await interaction.deferReply();

      const searchResult = await lavalink.search(track);

      if (searchResult.loadType === 'LOAD_FAILED') {
        return interaction.editReply(
          `:x: Load failed. Error: ${searchResult.exception.message}`
        );
      } else if (searchResult.loadType === 'NO_MATCHES') {
        return interaction.editReply(':x: No matches!');
      }

      const player = lavalink.createPlayer({
        guildId: interaction.guild.id,
        voiceChannelId: interaction.member.voice.channelId,
        textChannelId: interaction.channel.id,
        selfDeaf: true,
      });

      player.connect();

      if (searchResult.loadType === 'PLAYLIST_LOADED') {
        for (const track of searchResult.tracks) {
          track.setRequester(interaction.user.tag);
          player.queue.push(track);
        }

        interaction.editReply(
          `Playlist \`${searchResult.playlistInfo.name}\` loaded!`
        );
      } else {
        const track = searchResult.tracks[0];
        track.setRequester(interaction.user.tag);

        player.queue.push(track);
        interaction.editReply(`Queued \`${track.title}\``);
      }
      if (!player.playing) player.play();
      return;
    }

    const player = lavalink.players.get(interaction.guild.id);

    if (interaction.options.getSubcommand() === 'leave') {
      const connection = await getVoiceConnection(interaction.guild.id);
      if (player) {
        player.destroy();
      } else if (connection) {
        connection.destroy();
      } else {
        return interaction.reply('Not in a vc');
      }

      interaction.reply({ content: 'Cleared the queue and left VC' });
      return;
    }
    if (interaction.options.getSubcommand() === 'resume') {
      if (!player.queue?.length)
        return interaction.reply({ content: 'No music in queue' });
      if (!player.paused)
        return interaction.reply({ content: 'Already playing' });

      player.pause(false);

      interaction.reply({ content: 'Resumed the current track!' });
      return;
    }
    if (!player?.playing)
      return interaction.reply({
        content: 'No track is currently being played',
      });
    if (interaction.options.getSubcommand() === 'nowplaying') {
      const millisecondsToMinutesSeconds = (ms) => {
        let duration = moment.duration(ms, 'milliseconds');
        let fromMinutes = Math.floor(duration.asMinutes());
        let fromSeconds = Math.floor(duration.asSeconds() - fromMinutes * 60);

        return Math.floor(duration.asSeconds()) >= 60
          ? (fromMinutes <= 9 ? '0' + fromMinutes : fromMinutes) +
              ':' +
              (fromSeconds <= 9 ? '0' + fromSeconds : fromSeconds)
          : '00:' + (fromSeconds <= 9 ? '0' + fromSeconds : fromSeconds);
      };
      interaction.reply({
        embeds: [
          {
            title: 'Now Playing',
            description: `🎶 | **${
              player.current.title
            }**! \`${millisecondsToMinutesSeconds(
              player.exactPosition
            )}/${millisecondsToMinutesSeconds(player.current.duration)}\``,
            thumbnail: { url: player.current.thumbnail },
            color: client.config.botColor,
            footer: {
              text: `Queued by ${player.current.requester}`,
            },
          },
        ],
      });
      return;
    }
    if (interaction.options.getSubcommand() === 'queue') {
      const currentTrack = player.current;
      const tracks = player.queue.slice(0, 10).map((m, i) => {
        return `${i + 1}. **[${m.title}](${m.uri})** - ${m.requester}`;
      });

      interaction.reply({
        embeds: [
          {
            title: 'Song Queue',
            description: `${tracks.join('\n')}${
              player.queue.length > tracks.length
                ? `\n...${
                    player.queue.length - tracks.length === 1
                      ? `${player.queue.length - tracks.length} more track`
                      : `${player.queue.length - tracks.length} more tracks`
                  }`
                : ''
            }`,
            color: 'RANDOM',
            fields: [
              {
                name: 'Now Playing',
                value: `🎶 | **[${currentTrack.title}](${currentTrack.uri})** - ${currentTrack.requester}`,
              },
            ],
          },
        ],
      });
      return;
    }
    if (interaction.options.getSubcommand() === 'skip') {
      let count = interaction.options.getInteger('count');
      if (count) {
        player.skip(count);
      } else {
        count = 1;
        player.skip();
      }

      interaction.reply({
        content: `Skipped ${count !== 1 ? String(count) : 'the current'} ${
          count !== 1 ? 'tracks' : 'track'
        }!`,
      });
      return;
    }
    if (interaction.options.getSubcommand() === 'remove') {
      const position = interaction.options.getInteger('position');
      if (position > player.queue.length)
        return interaction.reply({
          content: 'Invalid position',
        });

      player.queue.splice(position - 1, 1);
      interaction.reply({
        content: `Removed track at position ${position}`,
      });
      return;
    }
    if (interaction.options.getSubcommand() === 'loop') {
      const mode = interaction.options.getString('mode');
      if (!mode)
        return interaction.reply({
          content: `Track loop is ${
            player.trackRepeat ? 'on' : 'off'
          } and Queue loop is ${player.queueRepeat ? 'on' : 'off'}`,
        });
      if (mode === '0') {
        player.setTrackLoop(false);
        player.setQueueLoop(false);
      }
      if (mode === '1') {
        player.setTrackLoop(true);
      }
      if (mode === '2') {
        player.setQueueLoop(true);
      }
      interaction.reply({
        content: `Track loop is ${
          player.trackRepeat ? 'on' : 'off'
        } and Queue loop is ${player.queueRepeat ? 'on' : 'off'}`,
      });
      return;
    }
    if (interaction.options.getSubcommand() === 'pause') {
      player.pause(true);

      interaction.reply({ content: 'Paused the current track!' });
      return;
    }
    if (interaction.options.getSubcommand() === 'volume') {
      const volumePercentage = interaction.options.getInteger('percentage');

      if (!volumePercentage)
        return interaction.reply({
          content: `The current volume is \`${player.volume}%\``,
        });

      player.filters.setVolume(volumePercentage, true);

      interaction.reply({
        content: `Volume has been set to \`${volumePercentage}%\``,
      });
      return;
    }
  },
});
