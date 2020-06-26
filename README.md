### Specs

- [x] A user can create a wallet in USD (\$), GBP (£) or EUR (€)
- [x] A user can create a card connected to one of his wallets
- [x] A user can list all his cards
- [x] A user can list all his wallets
- [x] A user can load or unload money on his card from the wallet
- [x] A user can block or unblock a card, blocking it will unload all the money into the right wallet
- [x] Spendesk has a master wallet per currency where we store fees from transfers (see below)
- [x] A user can transfer money between 2 wallets in different currencies but
      We take a 2.9% fee on the destination currency on this transfer
      This fee will go into our master wallet for the given currency
      Of course you need to convert the amount (you can user fixer.io or
      any free APIB

don't need to manage users and authentication, just pass both a User-Id and a Company-Id headers with each request and use it to track the money transfers / wallets or cards ownerships. As you can't use real money, you can load the wallet directly when you create it (setting the balance property), it does not work in real life but whatever!

### Assumptions

1. these apis are consumed by other microservices
2. only three currencies are handled
3. wallet or card balance can not be negative
4. a wallet can only create card of the same currency type
5. transfer rules:
   1. a wallet can transfer to a card
   2. a wallet can transfer to a wallet
   3. a card can transfer to a card
   4. a card can transfer to a wallet
   5. a card or wallet can not transfer to the same card or wallet
   6. a wallet transfers to its child card there is no fee (equals to load a card)
   7. a card transfers to its parent wallet there will be no fee (equals to unload a card)
6. currency conversion in the system is not using real time currency because it's a paid service.
7. user-id and company-id are required headers
8. a user can only query wallets of his/her own company
9. a user can only operate on his/her wallet/card

### Considerations

1. Monetary value operations (dinero.js)
   - to ensure accurate monetary value calculations this application is using dinero to handle the calculations
   - for the above reason, database is saving the amount in integer (amount is the actual amount multiply precision of the currency)
2. Paied external service (fixerio)
   - fixerio has somewhat strict constraint on using their apis. And for this reason app is saving a fixed cache for test and development reasons.
3. Data consistency
   - data consistency is handled by transactions
   - it'd be better to use CAS or optimistic locking for the purpose of availability and consistency requirement of the application.
4. Database design
   - in the application there is a polymorphism association problem in the transfer table.
   - there are several ways dealing with it. the way I choose(creating a super comman table called Balance and all other tables Wallet, Card and Transfer refers to it) allows me to manage the data consistency more cleanly.

### Get started

1. using docker

   ```bash
   docker-compose up
   ```

2. using nodejs >= 12, requires a postgresql >= 12 with database spendesk and spendesk_test for end to end test

   ```bash
   #run the application
   yarn run dev

   # run end to end test
   yarn run test:e2e

   # run unit test
   yarn run test
   ```

### Test Api

1. using swagger, once the server is running, you could access http://localhost:4000/swagger to view the documentation
   ![Swagger screen shot](/public/swagger.png)

### TODO

- [x] e2e test
- [x] view object
- [x] unit test
- [x] documentation
- [x] cache currency query

### Transfer cases:

|             | master.cur1                        | master.cur2                        | other.cur1                                   | other.cur2                                 |
| ----------- | ---------------------------------- | ---------------------------------- | -------------------------------------------- | ------------------------------------------ |
| master.cur1 | reject                             | accept, payer-amount, payee+amount | accept, payer-amount+fee, payee + amount-fee | accept, normal                             |
| master.cur2 | accept, payer-amount, payee+amount | reject                             | accept, normal                               | accept, payer-amount+fee, payee+amount-fee |
| other.cur1  | accept, payer-amount, payee+amount | accept, payer-amount, payee+amount | reject                                       | accept, normal                             |
