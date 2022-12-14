import { RateLimitError, RestEvents } from 'discord.js';
import { client } from '../../index';
import { Event } from '../../Structures/Event';

export default new Event<keyof RestEvents>(
  client.rest,
  'rateLimited',
  (info: RateLimitError) => {
    console.log('[RateLimit]: ', info);
  }
);
