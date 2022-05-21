import { Command } from '../../structures/Command';

import {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  GuildTextBasedChannel,
} from 'discord.js';

export default new Command({
  name: 'appeal_for_chat_rewards',
  description: 'Appeal for chat rewards after reaching the goal',
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
      choices: [
        {
          name: '200 messages',
          value: '200',
        },
        {
          name: '420 messages',
          value: '420',
        },
        {
          name: '690 messages',
          value: '690',
        },
        {
          name: '1,000 messages',
          value: '1000',
        },
        {
          name: '1,500 messages',
          value: '1500',
        },
        {
          name: '2,000 messages',
          value: '2000',
        },
        {
          name: '3,000 messages',
          value: '3000',
        },
        {
          name: '4,000 messages',
          value: '4000',
        },
        {
          name: '5,000 messages',
          value: '5000',
        },
        {
          name: '6,000 messages',
          value: '6000',
        },
      ],
    },
    {
      name: 'coordinates',
      description: 'Your coordinates',
      type: 'STRING',
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
          name: `${user.tag}〡Chat Rewards`,
          iconURL: user.displayAvatarURL({ size: 128, dynamic: true }),
        })
        .setColor(client.config.botColor)
        .setDescription(
          'Hit the "**`Claimed`**" button below after the player has claimed his rewards.'
        )
        .addField('👤 Gamertag:', '`' + gamertag + '`', true)
        .addField(
          '<a:chatting:926496559993094194> Goal reached:',
          `\`${goal} messages\``,
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
          '<a:chatting:926496559993094194> Goal reached:',
          `\`${goal} messages\``,
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
      console.log('appeal_for_chat_rewards.js error: ' + error.message);
    }
  },
});
