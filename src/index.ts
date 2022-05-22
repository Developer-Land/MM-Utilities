import { config } from 'dotenv';
import express from 'express';
import { AddressInfo } from 'net';
import YouTubeNotifier from 'youtube-notification';
import { ExtendedClient } from './structures/Client';

config();

const client = new ExtendedClient({
  intents: 32767,
  allowedMentions: {
    parse: ['roles', 'users'],
    repliedUser: true,
  },
  failIfNotExists: false,
});

let notifier = new YouTubeNotifier({
  hubCallback: process.env.YT_hubCallback,
  secret: process.env.YT_SECRET,
});

export { client, notifier };

const app = express();
app.get('/', (_request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('Nothing');
});

const listener = app.listen(process.env.PORT, function () {
  console.log(
    `Your app is listening on port ` + (listener.address() as AddressInfo).port
  );
});

notifier.subscribe('UCyAUC1ykgM_VWD-5ka804kg');
app.use('/yt', notifier.listener());

client.start();
