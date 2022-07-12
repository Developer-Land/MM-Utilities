import { MessageEmbed } from 'discord.js';
import moment from 'moment';
import { Command } from '../../Structures/Command';

export default new Command({
  name: 'roleinfo',
  description: 'Lookup a role',
  options: [
    {
      name: 'role',
      description: 'the role you want to check',
      type: 'ROLE',
      required: true,
    },
  ],
  category: 'Info',
  run: async (client, interaction) => {
    let role = interaction.options.getRole('role');
    let RoleInfoEmbed = new MessageEmbed()
      .setTitle('Information Of Role')
      .setColor(interaction.guild.roles.cache.get(role.id).hexColor)
      .addField(
        'ID',
        String(interaction.guild.roles.cache.get(role.id).id),
        false
      )
      .addField(
        'Name',
        String(interaction.guild.roles.cache.get(role.id).name),
        false
      )
      .addField(
        'Color',
        String(interaction.guild.roles.cache.get(role.id).hexColor),
        false
      )
      .addField(
        'Hoisted',
        String(interaction.guild.roles.cache.get(role.id).hoist)
          .replace(/false/gi, 'No')
          .replace(/true/gi, 'Yes'),
        false
      )
      .addField(
        'Postion',
        String(interaction.guild.roles.cache.get(role.id).rawPosition),
        false
      )
      .addField(
        'Mentionable',
        String(interaction.guild.roles.cache.get(role.id).mentionable)
          .replace(/false/gi, 'No')
          .replace(/true/gi, 'Yes'),
        false
      )
      .addField(
        'Managed',
        String(interaction.guild.roles.cache.get(role.id).managed)
          .replace(/false/gi, 'No')
          .replace(/true/gi, 'Yes'),
        false
      )
      .setFooter({
        text: `Role Created | ${moment(
          interaction.guild.roles.cache.get(role.id).createdTimestamp
        ).format('DD/MM/YYYY, h:mm:ss A')}`,
      });
    interaction.reply({ embeds: [RoleInfoEmbed] });
  },
});
