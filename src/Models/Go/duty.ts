import mongoose from 'mongoose';

interface dutyInterface {
  userID: string;
  guildID: string;
  expireAt: Date;
}

let Schema = new mongoose.Schema<dutyInterface>({
  userID: { type: String },
  guildID: { type: String },
  expireAt: {
    type: Date,
    default: Date.now,
    expires: '12h',
  },
});

let Duty = mongoose.model('duty', Schema);
let DutyEmitter = Duty.watch();

export { Duty, DutyEmitter, dutyInterface };
