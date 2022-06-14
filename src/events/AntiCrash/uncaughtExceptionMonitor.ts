import chalk from 'chalk';
import { Event } from '../../structures/Event';

export default new Event(
  process,
  'uncaughtExceptionMonitor',
  async (err, origin) => {
    console.log(
      chalk.red('[ERROR]') +
        chalk.white.bold(' | ') +
        chalk.blue(`${new Date().toLocaleDateString()}`) +
        chalk.white.bold(' | ') +
        chalk.cyan('Uncaught Exception/Catch (MONITOR)') +
        chalk.white(': '),
      err,
      origin
    );
  }
);
