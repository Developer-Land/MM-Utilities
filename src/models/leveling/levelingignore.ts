import mongoose from 'mongoose';

let Schema = new mongoose.Schema({
  guildID: { type: String },
  ID: { type: String }, // Channel Id or Role Id
});

export default mongoose.model('levelingignore', Schema);
