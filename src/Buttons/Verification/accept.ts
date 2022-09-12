import { Button } from '../../Structures/Button';
import { GuildMember, Snowflake, MessageActionRow, MessageButton } from "discord.js";

export default new Button({
  customId: '\\d+\\.verification.accept',
  run: async (client, interaction) => {
    const userId = interaction.customId.replace(/\D/g, '') as Snowflake;
    
    (interaction.guild.members.cache.get(userId) as GuildMember)
      .roles.add("854647752197931038", `${interaction.user.tag} - Passed verification.`);
      
    interaction.update({
      components: [
        new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setStyle("SUCCESS")
              .setLabel("Accepted")
              .setDisabled(true)
              .setCustomId("==============================================================================")
          )
      ]
    });
  },
});
