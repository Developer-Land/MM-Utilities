import http from 'http';
import express from 'express';
const app = express();
let server = http.createServer(app);

app.get('/', (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('Nothing');
});

const listener = server.listen(process.env.PORT, function () {
  console.log(
    `Your app is listening on port ` + (listener.address() as AddressInfo).port
  );
});

import { client } from '../../index';
import YouTubeNotifier, { Notification } from 'youtube-notification';
import { AddressInfo } from 'net';
import { GuildTextBasedChannel } from 'discord.js';

const notifier = new YouTubeNotifier({
  hubCallback: process.env.YT_hubCallback,
  secret: process.env.YT_SECRET,
});

notifier.on('notified', (data: Notification) => {
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

notifier.subscribe('UCyAUC1ykgM_VWD-5ka804kg');

app.use('/yt', notifier.listener());
