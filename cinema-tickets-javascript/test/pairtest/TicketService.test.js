import { expect } from 'chai';
import sinon from 'sinon';
import TicketService from '../../src/pairtest/TicketService.js';
import TicketTypeRequest from '../../src/pairtest/lib/TicketTypeRequest.js';
import InvalidPurchaseException from '../../src/pairtest/lib/InvalidPurchaseException.js';

describe('TicketService', () => {
 let ticketService;

 beforeEach(() => {
 ticketService = new TicketService();
 });

 afterEach(() => {
 sinon.restore();
 });

 describe('Account ID Validation', () => {
 it('should throw InvalidPurchaseException if account ID is zero', () => {
 expect(() => {
 ticketService.purchaseTickets(0, new TicketTypeRequest('ADULT', 1));
 }).to.throw(InvalidPurchaseException, 'Account ID must be a valid positive integer.');
 });

 it('should throw InvalidPurchaseException if account ID is a negative value', () => {
 expect(() => {
 ticketService.purchaseTickets(-50, new TicketTypeRequest('ADULT', 1));
 }).to.throw(InvalidPurchaseException);
 });

 it('should throw InvalidPurchaseException if account ID is not a numeric primitive', () => {
 expect(() => {
 ticketService.purchaseTickets('account-xyz', new TicketTypeRequest('ADULT', 1));
 }).to.throw(InvalidPurchaseException);
 });

  it('should not throw InvalidPurchaseException if it is a good account ID', () => {
 expect(() => {
 ticketService.purchaseTickets(1, new TicketTypeRequest('ADULT', 1));
 }).to.not.throw(InvalidPurchaseException);
 });
 });

 describe('Ticket Type Request Validation', () => {
 it('should throw if a specific ticket request type is other than ADULT, CHILD, INFANT', () => {
 expect(() => {
 ticketService.purchaseTickets(12345, new TicketTypeRequest('ELDER', 1));
 }).to.throw(TypeError, 'ticket type must be ADULT, CHILD or INFANT');
 });

 it('should throw if a specific ticket request quantity is zero', () => {
 expect(() => {
 ticketService.purchaseTickets(12345, new TicketTypeRequest('ADULT', 0));
 }).to.throw(TypeError, 'noOfTickets must be an integer and greater than 0');
 });

 it('should throw if a specific ticket request quantity is negative', () => {
 expect(() => {
 ticketService.purchaseTickets(12345, new TicketTypeRequest('ADULT', -5));
 }).to.throw(TypeError, 'noOfTickets must be an integer and greater than 0');
 });

it('should throw if a specific ticket request quantity is string', () => {
 expect(() => {
 ticketService.purchaseTickets(12345, new TicketTypeRequest('ADULT', 'ticketcount'));
 }).to.throw(TypeError, 'noOfTickets must be an integer and greater than 0');
 });

 it('should not throw if a ticket request is good', () => {
 expect(() => {
 ticketService.purchaseTickets(12345, new TicketTypeRequest('ADULT', 1));
 }).to.not.throw(TypeError);
 });
 });
});