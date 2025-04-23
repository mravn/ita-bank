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
npm run createDb
```

## Use

To start the bank application, execute:
```shell
npm run bank
```

You'll then get a prompt of the form:
```text
bank> 
```

### Print accounts
To print all account balances and compare with vault balance:
```text
bank> print
```

### Open account
To open account 1234 with a balance of $0:
```text
bank> open account 1234
```
Account numbers must be unique integers in the range 0..1000000 (incl..excl).

### Close account
To close account 1234:
```text
bank> close account 1234
```
The account balance must be zero when closing an account.

### Deposit into account
To deposit $500 into account 1234:
```text
bank> deposit 500 into 1234
```
Amounts must be non-negative.

### Withdraw from account
To withdraw $500 from account 1234:
```text
bank> withdraw 500 from 1234
```
Account balances cannot be negative.

### Transfer between accounts
To transfer $500 from account 1234 to account 5678:
```text
bank> transfer 500 from 1234 to 5678
```

### Reset the bank
To reset the bank database and start over with
zero accounts and a zero vault balance:
```text
bank> reset
```

### Toggle prompt mode

To facilitate playing with transaction isolation, you can execute the scripts
with explicit prompts on each database access.

You toggle this "prompt mode" on and off using the command:
```text
bank> prompt
```

A question mark is added to the bank prompt when in prompt mode:
```text
bank?>
```

### Quit
To quit the bank application:
```text
bank> quit
```

## Transactions

### Atomicity
Try an operation that should fail, like transfering money from
an unknown account into an existing account.

Is that operation **atomic**, as implemented?

How can transactions help?

### Isolation
Try running two operations in parallel by using two terminals
and prompt mode.

Are the operations **isolated** from each other, as implemented?

How can transactions help?