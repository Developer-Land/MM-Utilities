import mongoose from 'mongoose';

interface afkInterface {
  userID: string;
  guildID: string;
  message: string;
  time: Date;
}

let Schema = new mongoose.Schema<afkInterface>({
  userID: { type: String },
  guildID: { type: String },
  message: { type: String, default: 'Afk' },
  time: { type: Date, default: Date.now },
});

let Afk = mongoose.model('afk', Schema);

export { Afk, afkInterface };
