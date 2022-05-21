import {
  Client,
  CommandInteraction,
  GuildTextBasedChannel,
  MessageEmbed,
} from 'discord.js';
import { Command } from '../../structures/Command';

export default new Command({
  name: 'json',
  description: 'Does many things with JSON',
  options: [
    {
      type: 'SUB_COMMAND',
      name: 'get',
      description: 'Gets JSON code for an existing message',
      options: [
        {
          type: 'STRING',
          name: 'message_url',
          description: 'The url of the message',
          required: true,
        },
        {
          type: 'BOOLEAN',
          name: 'hide',
          description: 'Hides the reply',
        },
      ],
    },
    {
      type: 'SUB_COMMAND_GROUP',
      name: 'embed',
      description: 'Creates and Edits embeds with JSON code',
      options: [
        {
          type: 'SUB_COMMAND',
          name: 'create',
          description: 'Creates an embed with JSON code',
          options: [
            {
              type: 'STRING',
              name: 'json_code',
              description: 'Insert an embed JSON here',
              required: true,
            },
            {
              type: 'CHANNEL',
              name: 'channel',
              description: 'The channel where this embed will be sent to',
              channelTypes: ['GUILD_TEXT'],
            },
          ],
        },
        {
          type: 'SUB_COMMAND',
          name: 'edit',
          description: 'Edits an embed with JSON code ',
          options: [
            {
              type: 'STRING',
              name: 'message_url',
              description: 'The url of the message',
              required: true,
            },
            {
              type: 'STRING',
              name: 'json_code',
              description: 'Insert an embed JSON here',
              required: true,
            },
          ],
        },
      ],
    },
  ],

  userPermissions: ['ADMINISTRATOR'],
  category: 'Moderation & Management',
  subcommands: ['json get', 'json embed create', 'json embed edit'],
  run: async (client, interaction) => {
    let errorEmbed = new MessageEmbed().setColor(client.config.errColor);
    let successEmbed = new MessageEmbed().setColor(client.config.botColor);

    let message_url = interaction.options.getString('message_url');
    let channel = interaction.options.getChannel('channel');
    try {
      function isMsgUrl(s) {
        var regexp =
          /https:\/\/(canary\.|ptb\.)?discord(app)?.com\/channels\/(\d?..................)\/(\d?..................)\/(\d?..................)/gi;
        return regexp.test(s);
      }

      if (interaction.options.getSubcommand() === 'get') {
        if (!isMsgUrl(message_url)) {
          errorEmbed.setDescription('Invalid message url!');
          return interaction.reply({
            embeds: [errorEmbed],
            ephemeral: true,
          });
        }

        let ids = message_url.split('/');

        let channelFromURL = interaction.guild.channels.cache.get(
          ids[ids.length - 2]
        ) as GuildTextBasedChannel;
        if (!channelFromURL) {
          errorEmbed.setDescription('Unknown message!');
          return interaction.reply({
            embeds: [errorEmbed],
            ephemeral: true,
          });
        }

        let targetMessage = await channelFromURL.messages.fetch(
          ids[ids.length - 1],
          {
            cache: true,
            force: true,
          }
        );

        if (!targetMessage) {
          errorEmbed.setDescription('Unknown message!');
          return interaction.reply({
            embeds: [errorEmbed],
            ephemeral: true,
          });
        }

        let content = targetMessage.content;
        if (!targetMessage.content) {
          content = null;
        }

        let obj = {
          username: targetMessage.author.username,
          avatar_url: targetMessage.author.displayAvatarURL(),
          content: content,
          embeds: targetMessage.embeds,
        };

        let idk = obj.embeds.reduce((accumulator, currentValue) => {
          return currentValue;
        }, {});

        Object.keys(idk).forEach((k) => idk[k] == null && delete idk[k]);

        let embed = new MessageEmbed()
          .setColor(client.config.botColor)
          .setAuthor({ name: 'JSON code' })
          .setDescription(`\`\`\`js\n${JSON.stringify(obj)}\`\`\``);
        return interaction.reply({
          embeds: [embed],
          ephemeral: interaction.options.getBoolean('hide'),
        });
      }
      let json_code = interaction.options.getString('json_code');
      let json = JSON.parse(json_code);

      if (interaction.options.getSubcommand() === 'create') {
        let channelToSend = channel as GuildTextBasedChannel;
        if (!channel)
          channelToSend = interaction.channel as GuildTextBasedChannel;

        if (json.embeds) {
          let embed = json.embeds;
          if (embed.length <= 10) {
            channelToSend.send({ embeds: [...embed] });
          } else {
            errorEmbed.setDescription(
              'Invalid embed structure! Embeds must be 10 or fewer in length.'
            );
            return interaction.reply({
              embeds: [errorEmbed],
              ephemeral: true,
            });
          }
        } else {
          channelToSend.send({ embeds: [json] });
        }

        if (channelToSend.id === interaction.channel.id) {
          successEmbed.setDescription(
            `Created embed with the provided JSON code.`
          );
          return interaction.reply({
            embeds: [successEmbed],
          });
        } else {
          successEmbed.setDescription(
            `Created embed with the provided JSON code. Check ${channelToSend}.`
          );
          return interaction.reply({
            embeds: [successEmbed],
          });
        }
      }

      if (interaction.options.getSubcommand() === 'edit') {
        if (!isMsgUrl(message_url)) {
          errorEmbed.setDescription('Invalid message url!');
          return interaction.reply({
            embeds: [errorEmbed],
            ephemeral: true,
          });
        }

        let ids = message_url.split('/');

        let channelFromURL = interaction.guild.channels.cache.get(
          ids[ids.length - 2]
        ) as GuildTextBasedChannel;
        if (!channelFromURL) {
          errorEmbed.setDescription('Unknown message!');
          return interaction.reply({
            embeds: [errorEmbed],
            ephemeral: true,
          });
        }

        let targetMessage = await channelFromURL.messages.fetch(
          ids[ids.length - 1],
          {
            cache: true,
            force: true,
          }
        );

        if (!targetMessage) {
          errorEmbed.setDescription('Unknown message!');
          return interaction.reply({
            embeds: [errorEmbed],
            ephemeral: true,
          });
        }

        if (targetMessage.author.id !== client.user?.id) {
          errorEmbed.setDescription(
            `Please provide a message url that was sent by <@${client.user?.id}>.`
          );
          return interaction.reply({
            embeds: [errorEmbed],
            ephemeral: true,
          });
        }

        if (json.embeds) {
          let embed = json.embeds;
          if (embed.length <= 10) {
            targetMessage.edit({ embeds: [...embed] });
          } else {
            errorEmbed.setDescription(
              'Invalid embed structure! Embeds must be 10 or fewer in length.'
            );
            return interaction.reply({
              embeds: [errorEmbed],
              ephemeral: true,
            });
          }
        } else {
          targetMessage.edit({ embeds: [json] });
        }
        successEmbed.setDescription(
          `Edited embed with the provided JSON code. [Jump!](${targetMessage.url})`
        );
        return interaction.reply({
          embeds: [successEmbed],
        });
      }
    } catch (error) {
      if (error.name === 'SyntaxError') {
        errorEmbed.setDescription(`Invalid JSON: ${error.message}`);
      } else {
        errorEmbed.setDescription(`${error.name}: ${error.message}`);
      }
      interaction.reply({
        embeds: [errorEmbed],
        ephemeral: true,
      });
      return;
    }
  },
});
