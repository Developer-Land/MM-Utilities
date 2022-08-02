import {
  MessageActionRow,
  MessageActionRowComponent,
  MessageEmbed,
} from 'discord.js';
import { Button } from '../../Structures/Button';

export default new Button({
  customId: 'COMMAND_LIST_BTN_HELP_CMD',
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

    let embed = new MessageEmbed()
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
        inline: false,
      })
      .setColor(client.config.botColor);

    interaction.message.components[0].components[0] = (
      interaction.message.components[0]
        .components[0] as MessageActionRowComponent
    ).setDisabled(true);
    interaction.message.components[0].components[1] = (
      interaction.message.components[0]
        .components[1] as MessageActionRowComponent
    ).setDisabled(false);
    interaction.update({
      embeds: [embed],
      components: interaction.message.components as MessageActionRow[],
    });
  },
});
