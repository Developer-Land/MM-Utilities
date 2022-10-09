import { getVoiceConnection } from '@discordjs/voice';
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ComponentType,
  MessageActionRowComponentBuilder,
  resolveColor,
  SelectMenuBuilder,
  SelectMenuInteraction,
} from 'discord.js';
import moment from 'moment';
import { Track } from 'vulkava';
import { Command } from '../../Structures/Command';
import { ExtendedPlayer } from '../../Structures/ExtendedPlayer';
import { Queue } from '../../Structures/lavalinkQueue';
import { lavalink } from '../../Systems/lavalink';

export default new Command({
  name: 'music',
  description: 'main music command',
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'play',
      description: 'play a track',
      options: [
        {
          name: 'query',
          description: 'The track you want to play',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: 'force',
          description: 'Force the track to play',
          type: ApplicationCommandOptionType.Boolean,
          required: false,
        },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'search',
      description: 'search tracks',
      options: [
        {
          name: 'query',
          description: 'The tracks you want to search',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'nowplaying',
      description: 'shows information about the current track',
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'queue',
      description: 'display the track queue',
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'skip',
      description: 'skip track(s)',
      options: [
        {
          name: 'count',
          description: 'how many track to skip',
          type: ApplicationCommandOptionType.Integer,
          minValue: 2,
          required: false,
        },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'remove',
      description: 'remove tracks from queue',
      options: [
        {
          name: 'from',
          description: 'the from index to start removing',
          type: ApplicationCommandOptionType.Integer,
          minValue: 1,
          required: true,
        },
        {
          name: 'to',
          description: 'the to index to stop removing',
          type: ApplicationCommandOptionType.Integer,
          minValue: 1,
          required: true,
        },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'loop',
      description: 'loop Off/Track/Queue',
      options: [
        {
          name: 'mode',
          description: 'loop mode',
          type: ApplicationCommandOptionType.String,
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
      type: ApplicationCommandOptionType.Subcommand,
      name: 'autoplay',
      description: 'autoplay on/off',
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'resume',
      description: 'resume the current track',
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'pause',
      description: 'pause the current track',
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'volume',
      description: 'change or check the volume of the current track',
      options: [
        {
          name: 'percentage',
          description: 'percentage to change the volume to',
          type: ApplicationCommandOptionType.Integer,
          required: false,
          minValue: 1,
          maxValue: 500,
        },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'shuffle',
      description: 'shuffle the queue',
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
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
    'music autoplay',
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

      let menu = new SelectMenuBuilder()
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
      let raw =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          menu
        );
      await interaction.editReply({
        content: 'Select tracks from menu',
        components: [raw],
      });
      let filter = (i: SelectMenuInteraction) =>
        i.user.id === interaction.user.id;
      let collector = interaction.channel.createMessageComponentCollector({
        componentType: ComponentType.SelectMenu,
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
      if (!interaction.member.permissions.has('MoveMembers'))
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
            color: resolveColor(client.config.botColor),
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
            }${(player as ExtendedPlayer).isAutoplay ? ' (Autoplay)' : ''}`,
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
            color: resolveColor(client.config.botColor),
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
          !player.current ? 'Cleared the queue' : `Skipped ${count} tracks`
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
      let removed = (player.queue as Queue).remove(from, to - (from - 1));
      interaction.reply({
        content: `Removed ${removed
          .map((x) => x.title)
          .join(', ')} from queue!`,
      });
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
    if (interaction.options.getSubcommand() === 'autoplay') {
      (player as ExtendedPlayer).setAutoplay =
        ExtendedPlayer.prototype.setAutoplay;
      (player as ExtendedPlayer).autoplay = ExtendedPlayer.prototype.autoplay;
      if ((player as ExtendedPlayer).isAutoplay) {
        (player as ExtendedPlayer).setAutoplay(false);
        return interaction.reply({ content: 'Autoplay is now off!' });
      }
      (player as ExtendedPlayer).setAutoplay(true);
      await (player as ExtendedPlayer).autoplay(lavalink);
      return interaction.reply({ content: 'Autoplay is now on!' });
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
      return;
    }
  },
});
