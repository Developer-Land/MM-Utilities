import chalk from 'chalk';
import { Event } from '../../structures/Event';

export default new Event(process, 'unhandledRejection', async (reason, p) => {
  console.log(
    chalk.red('[ERROR]') +
      chalk.white.bold(' | ') +
      chalk.blue(`${new Date().toLocaleDateString()}`) +
      chalk.white.bold(' | ') +
      chalk.cyan('Unhandled Rejection/Catch') +
      chalk.white(': '),
    reason,
    p
  );
});
