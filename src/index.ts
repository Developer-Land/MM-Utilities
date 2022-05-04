require('dotenv').config();
import { ExtendedClient } from './structures/Client';

export const client = new ExtendedClient({
    intents: 32767,
    allowedMentions: {
        parse: ['roles', 'users'],
        repliedUser: true,
      },
      failIfNotExists: false,
});

client.start();
