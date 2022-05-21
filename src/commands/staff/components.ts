import { MessageEmbed } from 'discord.js';

module.exports = {
  name: 'components',
  description: 'description',
  options: [
    {
      type: 'SUB_COMMAND',
      name: 'remove',
      description: 'Removes all components from the provided message',
      options: [
        {
          type: 'STRING',
          name: 'message_url',
          description: 'URL of the message',
          required: true,
        },
      ],
    },
  ],

  userPermissions: ['ADMINISTRATOR'],
  category: 'Moderation & Management',
  subcommands: ['components remove'],
  run: async (client, interaction) => {
    const message_url = interaction.options.getString('message_url');

    const errSend = (message) => {
      const errEmbed = new MessageEmbed()
        .setColor(client.config.errColor)
        .setDescription(message);

      interaction.reply({
        embeds: [errEmbed],
        ephemeral: true,
      });
    };
    const isMsgUrl = (s: string) => {
      var regexp =
        /https:\/\/(canary\.|ptb\.)?discord(app)?.com\/channels\/(\d?..................)\/(\d?..................)\/(\d?..................)/gi;
      return regexp.test(s);
    };

    if (!isMsgUrl(message_url)) {
      return errSend('Invalid message url!');
    }

    const ids = message_url.split('/');

    const channel = interaction.guild.channels.cache.get(ids[ids.length - 2]);
    if (!channel) return errSend('Unknown message!');

    const targetMessage = await channel.messages.fetch(ids[ids.length - 1], {
      cache: true,
      force: true,
    });

    if (!targetMessage) return errSend('Unknown message!');

    if (targetMessage.author.id !== client.user?.id)
      return errSend(
        `Please provide a message url that was sent by <@${client.user?.id}>.`
      );

    targetMessage.edit({
      components: [],
    });

    return interaction.reply({
      content: `[Jump!](${targetMessage.url})`,
      ephemeral: true,
    });
  },
};
