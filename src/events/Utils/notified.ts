import { GuildTextBasedChannel } from 'discord.js';
import { Notification } from 'youtube-notification';
import { client, notifier } from '../../index';
import { Event } from '../../structures/Event';

export default new Event(notifier, 'notified', (data: Notification) => {
  const published = data.published
  const updated = data.updated
  if (published !== updated) return;
    (
      client.channels.cache.get('904616970190725150') as GuildTextBasedChannel
    ).send(
      `Hey <@&875239770584911903>, **MM GAMER** just posted a video! Go check it out! ${data.video.link}`
    );
});
