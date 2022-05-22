import { client, notifier } from '../../index';
import { GuildTextBasedChannel } from 'discord.js';
import { Event } from '../../structures/Event';
import { Notification } from 'youtube-notification';

export default new Event(notifier, 'notified', (data: Notification) => {
  const published = String(data.published).split(' ');
  const updated = String(data.updated).split(' ');
  if (published[2] === updated[2]) {
    (
      client.channels.cache.get('904616970190725150') as GuildTextBasedChannel
    ).send(
      `Hey <@&875239770584911903>, **MM GAMER** just posted a video! Go check it out! ${data.video.link}`
    );
  }
});
