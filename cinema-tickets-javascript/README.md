# Candidate Number/Application ID : 17993591
# Compaign Number : 461977
# DWP Cinema Tickets - Javascript Coding Exercise
## Overview
This project is a solution for the DWP Javascript Software Engineer coding exercise. It provides a `TicketService` implementation that allows the purchase of Adult, Child, and Infant cinema tickets, ensuring all business rules and constraints are met.

## Features
- Calculate ticket payments based on ticket type.
- Reserve the correct number of seats (Infants do not get seats).
- Enforce below business rules:
  - Maximum of 25 tickets per purchase.
  - Child or Infant tickets require at least one Adult ticket.
  - Invalid requests (e.g., negative ticket numbers, invalid ticket type, invalid account ID) are rejected.
- Immutable `TicketTypeRequest` objects to ensure data integrity.

## Business Rules
| Ticket Type | Price | Seat Allocation |
| ----------- | ----- | --------------- |
| INFANT      | £0    | No seat         |
| CHILD       | £15   | Yes             |
| ADULT       | £25   | Yes             |

- Maximum 25 tickets per purchase.
- Infants sit on an Adult's lap.
- Account ID must be greater than 0.

## Assumptions
- Accounts with ID > 0 are valid and have sufficient funds.
- External services (`TicketPaymentService` and `SeatReservationService`) work reliably.

## Test Coverage

## How to run the test



