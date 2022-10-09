import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import moment from 'moment';
import { Command } from '../../Structures/Command';

export default new Command({
  name: 'roleinfo',
  description: 'Lookup a role',
  options: [
    {
      name: 'role',
      description: 'the role you want to check',
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
  ],
  category: 'Info',
  run: async (client, interaction) => {
    let role = interaction.options.getRole('role');
    let RoleInfoEmbed = new EmbedBuilder()
      .setTitle('Information Of Role')
      .setColor(interaction.guild.roles.cache.get(role.id).hexColor)
      .addFields(
        {
          name: 'ID',
          value: String(interaction.guild.roles.cache.get(role.id).id),
          inline: false,
        },
        {
          name: 'Name',
          value: String(interaction.guild.roles.cache.get(role.id).name),
          inline: false,
        },
        {
          name: 'Color',
          value: String(interaction.guild.roles.cache.get(role.id).hexColor),
          inline: false,
        },
        {
          name: 'Hoisted',
          value: String(interaction.guild.roles.cache.get(role.id).hoist)
            .replace(/false/gi, 'No')
            .replace(/true/gi, 'Yes'),
          inline: false,
        },
        {
          name: 'Postion',
          value: String(interaction.guild.roles.cache.get(role.id).rawPosition),
          inline: false,
        },
        {
          name: 'Mentionable',
          value: String(interaction.guild.roles.cache.get(role.id).mentionable)
            .replace(/false/gi, 'No')
            .replace(/true/gi, 'Yes'),
          inline: false,
        },
        {
          name: 'Managed',
          value: String(interaction.guild.roles.cache.get(role.id).managed)
            .replace(/false/gi, 'No')
            .replace(/true/gi, 'Yes'),
          inline: false,
        }
      )
      .setFooter({
        text: `Role Created | ${moment(
          interaction.guild.roles.cache.get(role.id).createdTimestamp
        ).format('DD/MM/YYYY, h:mm:ss A')}`,
      });
    interaction.reply({ embeds: [RoleInfoEmbed] });
  },
});
