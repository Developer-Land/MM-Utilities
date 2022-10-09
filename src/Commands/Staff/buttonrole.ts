import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  GuildTextBasedChannel,
  MessageActionRowComponentBuilder,
  Role,
} from 'discord.js';
import { Command } from '../../Structures/Command';

export default new Command({
  name: 'buttonrole',
  description: 'Adds buttonrole to a messsge that was sent by Acer',
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'add',
      description: 'Adds a buttonrole to a message that was sent by Acer',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'message_url',
          description:
            'The url of the message you want to add the buttonrole to',
          required: true,
        },
        {
          type: ApplicationCommandOptionType.Role,
          name: 'role',
          description:
            'The role that you want to give or remove by pressing the button',
          required: true,
        },
        {
          type: ApplicationCommandOptionType.Number,
          name: 'type',
          description: 'Type of the buttonrole (select from above)',
          required: true,
          choices: [
            {
              name: 'Toggle - gives the role when you press it and removes when you press it again',
              value: ButtonStyle.Primary,
            },
            {
              name: 'Add - roles can only be picked up, not removed',
              value: ButtonStyle.Success,
            },
            {
              name: 'Remove - roles can only be removed, not picked up',
              value: ButtonStyle.Danger,
            },
          ],
        },
        {
          type: ApplicationCommandOptionType.Number,
          name: 'style',
          description: 'The style of the button. (select from above)',
          choices: [
            {
              name: 'Blurple',
              value: ButtonStyle.Primary,
            },
            {
              name: 'Green',
              value: ButtonStyle.Success,
            },
            {
              name: 'Gray',
              value: ButtonStyle.Secondary,
            },
            {
              name: 'Red',
              value: ButtonStyle.Danger,
            },
          ],
        },
        {
          type: ApplicationCommandOptionType.String,
          name: 'emoji',
          description:
            'The emoji of the button (type "none" if you don\'t want any emoji)',
        },
        {
          type: ApplicationCommandOptionType.String,
          name: 'label',
          description: 'The label text of the Button',
        },
        {
          type: ApplicationCommandOptionType.Role,
          name: 'role_2',
          description: '2nd role',
        },
        {
          type: ApplicationCommandOptionType.Role,
          name: 'role_3',
          description: '3rd role',
        },
        {
          type: ApplicationCommandOptionType.Role,
          name: 'role_4',
          description: '4th role',
        },
        {
          type: ApplicationCommandOptionType.Role,
          name: 'role_5',
          description: '5th role',
        },
      ],
    },
  ],

  userPermissions: ['Administrator'],
  category: 'Moderation & Management',
  subcommands: ['buttonrole add'],
  run: async (client, interaction) => {
    let { options } = interaction;

    let errSend = (message) => {
      let errEmbed = new EmbedBuilder()
        .setColor(client.config.errColor)
        .setDescription(message);

      interaction.reply({
        embeds: [errEmbed],
        ephemeral: true,
      });
    };

    let message_url = options.getString('message_url');
    let role = options.getRole('role') as Role;
    let role2 = options.getRole('role_2');
    let role3 = options.getRole('role_3');
    let role4 = options.getRole('role_4');
    let role5 = options.getRole('role_5');
    let type = options.getNumber('type');
    let emoji = options.getString('emoji')?.toLowerCase();
    let label = options.getString('label');
    let style = options.getNumber('style');

    try {
      let isMsgUrl = (s) => {
        var regexp =
          /https:\/\/(canary\.|ptb\.)?discord(app)?.com\/channels\/(\d?..................)\/(\d?..................)\/(\d?..................)/gi;
        return regexp.test(s);
      };

      if (!isMsgUrl(message_url)) {
        return errSend('Invalid message url!');
      }

      let ids = message_url.split('/');

      let channel = interaction.guild.channels.cache.get(
        ids[ids.length - 2]
      ) as GuildTextBasedChannel;
      if (!channel) return errSend('Unknown message!');

      let targetMessage = await channel.messages.fetch({
        message: ids[ids.length - 1],
        cache: true,
        force: true,
      });

      if (!targetMessage) return errSend('Unknown message!');

      if (targetMessage.author.id !== client.user?.id)
        return errSend(
          `Please provide a message url that was sent by <@${client.user?.id}>.`
        );

      let count = 1;
      if (role2) count += 1;
      if (role3) count += 1;
      if (role4) count += 1;
      if (role5) count += 1;

      let realType;
      switch (type) {
        case ButtonStyle.Success: {
          realType = 'Add';
          break;
        }
        case ButtonStyle.Primary: {
          realType = 'Toggle';
          break;
        }
        case ButtonStyle.Danger: {
          realType = 'Remove';
          break;
        }
      }

      if (!label) {
        if (count < 2) label = role.name;
        else {
          label = `${realType} ${count} Roles`;
        }
      }

      if (!style) style = type;

      if (!emoji) {
        switch (type) {
          case ButtonStyle.Success: {
            emoji = '➕';
            break;
          }
          case ButtonStyle.Danger: {
            emoji = '🗑️';
            break;
          }
          case ButtonStyle.Primary: {
            emoji = '936267150811881564';
            break;
          }
        }
      }

      if (emoji === 'none') emoji = '';

      if (role.managed) return errSend("You can't use managed roles!");

      if (
        interaction.guild.members.me.roles.highest.rawPosition <=
        role.rawPosition
      )
        return errSend('The role have to be below me!');

      let btnType;
      switch (type) {
        case ButtonStyle.Success: {
          btnType = 'a';
          break;
        }
        case ButtonStyle.Danger: {
          btnType = 'r';
          break;
        }
        case ButtonStyle.Primary: {
          btnType = 't';
          break;
        }
      }

      let customIdArray = [role.id + btnType];

      if (role2) customIdArray.push(role2?.id + btnType);
      if (role3) customIdArray.push(role3?.id + btnType);
      if (role4) customIdArray.push(role4?.id + btnType);
      if (role5) customIdArray.push(role5?.id + btnType);

      let button = new ButtonBuilder()
        .setLabel(label)
        .setStyle(style)
        .setEmoji(emoji)
        .setCustomId(customIdArray.join(' '));

      let row = ActionRowBuilder.from(
        targetMessage.components[0]
      ) as ActionRowBuilder<MessageActionRowComponentBuilder>;

      if (!row) row = new ActionRowBuilder<MessageActionRowComponentBuilder>();

      let c = row.components;

      if (c.length > 5)
        return errSend('You cannot add more than 5 components on a message!');

      c.push(button);

      targetMessage.edit({
        components: [row],
      });

      //Designing the reply Embed (Literally took me 70 lines :wtfman:)
      let typeinrp = realType; //"Type" in reply.

      let styleinrp; //"Style" in reply.
      switch (style) {
        case ButtonStyle.Primary: {
          styleinrp = 'Blurple';
          break;
        }
        case ButtonStyle.Secondary: {
          styleinrp = 'Gray';
          break;
        }
        case ButtonStyle.Success: {
          styleinrp = 'Green';
          break;
        }
        case ButtonStyle.Danger: {
          styleinrp = 'Red';
          break;
        }
        default: {
          styleinrp = 'Default';
          break;
        }
      }

      //"Emoji" in reply.
      let emojiinrp = emoji;
      if (emoji === '') emojiinrp = 'None';
      if (!options.getString('emoji')) emojiinrp = 'Default';

      //"Label" in reply.
      let labelinrp = label;
      if (!options.getString('label')) labelinrp = 'Default';

      //"Roles" in reply.
      let rolesinrp = customIdArray
        .map((x) => x.replace(/a|r|t/g, ''))
        .join('>, <@&');

      let replyEmbed = new EmbedBuilder()
        .setColor(client.config.botColor)
        .setDescription('**Button Role successfully added.**')
        .addFields(
          { name: 'Role', value: '<@&' + rolesinrp + '>' },
          { name: 'Type', value: typeinrp },
          { name: 'Style', value: styleinrp },
          { name: 'Emoji', value: emojiinrp },
          { name: 'Label', value: labelinrp }
        );

      let messageUrlButton =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL(targetMessage.url)
            .setLabel('Message')
            .setEmoji('🔍')
        );

      interaction.reply({
        embeds: [replyEmbed],
        components: [messageUrlButton],
      });
    } catch (error) {
      return errSend(error.message);
    }
  },
});
