import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
} from 'discord.js';
import { Command } from '../../Structures/Command';

export default new Command({
  name: 'help',
  description: 'Shows the list of my commands',
  category: 'Info',
  run: async (client, interaction) => {
    let array = [];
    let uncategorized = [];

    let emoji = {
      Uncategorized: '<:MM_unsorted:932631453311856670>',
      Unknown: '<:MM_unknown_file:932628652095586344>',
      Info: '<:MM_info:926686558906617927>',
      Utilities: '<:MM_utility:927297279377944616>',
      Fun: '<:MM_fun:932630167128506388>',
      Developer: '<:MM_Utilities_dev:932103812116795432>',
      Music: '<a:MM_music:932636939817996338>',
      Anime: '<:MM_A_remwink:909134156003418192>',
      'Moderation & Management': '<:MM_staff:932629900374990918>',
    };

    let commands = client.commands.map((cmd) => cmd);

    for (let o of commands) {
      if (o.category) {
        let obj = {
          name: o.category,
          value: o.subcommands || o.name,
        };
        array.push(obj);
      } else {
        uncategorized.push(o.subcommands || o.name);
      }
    }

    let NotFields = [];

    array.forEach((idk) => {
      let existing = NotFields.filter((v, i) => {
        return v.name == idk.name;
      });
      if (existing.length) {
        let existingIndex = NotFields.indexOf(existing[0]);
        NotFields[existingIndex].value = NotFields[existingIndex].value.concat(
          idk.value
        );
      } else {
        if (typeof idk.value == 'string') idk.value = [idk.value];
        NotFields.push(idk);
      }
    });

    let YesFields = [];
    for (let NaV of NotFields) {
      let obj = {
        name: `${emoji[NaV.name] || emoji.Unknown} ${NaV.name} (${
          NaV.value.length
        })`,
        value: `\`${NaV.value.join('`, `')}\``,
      };
      YesFields.push(obj);
    }

    for (let i = 0; i < uncategorized.length; i++) {
      if (Array.isArray(uncategorized[i])) {
        uncategorized.push(...uncategorized[i]);
        uncategorized[i] = '';
      }
    }

    let uncategorizedFiltered = uncategorized.filter((el) => {
      return el != null && el != '';
    });

    let obj = {
      name: `${emoji.Uncategorized} Uncategorized (${uncategorizedFiltered.length})`,
      value: `\`${uncategorizedFiltered.join('`, `')}\``,
    };

    if (uncategorizedFiltered.length) YesFields.push(obj);

    let embed = new EmbedBuilder()
      .setAuthor({
        name: client.user?.username + '| Help Command',
        iconURL: client.user?.displayAvatarURL({ size: 512 }),
      })
      .setThumbnail('https://cdn.discordapp.com/emojis/926515055594455100.png')
      .addFields(YesFields)
      .addFields({
        name: '<:MM_question:919531896227135550> How to use the commands:',
        value:
          'To use a command you must type a slash (/) followed by the name of the command. In [bot-commands](https://discord.com/channels/485463924007763970/887068533136195604)!\n\nSyntax: /`[command name] [options]`\nExample: /userinfo `[@user]`',
      })
      .setColor(client.config.botColor);

    let row =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel('Command List')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('932665354105278494')
          .setCustomId('COMMAND_LIST_BTN_HELP_CMD'),

        new ButtonBuilder()
          .setLabel('AI')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('926515055594455100')
          .setCustomId('AI_BTN_HELP_CMD')
      );

    row.components[0].setDisabled(true);
    await interaction.reply({ embeds: [embed], components: [row] });

    setTimeout(async () => {
      row.components[1].setDisabled(true);
      row.components[0].setDisabled(true);

      await interaction.editReply({ components: [row] });
    }, 17000);
  },
});
