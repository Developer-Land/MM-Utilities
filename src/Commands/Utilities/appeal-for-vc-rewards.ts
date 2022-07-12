import { Command } from '../../Structures/Command';

import {
  GuildTextBasedChannel,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from 'discord.js';

export default new Command({
  name: 'appeal_for_vc_rewards',
  description: 'Appeal for VC rewards after reaching the goal',
  options: [
    {
      type: 'STRING',
      name: 'gamertag',
      description: 'Your gamertag',
      required: true,
    },
    {
      type: 'STRING',
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
      type: 'STRING',
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
      let appealEmbed = new MessageEmbed()
        .setAuthor({
          name: `${user.tag}〡VC Rewards`,
          iconURL: user.displayAvatarURL({ size: 128, dynamic: true }),
        })
        .setColor(client.config.botColor)
        .setDescription(
          'Hit the "**`Claimed`**" button below after the player has claimed his rewards.'
        )
        .addField('👤 Gamertag:', '`' + gamertag + '`', true)
        .addField(
          '<:vc:926496687688650803> Goal reached:',
          `\`${goal} hours\``,
          true
        )
        .addField(
          '<a:MM_pet69:880814964871417856> Coordinates:',
          '`' + cords + '`',
          true
        )
        .setTimestamp()
        .setFooter({ text: 'Timestamp・' });

      let claimedButton = new MessageActionRow().addComponents(
        new MessageButton()
          .setStyle('SECONDARY')
          .setLabel('Claimed')
          .setCustomId('appeal_for_rewards_claimed_button')
      );

      appealChannel.send({
        embeds: [appealEmbed],
        components: [claimedButton],
      });

      let sucEmbed = new MessageEmbed()
        .setColor(client.config.botColor)
        .setAuthor({
          name: 'Rewards',
          iconURL:
            'https://cdn.discordapp.com/emojis/759421822084448307.gif?v=1&size=128',
        })
        .setDescription(
          '<:MM_yesyesyes:909139323692154880> Successfully appealed!'
        )
        .addField('👤 Gamertag:', '`' + gamertag + '`', true)
        .addField(
          '<:vc:926496687688650803> Goal reached:',
          `\`${goal} hours\``,
          true
        )
        .addField(
          '<a:MM_pet69:880814964871417856> Coordinates:',
          '`' + cords + '`',
          true
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
