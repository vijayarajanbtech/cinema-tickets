import { expect, assert } from "chai";
import sinon from "sinon";
import TicketService from "../../src/pairtest/TicketService.js";
import TicketTypeRequest from "../../src/pairtest/lib/TicketTypeRequest.js";
import InvalidPurchaseException from "../../src/pairtest/lib/InvalidPurchaseException.js";

describe("TicketService", () => {
  let ticketService;
  let mockPaymentService;
  let mockSeatReservationService;

  beforeEach(() => {
    mockPaymentService = { makePayment: sinon.spy() };
    mockSeatReservationService = { reserveSeat: sinon.spy() };
    ticketService = new TicketService(
      mockPaymentService,
      mockSeatReservationService,
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("MAX_TICKETS_PER_TRANSACTION config", () => {
    it("should use the custom limit provided by process.env", () => {
      process.env.MAX_TICKETS_PER_TRANSACTION = "5";
      ticketService = new TicketService();
      assert.strictEqual(ticketService.MAX_TICKETS_PER_TRANSACTION, 5);
    });

    it("should fallback to 25 if process.env.MAX_TICKETS_PER_TRANSACTION is missing", () => {
      delete process.env.MAX_TICKETS_PER_TRANSACTION;
      ticketService = new TicketService();
      assert.strictEqual(ticketService.MAX_TICKETS_PER_TRANSACTION, 25);
    });
  });

  describe("TICKET_PRICES config", () => {
    it("should use custom ticket prices provided by process.env", () => {
      process.env.TICKET_PRICE_ADULT = "50";
      process.env.TICKET_PRICE_CHILD = "30";
      process.env.TICKET_PRICE_INFANT = "5";
      ticketService = new TicketService();
      assert.strictEqual(ticketService.TICKET_PRICES.ADULT, 50);
      assert.strictEqual(ticketService.TICKET_PRICES.CHILD, 30);
      assert.strictEqual(ticketService.TICKET_PRICES.INFANT, 5);
    });

    it("should fallback to default prices if environment variables are missing", () => {
      delete process.env.TICKET_PRICE_ADULT;
      delete process.env.TICKET_PRICE_CHILD;
      delete process.env.TICKET_PRICE_INFANT;
      ticketService = new TicketService();
      assert.strictEqual(ticketService.TICKET_PRICES.ADULT, 25);
      assert.strictEqual(ticketService.TICKET_PRICES.CHILD, 15);
      assert.strictEqual(ticketService.TICKET_PRICES.INFANT, 0);
    });
  });

  describe("Account ID Validation", () => {
    it("should throw InvalidPurchaseException if account ID is zero", () => {
      expect(() => {
        ticketService.purchaseTickets(0, new TicketTypeRequest("ADULT", 1));
      }).to.throw(
        InvalidPurchaseException,
        "Account ID must be a valid positive integer.",
      );
    });

    it("should throw InvalidPurchaseException if account ID is a negative value", () => {
      expect(() => {
        ticketService.purchaseTickets(-50, new TicketTypeRequest("ADULT", 1));
      }).to.throw(
        InvalidPurchaseException,
        "Account ID must be a valid positive integer.",
      );
    });

    it("should throw InvalidPurchaseException if account ID is not a numeric primitive", () => {
      expect(() => {
        ticketService.purchaseTickets(
          "account-xyz",
          new TicketTypeRequest("ADULT", 1),
        );
      }).to.throw(
        InvalidPurchaseException,
        "Account ID must be a valid positive integer.",
      );
    });

    it("should not throw InvalidPurchaseException if it is a good account ID", () => {
      expect(() => {
        ticketService.purchaseTickets(1, new TicketTypeRequest("ADULT", 1));
      }).to.not.throw(InvalidPurchaseException);
    });
  });

  describe("Ticket Type Request Validation", () => {
    it("should throw TypeError if a specific ticket request type is other than ADULT, CHILD, INFANT", () => {
      expect(() => {
        ticketService.purchaseTickets(12345, new TicketTypeRequest("ELDER", 1));
      }).to.throw(TypeError, "ticket type must be ADULT, CHILD or INFANT");
    });

    it("should throw TypeError if a specific ticket request quantity is zero", () => {
      expect(() => {
        ticketService.purchaseTickets(12345, new TicketTypeRequest("ADULT", 0));
      }).to.throw(
        TypeError,
        "noOfTickets must be an integer and greater than 0",
      );
    });

    it("should throw TypeError if a specific ticket request quantity is negative", () => {
      expect(() => {
        ticketService.purchaseTickets(
          12345,
          new TicketTypeRequest("ADULT", -5),
        );
      }).to.throw(
        TypeError,
        "noOfTickets must be an integer and greater than 0",
      );
    });

    it("should throw TypeError if a specific ticket request quantity is string", () => {
      expect(() => {
        ticketService.purchaseTickets(
          12345,
          new TicketTypeRequest("ADULT", "ticketcount"),
        );
      }).to.throw(
        TypeError,
        "noOfTickets must be an integer and greater than 0",
      );
    });

    it("should not throw TypeError if a ticket request is good", () => {
      expect(() => {
        ticketService.purchaseTickets(12345, new TicketTypeRequest("ADULT", 1));
      }).to.not.throw(TypeError);
    });
  });

  describe("Business Rule Validation", () => {
    it("should throw TypeError if the total ticket basket quantity is zero", () => {
      expect(() => {
        ticketService.purchaseTickets(12345, new TicketTypeRequest("ADULT", 0));
      }).to.throw(
        TypeError,
        "noOfTickets must be an integer and greater than 0",
      );
    });

    it("should throw InvalidPurchaseException if total ticket counts break the 25 maximum threshold limit", () => {
      const heavyRequest = new TicketTypeRequest("ADULT", 26);
      expect(() => {
        ticketService.purchaseTickets(12345, heavyRequest);
      }).to.throw(
        InvalidPurchaseException,
        "Cannot purchase more than 25 tickets in a single transaction.",
      );
    });

    it("should throw InvalidPurchaseException if child tickets from checking out without an adult ticket present", () => {
      const childOnly = new TicketTypeRequest("CHILD", 2);
      expect(() => {
        ticketService.purchaseTickets(12345, childOnly);
      }).to.throw(
        InvalidPurchaseException,
        "Child and Infant tickets cannot be purchased without an Adult ticket.",
      );
    });

    it("should throw InvalidPurchaseException if infant tickets from checking out without an adult ticket present", () => {
      const infantOnly = new TicketTypeRequest("INFANT", 1);
      expect(() => {
        ticketService.purchaseTickets(12345, infantOnly);
      }).to.throw(
        InvalidPurchaseException,
        "Child and Infant tickets cannot be purchased without an Adult ticket.",
      );
    });

    it("should throw InvalidPurchaseException where the count of infants exceeds the count of available adult laps", () => {
      const adultReq = new TicketTypeRequest("ADULT", 1);
      const infantReq = new TicketTypeRequest("INFANT", 2);
      expect(() => {
        ticketService.purchaseTickets(12345, adultReq, infantReq);
      }).to.throw(
        InvalidPurchaseException,
        "The number of Infants cannot exceed the number of Adults.",
      );
    });

    it("should not throw InvalidPurchaseException for the good request", () => {
      const adultReq = new TicketTypeRequest("ADULT", 2);
      const childReq = new TicketTypeRequest("CHILD", 5);
      const infantReq = new TicketTypeRequest("INFANT", 1);
      expect(() => {
        ticketService.purchaseTickets(12345, adultReq, childReq, infantReq);
      }).to.not.throw(InvalidPurchaseException);
    });
  });

  describe("Total ticket price and total seat calculations", () => {
    it("should invoke payment gateway and seat booking third party service with correct data", () => {
      const accountId = 12345;
      const expectedResponse = {
        TotalAmtCharged: 95,
        TotalSeatBooked: 5,
      };
      const adultReq = new TicketTypeRequest("ADULT", 2); // 2 seats and £50
      const childReq = new TicketTypeRequest("CHILD", 3); // 3 seats and £45
      const infantReq = new TicketTypeRequest("INFANT", 1); // No seat and £0

      const response = ticketService.purchaseTickets(
        accountId,
        adultReq,
        childReq,
        infantReq,
      );

      expect(mockPaymentService.makePayment.calledOnce).to.be.true;
      expect(mockPaymentService.makePayment.firstCall.args).to.deep.equal([
        accountId,
        95,
      ]);
      expect(mockSeatReservationService.reserveSeat.calledOnce).to.be.true;
      expect(
        mockSeatReservationService.reserveSeat.firstCall.args,
      ).to.deep.equal([accountId, 5]);

      expect(response).to.deep.equal(expectedResponse);
    });
  });
});
