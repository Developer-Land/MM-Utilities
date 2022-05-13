import mongoose from 'mongoose';

let Schema = new mongoose.Schema({
  guildID: { type: String },
  levelRoles: { type: String },
});

export default mongoose.model('levelroles', Schema);
