# Bank transactions

This project is used for learning about PostgreSQL transactions.

The main script simulates the operations of a *very* simple bank.

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

Number of accounts:         2
-----------------------------
001234:                100.00
005678:                400.00
-----------------------------
Total balance:         500.00 ✓
Vault balance:         500.00 ✓

bank>
```
You can use `p` as a shorthand for `print`.

### Open account
To open account 1234 with a balance of $0:
```text
bank> open account 1234
bank>
```
Account numbers must be unique integers in the range 0..1000000 (incl..excl).

You can use `o` as a shorthand for `open`.

### Deposit into account
To deposit $500 into account 1234:
```text
bank> deposit 500 into 1234
bank>
```
Amounts must be non-negative.

You can use `d` as a shorthand for `deposit`.

### Withdraw from account
To withdraw $500 from account 1234:
```text
bank> withdraw 500 from 1234
bank>
```
Account balances cannot be negative.

You can use `w` as a shorthand for `withdraw`.

### Transfer between accounts
To transfer $500 from account 1234 to account 5678:
```text
bank> transfer 500 from 1234 to 5678
bank>
```

You can use `t` as a shorthand for `transfer`.

### Close account
To close account 1234:
```text
bank> close account 1234
bank>
```
The account balance must be zero when closing an account.

You can use `c` as a shorthand for `close`.

### Reset the bank
To reset the bank database and start over with zero accounts and
a zero vault balance:
```text
bank> reset
bank>
```

You can use `r` as a shorthand for `reset`.

### Suspend mode

To facilitate playing with transaction isolation, you can have
the bank suspend execution just before each database access:
```text
bank> suspend on
bank$ 
```
The prompt then changes slightly to indicate suspend mode.
Executing an operation now looks as follows:
```text
bank$ transfer 500 from 1234 to 5678
select exists (select 1 from accounts where account_id = 1234) [press Enter]
---> { exists: true }
select exists (select 1 from accounts where account_id = 5678) [press Enter]
---> { exists: true }
update accounts set balance = balance + 500 where account_id = 5678 [press Enter]
---> UPDATE 1
update accounts set balance = balance - 500 where account_id = 1234 [press Enter]
---> UPDATE 1
bank$
```
To go back to normal modem, execute:
```text
bank$ suspend off
bank>
```

You can use `s` as a shorthand for `suspend`.

### Quit
To quit the bank application:
```text
bank> quit
```

You can use `q` as a shorthand for `quit`.

## Learning transactions

### Atomicity
Try an operation that should fail, like transfering money from
an account with insufficient funds.

Is that operation **atomic**, as implemented?

How can transactions help achieve atomicity?
Add `begin`/`commit` commands at suitable places.

### Isolation
Try running two operations in parallel by using two terminals
and suspend mode.

Are the operations **isolated** from each other, as implemented?

How can transactions help achieve isolation?
Add `begin`/`commit` commands at suitable places.