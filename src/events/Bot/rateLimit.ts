import { Event } from '../../structures/Event';
import { client } from '../../index';

export default new Event(client, 'rateLimit', (info) => {
  console.log('[RateLimit]: ', info);
});
