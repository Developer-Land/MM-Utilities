import { Event } from '../../structures/Event';

export default new Event(process, 'uncaughtException', async (err, origin) => {
  console.log('[antiCrash]: Uncaught Exception/Catch');
  console.log(err, origin);
});
