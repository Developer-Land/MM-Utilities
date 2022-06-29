import {
  ButtonInteraction,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from 'discord.js';
import { getInfoFromURL } from 'mal-scraper';
import fetch from 'node-fetch';
import { Command } from '../../structures/Command';

export default new Command({
  name: 'anime_search',
  description: 'Find information about animes',
  options: [
    {
      name: 'type',
      description: 'Type of Search',
      type: 'STRING',
      required: true,
      choices: [
        {
          name: 'id',
          value: 'id',
        },
        {
          name: 'name',
          value: 'text',
        },
      ],
    },
    {
      name: 'query',
      description: 'Name or Id of the anime',
      type: 'STRING',
      required: true,
    },
  ],
  category: 'Info',
  run: async (client, interaction) => {
    let query = interaction.options.getString('query');
    let SearchType = interaction.options.getString('type');

    if (SearchType === 'id') {
      query = (await getInfoFromURL(`https://myanimelist.net/anime/${query}`))
        .title;
    }

    interaction.reply('Fetching all animes').then(() => {
      fetch(
        `https://myanimelist.net/search/prefix.json?type=anime&keyword=${query}`
      )
        .then((res) => res.json())
        .then(async (mat) => {
          if (mat.categories[0].items.length === 0)
            return interaction.editReply({
              content: 'no Animes found',
              embeds: [],
            });
          let AnimeSearch = mat.categories[0].items;
          let first5AnimeSearch = AnimeSearch.items.slice(0, 5);
          let second5AnimeSearch = AnimeSearch.items.slice(5, 10);
          let titles = AnimeSearch.map((m, i) => {
            let line = `${i + 1} - ${m.name}`;
            return line;
          });
          let embed = new MessageEmbed()
            .setDescription(titles.join('\n'))
            .setColor(client.config.botColor);
          let row1 = new MessageActionRow();
          let row2 = new MessageActionRow();
          for (let i = 0; i < first5AnimeSearch.length; i++) {
            row1.addComponents(
              new MessageButton()
                .setCustomId(`anime.${first5AnimeSearch[i].id.toString()}.${i}`)
                .setLabel((i + 1).toString())
                .setStyle('SECONDARY')
            );
          }
          for (let i = 0; i < second5AnimeSearch.length; i++) {
            row2.addComponents(
              new MessageButton()
                .setCustomId(
                  `anime.${second5AnimeSearch[i].id.toString()}.${i + 5}`
                )
                .setLabel((i + 6).toString())
                .setStyle('SECONDARY')
            );
          }
          interaction.editReply({
            content: 'Fetched all animes select a number',
            embeds: [embed],
            components: [row1, row2],
          });
          let filter = (i: ButtonInteraction) =>
            i.user.id === interaction.user.id;
          let collector = interaction.channel.createMessageComponentCollector({
            componentType: 'BUTTON',
            max: 1,
            filter,
            time: 20000,
          });
          collector.on('collect', async (i) => {
            if (i.customId.startsWith('anime.')) {
              let id = i.customId.split('.')[2];
              let AnimeData = await getInfoFromURL(AnimeSearch[id].url);
              let genres: string[] = AnimeData.genres;
              let AnimeEmbed = new MessageEmbed()
                .setTitle(AnimeData.title)
                .setURL(AnimeData.url)
                .setThumbnail(AnimeData.picture)
                .setDescription(AnimeData.synopsis)
                .setColor(client.config.botColor)
                .addField(
                  '🎞️ Trailer',
                  `[Youtube trailer link](${
                    AnimeData.trailer ? AnimeData.trailer : '_gs0cgrmzmE'
                  })`,
                  true
                )
                .addField(
                  '⏳ Status',
                  `${AnimeData.status ? AnimeData.status : 'N/A'}`,
                  true
                )
                .addField('🗂️ Type', AnimeData.type, true)
                .addField(
                  '➡️ Genres',
                  `${
                    genres.map((x) => x).join(', ')
                      ? genres.map((x) => x).join(', ')
                      : '.'
                  }`,
                  true
                )
                .addField(
                  '🗓️ Aired',
                  `${AnimeData.aired ? AnimeData.aired : 'N/A'}`,
                  true
                )
                .addField(
                  '📀 Total Episodes',
                  `${AnimeData.episodes ? AnimeData.episodes : 'N/A'}`,
                  true
                )
                .addField(
                  '⏱️ Episode Duration',
                  `${
                    `${AnimeData.duration} (${AnimeData.scoreStats})`
                      ? AnimeData.duration
                      : '?'
                  } minutes`,
                  true
                )
                .addField(
                  '⭐ Average Score',
                  `${AnimeData.score ? AnimeData.score : '?'}/100`,
                  true
                )
                .addField(
                  '🏆 Rank',
                  `Top ${AnimeData.ranked ? AnimeData.ranked : 'N/A'}`,
                  true
                );
              interaction.editReply({
                content: 'Here is your anime info',
                embeds: [AnimeEmbed],
                components: [],
              });
            }
          });
        });
    });
  },
});
