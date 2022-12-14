import { config } from 'dotenv';
import express from 'express';
import { ExtendedClient } from './Structures/Client';

config();

export const client = new ExtendedClient({
  intents: 3276799,
  allowedMentions: {
    parse: ['roles', 'users'],
    repliedUser: true,
  },
  failIfNotExists: false,
});

const app = express();
app.get('/', (_request, response) => {
  response.send('Nothing');
});

app.listen(process.env.PORT);

client.start();
