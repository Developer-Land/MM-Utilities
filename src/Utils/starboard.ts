import { StarboardClient } from 'reconlx';
import { client } from '../index';
export const starboardClient = new StarboardClient({
  client: client,
  Guilds: [
    {
      id: '485463924007763970',
      options: {
        starCount: 3,
        starboardChannel: '909419820821385278',
      },
    },
  ],
});
