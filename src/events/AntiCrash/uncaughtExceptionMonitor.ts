import { Event } from '../../structures/Event';

export default new Event(
  process,
  'uncaughtExceptionMonitor',
  async (err, origin) => {
    console.log('[antiCrash]: Uncaught Exception/Catch (MONITOR)');
    console.log(err, origin);
  }
);
