import { lavalink } from '../../Utils/lavalink';
import axios from 'axios';
import { MessageEmbed } from 'discord.js';

const getLyrics = (title) =>
  new Promise(async (ful, rej) => {
    const url = new URL('https://some-random-api.ml/lyrics');
    url.searchParams.append('title', title);

    try {
      const { data } = await axios.get(url.href);
      ful(data);
    } catch (error) {
      rej(error);
    }
  });

const substring = (length, value) => {
  const replaced = value.replace(/\n/g, '--');
  const regex = `.{1,${length}}`;
  const lines = replaced
    .match(new RegExp(regex, 'g'))
    .map((line) => line.replace(/--/g, '\n'));

  return lines;
};

const createResponse = async (title) => {
  try {
    const data = (await getLyrics(title)) as any;

    const embeds = substring(4096, data.lyrics).map((value, index) => {
      const isFirst = index === 0;

      return new MessageEmbed({
        title: isFirst ? `${data.title} - ${data.author}` : null,
        thumbnail: isFirst ? { url: data.thumbnail.genius } : null,
        description: value,
      });
    });

    return { embeds };
  } catch (error) {
    return 'I am not able to find lyrics for this song :(';
  }
};

module.exports = {
  name: 'lyrics',
  description: 'display lyrics for the current song or a specific song',
  options: [
    {
      name: 'title',
      description: 'specific song for lyrics',
      type: 'STRING',
      required: false,
    },
  ],
  category: 'Music',
  run: async (client, interaction) => {
    const player = lavalink.players.get(interaction.guild.id);
    const title = interaction.options.getString('title');
    const sendLyrics = (songTitle) => {
      return createResponse(songTitle)
        .then((res) => {
          console.log({ res });
          interaction.reply(res);
        })
        .catch((err) => console.log({ err }));
    };

    if (title) return sendLyrics(title);

    if (!player?.playing)
      return interaction.reply({
        content: 'No music is currently being played',
      });

    return sendLyrics(player.current.title);
  },
};
