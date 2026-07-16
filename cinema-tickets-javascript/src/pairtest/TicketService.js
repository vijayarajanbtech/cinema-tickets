import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';

export default class TicketService {

  MAX_TICKETS_PER_TRANSACTION = 25;

  purchaseTickets(accountId, ...ticketTypeRequests) {
    this.validateAccountId(accountId);
    const counts = this.aggregateTicketCounts(ticketTypeRequests);
    this.validateBusinessRules(counts);
   return "SUCCESS";
  }

  validateAccountId(accountId) {
    if (!accountId || typeof accountId !== 'number' || accountId <= 0) {
    throw new InvalidPurchaseException('Account ID must be a valid positive integer.');
    }
  }

  aggregateTicketCounts(requests) {
    const counts = { ADULT: 0, CHILD: 0, INFANT: 0, total: 0 };

    for (const request of requests) {
    const type = request.getTicketType();
    const quantity = request.getNoOfTickets();

    if (type in counts) {
    counts[type] += quantity;
    counts.total += quantity;
    }
    }
    return counts;
  }

  validateBusinessRules(counts) {
  if (counts.total > this.MAX_TICKETS_PER_TRANSACTION) {
  throw new InvalidPurchaseException(
  `Cannot purchase more than ${this.MAX_TICKETS_PER_TRANSACTION} tickets in a single transaction.`
  );
  }

  if ((counts.CHILD > 0 || counts.INFANT > 0) && counts.ADULT === 0) {
  throw new InvalidPurchaseException(
  'Child and Infant tickets cannot be purchased without an Adult ticket.'
  );
  }

  if (counts.INFANT > counts.ADULT) {
  throw new InvalidPurchaseException('The number of Infants cannot exceed the number of Adults.');
  }
 }
}
