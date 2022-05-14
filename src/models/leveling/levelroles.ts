import mongoose from 'mongoose';

interface levelRolesInterface {
  guildID: string;
  levelRoles: string;
}

let Schema = new mongoose.Schema<levelRolesInterface>({
  guildID: { type: String },
  levelRoles: { type: String },
});

let levelRoles = mongoose.model('levelroles', Schema);

export { levelRoles, levelRolesInterface };
