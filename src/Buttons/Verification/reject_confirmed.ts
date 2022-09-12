import { Button } from '../../Structures/Button';
import { GuildMember, Snowflake, MessageActionRow, MessageButton } from "discord.js";

export default new Button({
  customId: '\\d+\\.verification.rejectConfirmed',
  run: async (client, interaction) => {
    const messageId = interaction.customId.replace(/\D/g, '') as Snowflake;
   
    const targetMessage = await interaction.channel.messages.fetch(messageId);
    
    const userId = ((targetMessage.components[0].components[1] as MessageButton).customId.replace(/\D/g, '')) as Snowflake;
    
    (interaction.guild.members.cache.get(userId) as GuildMember)
      .kick(`${interaction.user.tag} - Failed verification.`);
    
    targetMessage.edit({
      components: [
        new MessageActionRow()
          .addComponents(
            new MessageButton()
            .setStyle("DANGER")
            .setLabel("Declined/Kicked")
            .setDisabled(true)
            .setCustomId("================================================================================")
          )
      ]
    });
    
    interaction.deferUpdate();
  }
});
