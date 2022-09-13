import { Button } from '../../Structures/Button';
import { Webhook } from "../../Structures/Webhook"
import { GuildMember, Snowflake, MessageActionRow, MessageButton } from "discord.js";

export default new Button({
  customId: '\\d+\\.verification.rejectConfirmed',
  run: async (client, interaction) => {
    const messageId = interaction.customId.replace(/\D/g, '') as Snowflake;
   
    const targetMessage = await interaction.channel.messages.fetch(messageId);
    
    const userId = ((targetMessage.components[0].components[1] as MessageButton).customId.replace(/\D/g, '')) as Snowflake;
    
    (interaction.guild.members.cache.get(userId) as GuildMember)
      .kick(`${interaction.user.tag} - Failed verification.`)
        .then(() => {
          interaction.update({
            content: "<:MM_yesyesyes:909139323692154880>",
            components: []
          });
          
          new Webhook({ channelId: "1008754426678353970", messageId: targetMessage.id }, {
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
          }).edit();
        })
        .catch(err => {
          console.log(err);
          interaction.reply({
            content: 'An error accured.',
            ephemeral: true
          });
        });
  }
});
