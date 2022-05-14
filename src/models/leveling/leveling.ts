import mongoose from 'mongoose';

interface levelingInterface {
  userID: string;
  guildID: string;
  xp: number;
  level: number;
  lastUpdated: { type: Date; default: Date };
}

let Schema = new mongoose.Schema<levelingInterface>({
  userID: { type: String },
  guildID: { type: String },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: new Date() },
});

let leveling = mongoose.model('leveling', Schema);

export { leveling, levelingInterface };
