import { Event } from '../structures/Event';

export default new Event(process, 'unhandledRejection', async (reason, p) => {
  console.log('[antiCrash]: Unhandled Rejection/Catch');
  console.log(reason, p);
});
