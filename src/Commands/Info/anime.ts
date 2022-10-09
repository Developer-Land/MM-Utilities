import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
} from 'discord.js';
import { getInfoFromURL } from 'mal-scraper';
import { request } from 'undici';
import { Command } from '../../Structures/Command';

export default new Command({
  name: 'anime_search',
  description: 'Find information about animes',
  options: [
    {
      name: 'type',
      description: 'Type of Search',
      type: ApplicationCommandOptionType.String,
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
      type: ApplicationCommandOptionType.String,
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

    interaction.reply('Fetching all animes').then(async () => {
      let mal = await request(
        `https://myanimelist.net/search/prefix.json?type=anime&keyword=${query}`
      ).then((res) => res.body.json());
      if (mal.categories[0].items.length === 0)
        return interaction.editReply({
          content: 'no Animes found',
          embeds: [],
        });
      let AnimeSearch = mal.categories[0].items;
      let first5AnimeSearch = AnimeSearch.slice(0, 5);
      let second5AnimeSearch = AnimeSearch.slice(5, 10);
      let titles = AnimeSearch.map((m, i) => {
        let line = `${i + 1} - ${m.name}`;
        return line;
      });
      let embed = new EmbedBuilder()
        .setDescription(titles.join('\n'))
        .setColor(client.config.botColor);
      let row1 = new ActionRowBuilder<MessageActionRowComponentBuilder>();
      let row2 = new ActionRowBuilder<MessageActionRowComponentBuilder>();
      for (let i = 0; i < first5AnimeSearch.length; i++) {
        row1.addComponents(
          new ButtonBuilder()
            .setCustomId(`anime.${first5AnimeSearch[i].id.toString()}.${i}`)
            .setLabel((i + 1).toString())
            .setStyle(ButtonStyle.Secondary)
        );
      }
      for (let i = 0; i < second5AnimeSearch.length; i++) {
        row2.addComponents(
          new ButtonBuilder()
            .setCustomId(
              `anime.${second5AnimeSearch[i].id.toString()}.${i + 5}`
            )
            .setLabel((i + 6).toString())
            .setStyle(ButtonStyle.Secondary)
        );
      }
      interaction.editReply({
        content: 'Fetched all animes select a number',
        embeds: [embed],
        components: [row1, row2],
      });
      let filter = (i: ButtonInteraction) => i.user.id === interaction.user.id;
      let collector = interaction.channel.createMessageComponentCollector({
        componentType: ComponentType.Button,
        max: 1,
        filter,
        time: 20000,
      });
      collector.on('collect', async (i) => {
        if (i.customId.startsWith('anime.')) {
          let id = i.customId.split('.')[2];
          let AnimeData = await getInfoFromURL(AnimeSearch[id].url);
          let AnimeEmbed = new EmbedBuilder()
            .setTitle(AnimeData.title)
            .setURL(AnimeData.url)
            .setThumbnail(AnimeData.picture)
            .setDescription(AnimeData.synopsis)
            .setColor(client.config.botColor)
            .addFields(
              {
                name: '🎞️ Trailer',
                value: `[Youtube trailer link](${
                  AnimeData.trailer ? AnimeData.trailer : '_gs0cgrmzmE'
                })`,
                inline: true,
              },
              {
                name: '⏳ Status',
                value: `${AnimeData.status ? AnimeData.status : 'N/A'}`,
                inline: true,
              },
              { name: '🗂️ Type', value: AnimeData.type, inline: true },
              {
                name: '➡️ Genres',
                value: `${
                  AnimeData.genres.map((x) => x).join(', ')
                    ? AnimeData.genres.map((x) => x).join(', ')
                    : '.'
                }`,
                inline: true,
              },
              {
                name: '🗓️ Aired',
                value: `${AnimeData.aired ? AnimeData.aired : 'N/A'}`,
                inline: true,
              },
              {
                name: '📀 Total Episodes',
                value: `${AnimeData.episodes ? AnimeData.episodes : 'N/A'}`,
                inline: true,
              },
              {
                name: '⏱️ Episode Duration',
                value: `${
                  `${AnimeData.duration} (${AnimeData.scoreStats})`
                    ? AnimeData.duration
                    : '?'
                } minutes`,
                inline: true,
              },
              {
                name: '⭐ Average Score',
                value: `${AnimeData.score ? AnimeData.score : '?'}/100`,
                inline: true,
              },
              {
                name: '🏆 Rank',
                value: `Top ${AnimeData.ranked ? AnimeData.ranked : 'N/A'}`,
                inline: true,
              }
            );
          interaction.editReply({
            content: 'Here is your anime info',
            embeds: [AnimeEmbed],
            components: [],
          });
        }
      });
    });
  },
});
