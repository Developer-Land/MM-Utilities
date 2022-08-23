import mongoose from 'mongoose';

interface levelingInterface {
  userID: string;
  guildID: string;
  xp: number;
  level: number;
  lastUpdated: Date;
}

let Schema = new mongoose.Schema<levelingInterface>({
  userID: { type: String },
  guildID: { type: String },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: new Date() },
});

let leveling = mongoose.model('leveling', Schema);
let levelingEmitter = leveling.watch();

export { leveling, levelingEmitter, levelingInterface };
