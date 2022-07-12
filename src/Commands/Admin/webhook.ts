import { GuildTextBasedChannel, ThreadChannel } from 'discord.js';
import { Command } from '../../Structures/Command';

export default new Command({
  name: 'webhook',
  description: 'Creates webhook in the channel',

  userPermissions: ['MANAGE_WEBHOOKS'],
  category: 'Moderation & Management',
  run: async (client, interaction) => {
    let channel = interaction.channel as GuildTextBasedChannel;
    if (channel instanceof ThreadChannel)
      return interaction.reply({ content: "Can't create webhook in thread" });
    channel.fetchWebhooks().then((hooks) => {
      let myWebhooks = hooks.filter(
        (webhook) => webhook.owner.id === client.user.id
      );
      if (myWebhooks.size !== 0)
        return interaction.reply({
          content: `Webhook already exists: ${myWebhooks.first().url}`,
          ephemeral: true,
        });
      if (channel instanceof ThreadChannel) return;
      channel
        .createWebhook('MM Utilities', {
          avatar:
            'https://cdn.discordapp.com/avatars/911312019112734760/89a785b301f7d27a6403e0fac7f7f85a.webp?size=4096',
        })
        .then((webhook) =>
          interaction.reply({
            content: `Created webhook: ${webhook.url}`,
            ephemeral: true,
          })
        );
    });
  },
});
