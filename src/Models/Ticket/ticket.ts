import mongoose from 'mongoose';

interface ticketInterface {
  TicketChannelID: string;
  TicketMessageID: string;
  TicketAuthorID: string;
  TicketReason: string;
  TicketStatus: string;
  TicketNumber: string;
}

let Schema = new mongoose.Schema<ticketInterface>({
  TicketChannelID: String,
  TicketMessageID: String,
  TicketAuthorID: String,
  TicketReason: String,
  TicketStatus: String,
  TicketNumber: String,
});

let Ticket = mongoose.model('ticket', Schema);

export { Ticket, ticketInterface };
