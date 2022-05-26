import { Event } from '../../structures/Event';
import { client } from '../../index';
import { RateLimitError } from 'discord.js';

export default new Event(client, 'rateLimit', (info: RateLimitError) => {
  console.log('[RateLimit]: ', info);
});
