/**
 * Immutable Object.
 */

export default class TicketTypeRequest {

  #ALLOWED_TYPES = ['ADULT', 'CHILD', 'INFANT'];

  #type;

  #noOfTickets;

  constructor(type, noOfTickets) {
    console.log('condi', !this.#ALLOWED_TYPES.includes(type))
    if (!this.#ALLOWED_TYPES.includes(type)) {
      console.log('ttype', type)
      throw new TypeError('ticket type must be ADULT, CHILD or INFANT');
    }

    if (!Number.isInteger(noOfTickets) || noOfTickets <= 0) {
      throw new TypeError('noOfTickets must be an integer and greater than 0');
    }

    this.#type = type;
    this.#noOfTickets = noOfTickets;
    Object.freeze(this);
  }

  getNoOfTickets() {
    return this.#noOfTickets;
  }

  getTicketType() {
    return this.#type;
  }

}
