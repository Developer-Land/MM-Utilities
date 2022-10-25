import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
  resolveColor,
} from 'discord.js';
import { leveling } from '../../Models/Leveling/leveling';
import { Command } from '../../Structures/Command';

export default new Command({
  name: 'leaderboard',
  description: 'Check the leaderboard',
  options: [
    {
      name: 'page',
      description: 'The page you want to check',
      type: ApplicationCommandOptionType.Number,
      required: false,
      minValue: 1,
    },
  ],

  category: 'Info',
  run: async (client, interaction) => {
    interaction.reply({ content: 'Generating leaderboard!' });
    let optionPage = interaction.options.getNumber('page');
    let page = 1;
    if (optionPage) {
      page = optionPage;
    }
    let users = await leveling
      .find({ guildID: interaction.guildId })
      .sort({ xp: 'descending' })
      .exec();

    let generateEmbed = async (start: number) => {
      let current = users.slice(start, start + 10);
      let computedArray = [];
      current.map((key) =>
        computedArray.push({
          guildID: key.guildID,
          userID: key.userID,
          xp: key.xp,
          level: key.level,
          position:
            current.findIndex(
              (i) => i.guildID === key.guildID && i.userID === key.userID
            ) + 1,
        })
      );

      return new EmbedBuilder({
        title: `Leaderboard`,
        color: resolveColor(client.config.botColor),
        description:
          current.length < 1
            ? 'Page not found!'
            : computedArray
                .map((e) => {
                  `**${e.position + (page - 1) * 10}.** <@${
                    e.userID
                  }>, Level: ${e.level} (${Math.floor(
                    e.xp
                  ).toLocaleString()} XP)`;
                })
                .join('\n'),
      });
    };

    let canFitOnOnePage = users.length <= 10;
    let backButton = new ButtonBuilder({
      style: ButtonStyle.Secondary,
      label: 'Back',
      emoji: '⬅️',
      customId: 'leaderboardBack',
    });
    let forwardButton = new ButtonBuilder({
      style: ButtonStyle.Secondary,
      label: 'Forward',
      emoji: '➡️',
      customId: 'leaderboardForward',
    });

    interaction.editReply({
      embeds: [await generateEmbed(page - 1)],
      components: canFitOnOnePage
        ? []
        : [
            new ActionRowBuilder<MessageActionRowComponentBuilder>({
              components: [forwardButton],
            }),
          ],
    });
    if (canFitOnOnePage) return;
    let filter = (i) => i.user.id === interaction.user.id;
    let collector = interaction.channel.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter,
      time: 20000,
    });
    let currentIndex = 0;
    collector.on('collect', async (i) => {
      if (i.customId === 'leaderboardBack') {
        currentIndex -= 10;
        await i.update({
          embeds: [await generateEmbed(currentIndex)],
          components: [
            new ActionRowBuilder<MessageActionRowComponentBuilder>({
              components: [
                ...(currentIndex ? [backButton] : []),
                ...(currentIndex + 10 < users.length ? [forwardButton] : []),
              ],
            }),
          ],
        });
      } else if (i.customId === 'leaderboardForward') {
        currentIndex += 10;
        await i.update({
          embeds: [await generateEmbed(currentIndex)],
          components: [
            new ActionRowBuilder<MessageActionRowComponentBuilder>({
              components: [
                ...(currentIndex ? [backButton] : []),
                ...(currentIndex + 10 < users.length ? [forwardButton] : []),
              ],
            }),
          ],
        });
      } else {
        collector.stop('not valid button');
      }
    });
  },
});
