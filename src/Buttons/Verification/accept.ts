import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  GuildMember,
  MessageActionRowComponentBuilder,
  Snowflake,
} from 'discord.js';
import { Button } from '../../Structures/Button';

export default new Button({
  customId: '\\d+\\.verification.accept',
  run: async (client, interaction) => {
    if (!interaction.member.roles.cache.has('1008423362911031367')) {
      return interaction.reply({
        content: 'You are not a gatekeeper.',
        ephemeral: true,
      });
    }

    let userId = interaction.customId.replace(/\D/g, '') as Snowflake;

    let member = (await interaction.guild.members
      .fetch({
        user: userId,
      })
      .catch(() => {})) as GuildMember;

    member.roles
      .add(
        '854647752197931038',
        `${interaction.user.tag} - Passed verification.`
      )
      .then(() => {
        interaction.update({
          components: [
            new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Success)
                .setLabel('Accepted')
                .setDisabled(true)
                .setCustomId(
                  '=============================================================================='
                )
            ),
          ],
        });
      });
  },
});
