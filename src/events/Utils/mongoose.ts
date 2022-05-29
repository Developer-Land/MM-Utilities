import mongoose from 'mongoose';
import chalk from 'chalk';
import { Events } from '../../structures/Events';

export default new Events(mongoose.connection, [
  {
    event: 'connected',
    run: () => {
      console.log(
        chalk.cyan('[INFO]') +
          chalk.white.bold(' | ') +
          chalk.blue(`${new Date().toLocaleDateString()}`) +
          chalk.white.bold(' | ') +
          chalk.cyan('Mongo DB Connection') +
          chalk.white(': ') +
          chalk.greenBright(`Connected`)
      );
    },
  },
  {
    event: 'disconnected',
    run: () => {
      console.log(
        chalk.cyan('[INFO]') +
          chalk.white.bold(' | ') +
          chalk.blue(`${new Date().toLocaleDateString()}`) +
          chalk.white.bold(' | ') +
          chalk.cyan('Mongo DB Connection') +
          chalk.white(': ') +
          chalk.greenBright(`Disconnected`)
      );
    },
  },
  {
    event: 'error',
    run: (error) => {
      console.log(
        chalk.red('[ERROR]') +
          chalk.white.bold(' | ') +
          chalk.blue(`${new Date().toLocaleDateString()}`) +
          chalk.white.bold(' | ') +
          chalk.cyan('Mongo DB Connection') +
          chalk.white(': ') +
          chalk.greenBright(`Error`) +
          '\n' +
          chalk.white(error)
      );
    },
  },
]);
