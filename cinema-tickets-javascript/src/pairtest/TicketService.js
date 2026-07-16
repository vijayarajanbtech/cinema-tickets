import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';

export default class TicketService {

  purchaseTickets(accountId, ...ticketTypeRequests) {
    this.validateAccountId(accountId);
   return "SUCCESS";
  }

  validateAccountId(accountId) {
    if (accountId <= 0) {
    throw new InvalidPurchaseException('Account ID must be a valid positive integer.');
    }
 }
}
