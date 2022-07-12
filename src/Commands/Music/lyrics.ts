import axios from 'axios';
import { MessageEmbed } from 'discord.js';
import { Command } from '../../Structures/Command';
import { lavalink } from '../../Systems/lavalink';

let getLyrics = (title) =>
  new Promise(async (ful, rej) => {
    let url = new URL('https://some-random-api.ml/lyrics');
    url.searchParams.append('title', title);

    try {
      let { data } = await axios.get(url.href);
      ful(data);
    } catch (error) {
      rej(error);
    }
  });

let substring = (length, value) => {
  let replaced = value.replace(/\n/g, '--');
  let regex = `.{1,${length}}`;
  let lines = replaced
    .match(new RegExp(regex, 'g'))
    .map((line) => line.replace(/--/g, '\n'));

  return lines;
};

let createResponse = async (title) => {
  try {
    let data = (await getLyrics(title)) as any;

    let embeds = substring(4096, data.lyrics).map((value, index) => {
      let isFirst = index === 0;

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

export default new Command({
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
    let player = lavalink.players.get(interaction.guild.id);
    let title = interaction.options.getString('title');
    let sendLyrics = (songTitle) => {
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
});
