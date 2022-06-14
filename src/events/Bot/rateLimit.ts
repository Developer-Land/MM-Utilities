import { RateLimitError } from 'discord.js';
import { client } from '../../index';
import { Event } from '../../structures/Event';

export default new Event(client, 'rateLimit', (info: RateLimitError) => {
  console.log('[RateLimit]: ', info);
});
