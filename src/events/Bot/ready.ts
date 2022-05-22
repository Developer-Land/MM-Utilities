import { Event } from '../../structures/Event';
import { client } from '../../index';
import { lavalink } from '../../Utils/lavalink';
import { ExcludeEnum } from 'discord.js';
import { ActivityTypes } from 'discord.js/typings/enums';

export default new Event(
  client,
  'ready',
  () => {
    lavalink.start(client.user.id);
    console.log(`Logged in as ${client.user.tag}!`);
    const Guilds = client.guilds.cache.map(
      (x) => 'Name: ' + x.name + ', Id: ' + x.id
    );
    Guilds.forEach((element) => console.log(element));

    client.user.setPresence({
      status: 'online',
    });
    client.user.setActivity(client.config.activityName, {
      type: client.config.activityType as ExcludeEnum<
        typeof ActivityTypes,
        'CUSTOM'
      >,
      url: `https://www.youtube.com/watch?v=dbpMXfbS-Sc`,
    });
  },
  { once: true }
);
