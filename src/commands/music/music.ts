import { getVoiceConnection } from '@discordjs/voice';
import {
  MessageActionRow,
  MessageSelectMenu,
  SelectMenuInteraction,
} from 'discord.js';
import moment from 'moment';
import { Track } from 'vulkava';
import { Command } from '../../structures/Command';
import { Queue } from '../../structures/lavalinkQueue';
import { lavalink } from '../../utils/lavalink';

export default new Command({
  name: 'music',
  description: 'main music command',
  options: [
    {
      type: 'SUB_COMMAND',
      name: 'play',
      description: 'play a track',
      options: [
        {
          name: 'query',
          description: 'The track you want to play',
          type: 'STRING',
          required: true,
        },
        {
          name: 'force',
          description: 'Force the track to play',
          type: 'BOOLEAN',
          required: false,
        },
      ],
    },
    {
      type: 'SUB_COMMAND',
      name: 'search',
      description: 'search tracks',
      options: [
        {
          name: 'query',
          description: 'The tracks you want to search',
          type: 'STRING',
          required: true,
        },
      ],
    },
    {
      type: 'SUB_COMMAND',
      name: 'nowplaying',
      description: 'shows information about the current track',
    },
    {
      type: 'SUB_COMMAND',
      name: 'queue',
      description: 'display the track queue',
    },
    {
      type: 'SUB_COMMAND',
      name: 'skip',
      description: 'skip track(s)',
      options: [
        {
          name: 'count',
          description: 'how many track to skip',
          type: 'INTEGER',
          minValue: 2,
          required: false,
        },
      ],
    },
    {
      type: 'SUB_COMMAND',
      name: 'remove',
      description: 'remove tracks from queue',
      options: [
        {
          name: 'from',
          description: 'the from index to start removing',
          type: 'INTEGER',
          minValue: 1,
          required: true,
        },
        {
          name: 'to',
          description: 'the to index to stop removing',
          type: 'INTEGER',
          minValue: 1,
          required: true,
        },
      ],
    },
    {
      type: 'SUB_COMMAND',
      name: 'loop',
      description: 'loop Off/Track/Queue',
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
              name: 'Track',
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
      name: 'resume',
      description: 'resume the current track',
    },
    {
      type: 'SUB_COMMAND',
      name: 'pause',
      description: 'pause the current track',
    },
    {
      type: 'SUB_COMMAND',
      name: 'volume',
      description: 'change or check the volume of the current track',
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
      name: 'shuffle',
      description: 'shuffle the queue',
    },
    {
      type: 'SUB_COMMAND',
      name: 'leave',
      description: 'clear the queue and disconnect from vc',
    },
  ],

  category: 'Music',
  subcommands: [
    'music play',
    'music search',
    'music nowplaying',
    'music queue',
    'music skip',
    'music remove',
    'music loop',
    'music resume',
    'music pause',
    'music volume',
    'music leave',
  ],

  run: async (client, interaction) => {
    if (interaction.options.getSubcommand() === 'play') {
      let query = interaction.options.getString('query');
      let force = interaction.options.getBoolean('force');

      if (!interaction.member.voice.channel)
        return interaction.reply({
          content: 'Please join a voice channel first!',
        });

      await interaction.reply({ content: 'Searching...' });

      let searchResult = await lavalink.search(query);

      if (searchResult.loadType === 'LOAD_FAILED') {
        return interaction.editReply(
          `:x: Load failed. Error: ${searchResult.exception.message}`
        );
      } else if (searchResult.loadType === 'NO_MATCHES') {
        return interaction.editReply(':x: No matches!');
      }

      let player = lavalink.createPlayer({
        guildId: interaction.guild.id,
        voiceChannelId: interaction.member.voice.channelId,
        textChannelId: interaction.channel.id,
        selfDeaf: true,
        queue: new Queue(),
      });

      player.connect();

      if (searchResult.loadType === 'PLAYLIST_LOADED') {
        for (let track of searchResult.tracks) {
          track.setRequester(interaction.user.tag);
          if (force) {
            (player.queue as Queue).addToBeginning(track);
          } else {
            (player.queue as Queue).add(track);
          }
        }

        interaction.editReply(
          `Playlist \`${searchResult.playlistInfo.name}\` loaded!`
        );
      } else {
        let track = searchResult.tracks[0];
        track.setRequester(interaction.user.tag);
        if (force) {
          (player.queue as Queue).addToBeginning(track);
        } else {
          (player.queue as Queue).add(track);
        }
        interaction.editReply(`Queued \`${track.title}\``);
      }
      if (!player.playing) player.play();
      if (force) player.skip();
      return;
    }
    if (interaction.options.getSubcommand() === 'search') {
      let query = interaction.options.getString('query');

      if (!interaction.member.voice.channel)
        return interaction.reply({
          content: 'Please join a voice channel first!',
        });

      await interaction.reply({ content: 'Searching...' });

      let searchResult = await lavalink.search(query);

      if (searchResult.loadType === 'LOAD_FAILED') {
        return interaction.editReply(
          `:x: Load failed. Error: ${searchResult.exception.message}`
        );
      } else if (searchResult.loadType === 'NO_MATCHES') {
        return interaction.editReply(':x: No matches!');
      }

      let player = lavalink.createPlayer({
        guildId: interaction.guild.id,
        voiceChannelId: interaction.member.voice.channelId,
        textChannelId: interaction.channel.id,
        selfDeaf: true,
        queue: new Queue(),
      });

      player.connect();

      if (searchResult.tracks.length === 1) {
        let track = searchResult.tracks[0];
        track.setRequester(interaction.user.tag);
        (player.queue as Queue).add(track);
        interaction.editReply(`Queued \`${track.title}\``);
        return;
      }

      let menu = new MessageSelectMenu()
        .setCustomId('music_search')
        .setPlaceholder('Select tracks')
        .setMinValues(1)
        .addOptions(
          searchResult.tracks.slice(0, 25).map((track) => {
            return {
              label: track.title,
              value: track.uri,
            };
          })
        );
      let raw = new MessageActionRow().addComponents(menu);
      await interaction.editReply({
        content: 'Select tracks from menu',
        components: [raw],
      });
      let filter = (i: SelectMenuInteraction) =>
        i.user.id === interaction.user.id;
      let collector = interaction.channel.createMessageComponentCollector({
        componentType: 'SELECT_MENU',
        filter,
        max: 1,
        time: 60000,
      });
      collector.on('collect', (i) => {
        if (i.customId === 'music_search') {
          collector.stop('collected');
        }
      });
      collector.on('end', (collected, reason) => {
        if (reason === 'collected') {
          collected.first().values.forEach((uri) => {
            let track = searchResult.tracks.find((t) => t.uri === uri);
            track.setRequester(interaction.user.tag);
            (player.queue as Queue).add(track);
          });
          interaction.editReply({
            content: `Queued \`${collected
              .first()
              .values.map(
                (x) => searchResult.tracks.find((t: Track) => t.uri === x).title
              )
              .join('`, `')}\``,
            components: [],
          });
          if (!player.playing) player.play();
        } else {
          interaction.editReply({ content: 'Timed out!', components: [] });
        }
      });
      return;
    }

    let player = lavalink.players.get(interaction.guild.id);

    if (interaction.options.getSubcommand() === 'leave') {
      if (!interaction.member.permissions.has('MOVE_MEMBERS'))
        return interaction.reply({ content: "You can't do that" });
      let connection = getVoiceConnection(interaction.guild.id);
      if (player) {
        player.destroy();
      } else if (connection) {
        connection.destroy();
      } else {
        return interaction.reply('Not in a vc');
      }

      interaction.reply({ content: 'Cleared the queue and left channel!' });
      return;
    }
    if (interaction.options.getSubcommand() === 'resume') {
      if (!player.current)
        return interaction.reply({ content: 'No music in queue.' });
      if (!player.paused)
        return interaction.reply({ content: 'Track is already playing!' });

      player.pause(false);

      interaction.reply({ content: 'Resumed the current track!' });
      return;
    }
    if (!player?.playing)
      return interaction.reply({
        content: 'No track is currently being played!',
      });
    if (interaction.options.getSubcommand() === 'nowplaying') {
      let millisecondsToMinutesSeconds = (ms) => {
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
            title: `Now Playing${player.paused ? ' (Paused)' : ''}${
              player.trackRepeat ? ' (Track loop)' : ''
            }${player.queueRepeat ? ' (Queue loop)' : ''}`,
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
      let currentTrack = player.current;
      let tracks = (player.queue as Queue).slice(0, 10).map((m, i) => {
        return `${i + 1}. **[${m.title}](${m.uri})** - ${m.requester}`;
      });

      interaction.reply({
        embeds: [
          {
            title: `Track Queue${player.trackRepeat ? ' (Track loop)' : ''}${
              player.queueRepeat ? ' (Queue loop)' : ''
            }`,
            description: `${tracks.join('\n')}${
              (player.queue as Queue).size > tracks.length
                ? `\n...${
                    (player.queue as Queue).size - tracks.length === 1
                      ? `${
                          (player.queue as Queue).size - tracks.length
                        } more track`
                      : `${
                          (player.queue as Queue).size - tracks.length
                        } more tracks`
                  }`
                : ''
            }`,
            color: client.config.botColor,
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
      if (player.trackRepeat)
        return interaction.reply("Track loop is on, can't skip!");
      let count = interaction.options.getInteger('count');
      if (count) {
        player.skip(count);
      } else {
        count = 1;
        player.skip();
      }

      interaction.reply({
        content: `${
          count >= (player.queue as Queue).size
            ? 'Cleared the queue'
            : `Skipped ${count} tracks`
        }!`,
      });
      return;
    }
    if (interaction.options.getSubcommand() === 'remove') {
      let from = interaction.options.getInteger('from');
      let to = interaction.options.getInteger('to');
      if (from > (player.queue as Queue).size)
        return interaction.reply({
          content: 'Invalid from index',
        });
      if (to < from) return interaction.reply({ content: 'Invalid to index!' });
      if (to) {
        let removed = (player.queue as Queue).remove(from, to - (from - 1));
        interaction.reply({
          content: `Removed ${removed.map((x) => x.title).join(', ')} from queue!`,
        });
      } else {
        let removed = (player.queue as Queue).remove(from, 1);
        interaction.reply({
          content: `Removed ${String(removed[0].title)} from queue!`,
        });
      }
      return;
    }
    if (interaction.options.getSubcommand() === 'loop') {
      let mode = interaction.options.getString('mode');
      if (!mode)
        return interaction.reply({
          content: `Track loop is ${
            player.trackRepeat ? 'on' : 'off'
          } and Queue loop is ${player.queueRepeat ? 'on' : 'off'}.`,
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
        } and Queue loop is ${player.queueRepeat ? 'on' : 'off'}.`,
      });
      return;
    }
    if (interaction.options.getSubcommand() === 'pause') {
      if (player.paused)
        return interaction.reply({ content: 'Track is already paused!' });
      player.pause(true);

      interaction.reply({ content: 'Paused the current track!' });
      return;
    }
    if (interaction.options.getSubcommand() === 'volume') {
      let volumePercentage = interaction.options.getInteger('percentage');

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
    if (interaction.options.getSubcommand() === 'shuffle') {
      (player.queue as Queue).shuffle();
      interaction.reply({ content: 'Shuffled the queue!' });
    }
  },
});
