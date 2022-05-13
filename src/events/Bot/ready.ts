import { Event } from '../../structures/Event';
import { client } from '../..';

export default new Event(client, 'ready', () => {
  console.log('Bot is online');
});
