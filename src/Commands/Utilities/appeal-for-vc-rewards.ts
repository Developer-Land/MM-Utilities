import { Command } from '../../Structures/Command';

import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  GuildTextBasedChannel,
  MessageActionRowComponentBuilder,
} from 'discord.js';

export default new Command({
  name: 'appeal_for_vc_rewards',
  description: 'Appeal for VC rewards after reaching the goal',
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'gamertag',
      description: 'Your gamertag',
      required: true,
    },
    {
      type: ApplicationCommandOptionType.String,
      name: 'goal_you_reached',
      description: 'The goal you reached',
      required: true,
      choices: [
        {
          name: '2 hours',
          value: '2',
        },
        {
          name: '6 hours',
          value: '6',
        },
        {
          name: '12 hours',
          value: '12',
        },
        {
          name: '28 hours',
          value: '28',
        },
        {
          name: '50 hours',
          value: '50',
        },
        {
          name: '72 hours',
          value: '72',
        },
        {
          name: '100 hours',
          value: '100',
        },
        {
          name: '160 hours',
          value: '160',
        },
        {
          name: '200 hours',
          value: '200',
        },
        {
          name: '250 hours',
          value: '250',
        },
        {
          name: '300 hours',
          value: '300',
        },
      ],
    },
    {
      type: ApplicationCommandOptionType.String,
      name: 'coordinates',
      description: 'Your coordinates',
      required: true,
    },
  ],
  category: 'Utilities',
  run: async (client, interaction) => {
    let appealChannel = interaction.guild.channels.cache.get(
      '926160270643052585'
    ) as GuildTextBasedChannel;

    let { options, user } = interaction;

    let gamertag = options.getString('gamertag');
    let goal = options.getString('goal_you_reached');
    let cords = options.getString('coordinates');

    try {
      let appealEmbed = new EmbedBuilder()
        .setAuthor({
          name: `${user.tag}〡VC Rewards`,
          iconURL: user.displayAvatarURL({ size: 128 }),
        })
        .setColor(client.config.botColor)
        .setDescription(
          'Hit the "**`Claimed`**" button below after the player has claimed his rewards.'
        )
        .addFields(
          { name: '👤 Gamertag:', value: '`' + gamertag + '`', inline: true },
          {
            name: '<:vc:926496687688650803> Goal reached:',
            value: `\`${goal} hours\``,
            inline: true,
          },
          {
            name: '<a:MM_pet69:880814964871417856> Coordinates:',
            value: '`' + cords + '`',
            inline: true,
          }
        )
        .setTimestamp()
        .setFooter({ text: 'Timestamp・' });

      let claimedButton =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setLabel('Claimed')
            .setCustomId('appeal_for_rewards_claimed_button')
        );

      appealChannel.send({
        embeds: [appealEmbed],
        components: [claimedButton],
      });

      let sucEmbed = new EmbedBuilder()
        .setColor(client.config.botColor)
        .setAuthor({
          name: 'Rewards',
          iconURL:
            'https://cdn.discordapp.com/emojis/759421822084448307.gif?v=1&size=128',
        })
        .setDescription(
          '<:MM_yesyesyes:909139323692154880> Successfully appealed!'
        )
        .addFields(
          {
            name: '👤 Gamertag:',
            value: '`' + gamertag + '`',
            inline: true,
          },
          {
            name: '<:vc:926496687688650803> Goal reached:',
            value: `\`${goal} hours\``,
            inline: true,
          },
          {
            name: '<a:MM_pet69:880814964871417856> Coordinates:',
            value: '`' + cords + '`',
            inline: true,
          }
        );

      user.send({
        embeds: [sucEmbed],
      });

      return interaction.reply({
        content: '🎊 Successfully appealed!',
      });
    } catch (error) {
      console.log('appeal_for_vc_rewards.js error: ' + error.message);
    }
  },
});
