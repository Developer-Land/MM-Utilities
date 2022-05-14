import mongoose from 'mongoose';

interface levelUserSettingsInterface {
  guildID: string;
  userID: string;
  levelUpMsg: string;
  rankcardBg: string;
  rankcardColor: string;
  rankcardAvatar: string;
}

let Schema = new mongoose.Schema<levelUserSettingsInterface>({
  guildID: { type: String },
  userID: { type: String },
  levelUpMsg: { type: String },
  rankcardBg: { type: String },
  rankcardColor: { type: String },
  rankcardAvatar: { type: String },
});

let levelUserSettings = mongoose.model('levelUserSettings', Schema);

export { levelUserSettings, levelUserSettingsInterface };
