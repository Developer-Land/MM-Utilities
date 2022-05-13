import mongoose from 'mongoose';

let Schema = new mongoose.Schema({
  TicketChannelID: String,
  TicketMessageID: String,
  TicketAuthorID: String,
  TicketReason: String,
  TicketStatus: String,
  TicketNumber: String,
});

export default mongoose.model('ticket', Schema);
