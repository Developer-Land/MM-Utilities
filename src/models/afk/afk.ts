import mongoose from 'mongoose';

let Schema = new mongoose.Schema({
  userID: { type: String },
  guildID: { type: String },
  message: { type: String, default: 'AFK' },
  time: { type: Date, default: Date.now },
});

export default mongoose.model('afk', Schema);
