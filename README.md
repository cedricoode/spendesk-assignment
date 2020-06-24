### Specs

- [ ] A user can create a wallet in USD (\$), GBP (£) or EUR (€)
- [ ] A user can create a card connected to one of his wallets
- [ ] A user can list all his cards
- [ ] A user can list all his wallets
- [ ] A user can load or unload money on his card from the wallet
- [ ] A user can block or unblock a card, blocking it will unload all the money
      into the right wallet
- [ ] Spendesk has a master wallet per currency where we store fees from
      transfers (see below)
- [ ] A user can transfer money between 2 wallets in different currencies but
      We take a 2.9% fee on the destination currency on this transfer
      This fee will go into our master wallet for the given currency
      Of course you need to convert the amount (you can user fixer.io or
      any free APIB

don't need to manage users and authentication, just pass both a User-Id and a Company-Id headers with each request and use it to track the money transfers / wallets or cards ownerships. As you can't use real money, you can load the wallet directly when you create it (setting the balance property), it does not work in real life but whatever!

### Data structures

These are the mandatory fields for each entity, you can add as many as you
want (even other entities if you need).

| Wallet 💰                                                      |
| -------------------------------------------------------------- |
| Unique identifier                                              |
| Current balance                                                |
| Currency                                                       |
| Company identifier                                             |
| Is master wallet (a boolean to know if it's ours for the fees) |

| Card 💳                                          |
| ------------------------------------------------ |
| Unique identifier                                |
| Wallet identifier                                |
| Currency                                         |
| Current balance                                  |
| Random 16 digits number                          |
| Expiration date (creation + 1 month)             |
| Random CCV A3 digits code on the back)           |
| User identifier (a card is associated to a user) |
| Status (blocked or not)                          |

| Transfer                            |
| ----------------------------------- |
| Unique identifier                   |
| Timestamp                           |
| Amount transfered                   |
| Origin currency                     |
| Target currency                     |
| Optional conversion fee             |
| Origin entity identifier            |
| Origin entity type (card or wallet) |
| Target entity identifierCase study  |
| Target entity type (card or wallet) |
