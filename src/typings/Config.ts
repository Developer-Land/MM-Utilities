import { ColorResolvable } from 'discord.js';

export type Config = {
  activityType: string;
  activityName: string;
  botColor: ColorResolvable;
  errColor: ColorResolvable;
  developerID: string[];
  mongooseConnectionString: string;
};
