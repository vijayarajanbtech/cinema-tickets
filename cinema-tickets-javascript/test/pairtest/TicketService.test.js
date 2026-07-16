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
 });
});