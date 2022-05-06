import { Event } from '../structures/Event';

export default new Event(
  process,
  'multipleResolves',
  async (type, promise, reason) => {
    console.log('[antiCrash]: Multiple Resolves');
    console.log(type, promise, reason);
  }
);
