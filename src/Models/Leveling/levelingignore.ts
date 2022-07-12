import mongoose from 'mongoose';

interface levelingIgnoreInterface {
  guildID: string;
  ID: string;
}

let Schema = new mongoose.Schema<levelingIgnoreInterface>({
  guildID: { type: String },
  ID: { type: String }, // Channel Id or Role Id
});

let levelingIgnore = mongoose.model('levelingignore', Schema);

export { levelingIgnore, levelingIgnoreInterface };
