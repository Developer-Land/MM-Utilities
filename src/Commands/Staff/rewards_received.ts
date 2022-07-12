import { GuildTextBasedChannel, MessageEmbed } from 'discord.js';
import { Command } from '../../Structures/Command';

export default new Command({
  name: 'rewards_received',
  description: 'This command is only for SMP Staff',
  options: [
    {
      type: 'STRING',
      name: 'gamertag',
      description: 'Gamertag of the player',
      required: true,
    },
    {
      type: 'STRING',
      name: 'type',
      description: 'Select from above',
      required: true,
      choices: [
        {
          name: 'Chat Rewards',
          value: 'Chat Rewards',
        },
        {
          name: 'VC Rewards',
          value: 'VC Rewards',
        },
      ],
    },
    {
      type: 'STRING',
      name: 'rewards_he_received',
      description:
        'List of the rewards he received (e. g. 5x Block of Diamond, Full Diamond Armour)',
      required: true,
    },
    {
      type: 'STRING',
      name: 'goal_he_completed',
      description: 'The goal he completed (e. g. 200msg)',
      required: true,
    },
    {
      type: 'STRING',
      name: 'date',
      description: 'Input date here, in DD/MM/YYYY format (e. g. 04/12/2004)',
      required: true,
    },
    {
      type: 'STRING',
      name: 'time',
      description: 'Input time here, in 12hour format (e. g. 1:45 PM)',
      required: true,
    },
    {
      type: 'STRING',
      name: 'extra_information',
      description: 'This field is optional, you can write whatever you want',
    },
  ],

  category: 'Moderation & Management',
  run: async (client, interaction) => {
    let { options, guild, user } = interaction;

    if (
      interaction.member.roles.cache.has('882253716034568283') ||
      interaction.member.roles.cache.has('626015899425439744') ||
      interaction.member.permissions.has('ADMINISTRATOR')
    ) {
      let gamertag = options.getString('gamertag');
      let type = options.getString('type');
      let rewards_he_received = options.getString('rewards_he_received');
      let goal_he_completed = options.getString('goal_he_completed');
      let date = options.getString('date');
      let time = options.getString('time');
      let extra_information = options.getString('extra_information');
      if (!extra_information) extra_information = '`empty field`';
      let channelToSend = guild.channels.cache.get(
        '929428937929539655'
      ) as GuildTextBasedChannel;

      let embed = new MessageEmbed()
        .setColor(client.config.botColor)
        .setAuthor({
          name: user.tag,
          iconURL: user.displayAvatarURL({ size: 128, dynamic: true }),
        })
        .setDescription(`**${gamertag}** claimed \`${rewards_he_received}\``)
        .addFields([
          {
            name: 'Reward Type:',
            value: '`' + type + '`',
            inline: true,
          },
          {
            name: 'Goal He Completed:',
            value: '`' + goal_he_completed + '`',
            inline: true,
          },
          {
            name: 'Date:',
            value: '`' + date + '`',
            inline: true,
          },
          {
            name: 'Time:',
            value: '`' + time + '`',
            inline: true,
          },
          {
            name: 'Extra Information',
            value: extra_information,
            inline: false,
          },
        ]);

      channelToSend.send({ embeds: [embed] });
      return interaction.reply({
        content: `Done! Check ${channelToSend}`,
        ephemeral: true,
      });
    } else
      return interaction.reply({
        content: 'This command is only for **SMP Staff**!',
        ephemeral: true,
      });
  },
});
