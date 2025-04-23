# Bank transactions

Play with PostgreSQL transactions.

The project contains a handful of scripts to simulate the operations
of a *very* simple bank.

The bank has a list of accounts, each with a non-negative balance. The
bank also has a vault with all the deposits. At any point in time, the
sum of account balances must equal the vault balance.

## Setup

Add a `.env` file of the form
```env
PG_HOST=ep-orange-cat-f428fcf9-pooler.eu-central-1.aws.neon.tech
PG_PORT=5432
PG_DATABASE=bank
PG_USER=neondb_owner
PG_PASSWORD=<very secret>
```
Then run

```shell
npm install
npm run init
```

## Use

### Print accounts
To print all account balances and compare with vault balance:
```shell
npm run print
```

### Open account
To open account 1234 with a balance of $0:
```shell
npm run open 1234
```
Account numbers must be unique integers in the range 0..1000000 (incl..excl).

### Close account
To close account 1234:
```shell
npm run close 1234
```
The account balance must be zero when closing an account.

### Deposit into account
To deposit $500 into account 1234:
```shell
npm run depost 500 into 1234
```
Amounts must be non-negative.

### Withdraw from account
To withdraw $500 from account 1234:
```shell
npm run withdraw 500 from 1234
```
Account balances cannot be negative.

### Transfer between accounts
To transfer $500 from account 1234 to account 5678:
```shell
npm run transfer 500 from 1234 to 5678
```

### Re-initialise the bank
To re-initialise the bank database and start over with
zero accounts and a zero vault balance:
```shell
npm run init
```

## Console logging

Each operation (except initialisation) prints the database
queries and commands involved to the console.

Database access is randomly delayed to facilitate experiments
with transactions. The console logging includes a timestamp
with minutes, seconds, and milliseconds so that you can see
approximately when a particular access was made.

```text
$ npm run open 1234
21:22.096 insert into accounts (account_id) values (1234) --> INSERT 1
Success.
$ npm run open 5678
21:40.166 insert into accounts (account_id) values (5678) --> INSERT 1
Success.
$ npm run deposit 500 into 1234
21:51.544 select exists (select 1 from accounts where account_id = 1234) --> { exists: true }
21:51.730 update accounts set balance = balance + 500 where account_id = 1234 --> UPDATE 1
21:52.035 update vault set balance = balance + 500 --> UPDATE 1
Success.
$ npm run transfer 500 from 1234 to 5678
22:06.488 select exists (select 1 from accounts where account_id = 1234) --> { exists: true }
22:07.118 select exists (select 1 from accounts where account_id = 5678) --> { exists: true }
22:07.430 update accounts set balance = balance + 500 where account_id = 5678 --> UPDATE 1
22:07.992 update accounts set balance = balance - 500 where account_id = 1234 --> UPDATE 1
Success.
$
```

## Transactions

### Atomicity
Try an operation that should fail, like transfering money from
an unknown account into an existing account. Is that operation
**atomic**, as implemented?

How can transactions help?

### Isolation
Try running two operations in parallel (e.g. using two terminals).
Are the operations **isolated** from each other, as implemented?

How can transactions help?