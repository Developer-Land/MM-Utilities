import mongoose from 'mongoose';

let Schema = new mongoose.Schema({
  guildID: { type: String },
  userID: { type: String },
  levelUpMsg: { type: String },
  rankcardBg: { type: String },
  rankcardColor: { type: String },
  rankcardAvatar: { type: String },
});

export default mongoose.model('levelUserSettings', Schema);
