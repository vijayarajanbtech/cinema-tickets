import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';

export default class TicketService {

  purchaseTickets(accountId, ...ticketTypeRequests) {
   return "SUCCESS";
  }
}
