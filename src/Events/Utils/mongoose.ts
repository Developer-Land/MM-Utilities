import chalk from 'chalk';
import mongoose from 'mongoose';
import { Events } from '../../Structures/Events';

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
