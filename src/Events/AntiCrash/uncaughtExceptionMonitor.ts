import chalk from 'chalk';
import { Event } from '../../Structures/Event';

export default new Event<string>(
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
