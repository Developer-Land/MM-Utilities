import { MessageEmbed } from 'discord.js';
import { Button } from '../../Structures/Button';
const cooldownOfStaffList = new Set();

export default new Button({
  customId: 'UPDATE_STAFF_LIST',
  userPermissions: ['MANAGE_CHANNELS'],
  run: async (client, interaction) => {
    if (cooldownOfStaffList.has(interaction.member.id))
      return interaction.reply('You are on cooldown!');

    const roles = {
      admin: interaction.guild.roles.cache.get('903566577293721620'),
      srMod: interaction.guild.roles.cache.get('626015899425439744'),
      smpDev: interaction.guild.roles.cache.get('888350418957119528'),
      dcMod: interaction.guild.roles.cache.get('882253708338020442'),
      smpStaff: interaction.guild.roles.cache.get('882253716034568283'),
      beemTeam: interaction.guild.roles.cache.get('882253713111154700'),
      trainee: interaction.guild.roles.cache.get('893197592974987304'),
      builder: interaction.guild.roles.cache.get('944240796813652038'),
    };
    let embed = new MessageEmbed()
      .setAuthor({
        name: 'Staff list - MM Gamer',
        iconURL:
          'https://cdn.discordapp.com/emojis/901296752202772540.png?v=1&size=512',
      })
      .setDescription(
        "Welcome to the Staff List of MM Gamer. If you're looking for a place to find all the currently available staff members of this community, this is the right place."
      )
      .setColor('#2f3136')
      .setFooter({ text: 'Last updated: ' })
      .setTimestamp()
      .addFields(
        {
          name: 'How to apply:',
          value:
            'If you want to apply for a staff member, you would have to wait for the applications to open.\n.\n.',
        },
        {
          name: 'Owner `∞`',
          value: `> <@${interaction.guild.ownerId}>`,
        },
        {
          name: `${roles.admin.name}s \`${roles.admin.members.size}\``,
          value:
            roles.admin.members.size > 0
              ? `> ${roles.admin.members.map((m) => m.user).join('\n> ')}`
              : '`None`',
        },
        {
          name: `${roles.srMod.name}s \`${roles.srMod.members.size}\``,
          value:
            roles.srMod.members.size > 0
              ? `> ${roles.srMod.members.map((m) => m.user).join('\n> ')}`
              : '`None`',
        },
        {
          name: `${roles.smpDev.name}s \`${roles.smpDev.members.size}\``,
          value:
            roles.smpDev.members.size > 0
              ? `> ${roles.smpDev.members.map((m) => m.user).join('\n> ')}`
              : '`None`',
        },
        {
          name: `${roles.dcMod.name}s \`${roles.dcMod.members.size}\``,
          value:
            roles.dcMod.members.size > 0
              ? `> ${roles.dcMod.members.map((m) => m.user).join('\n> ')}`
              : '`None`',
        },
        {
          name: `${roles.smpStaff.name} \`${roles.smpStaff.members.size}\``,
          value:
            roles.smpStaff.members.size > 0
              ? `> ${roles.smpStaff.members.map((m) => m.user).join('\n> ')}`
              : '`None`',
        },
        {
          name: `${roles.beemTeam.name} \`${roles.beemTeam.members.size}\``,
          value:
            roles.beemTeam.members.size > 0
              ? `> ${roles.beemTeam.members.map((m) => m.user).join('\n> ')}`
              : '`None`',
        },
        {
          name: `${roles.trainee.name}s \`${roles.trainee.members.size}\``,
          value:
            roles.trainee.members.size > 0
              ? `> ${roles.trainee.members.map((m) => m.user).join('\n> ')}`
              : '`None`',
        },
        {
          name: `${roles.builder.name}s \`${roles.builder.members.size}\``,
          value:
            roles.builder.members.size > 0
              ? `> ${roles.builder.members
                  .map((m) => m.user)
                  .join(
                    '\n> '
                  )}\n.\n.\n**For corrections, mistakes ping <@826899456909770763> <:MM_A_uhh:889565184929198100>**`
              : '`None`\n.\n.\n**For corrections, mistakes ping <@826899456909770763> <:MM_A_uhh:889565184929198100>**',
        }
      );

    interaction.update({
      embeds: [embed],
    });

    cooldownOfStaffList.add(interaction.member.id);
    setTimeout(() => {
      cooldownOfStaffList.delete(interaction.member.id);
    }, 10000);
  },
});
