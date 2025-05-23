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
The credentials must support connection to a PostgreSQL database
server that allows execution of DDL and DML commands as well as
DQL queries.

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

### Get help
To see a list of available commands:
```text
bank> help

Usage:
  h[elp]     -- get help
  p[rint]    -- print accounts
  o[pen]     -- open account
  d[eposit]  -- deposit funds
  w[ithdraw] -- withdraw funds
  t[ransfer] -- transfer funds between accounts
  c[lose]    -- close account
  r[eset]    -- reset database
  s[uspend]  -- toggle suspend mode
  q[uit]     -- quit application

bank>
```
You can use `h` as a shorthand for `help`.

### Print accounts
To print all account balances and compare with vault balance:
```text
bank> print

Number of accounts:        2
----------------------------
001234:               100.00
005678:               400.00
----------------------------
Total :               500.00 ✓
Vault :               500.00 ✓

bank>
```
You can use `p` as a shorthand for `print`.

### Open account
To open account 1234 with a balance of $0:
```text
bank> open 1234
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
Amounts must be non-negative. Account balances must be less than $10bn.

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
bank> close 1234
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
To go back to normal mode, execute:
```text
bank$ suspend off
bank>
```
If you use `suspend` without the argument `on` or `off`, it toggles suspension
mode.

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
Add `begin`/`commit`/`rollback` commands at suitable places,
changing
```js
async function doXyz(db, a, b, c) {
    // db access to implement operation xyz
}
```
into
```js
async function doXyz(db, a, b, c) {
    await db.query('begin');
    try {
        // db access to implement operation xyz
        await db.query('commit');
    } catch (e) {
        await db.query('rollback');
        throw e;
    }
}
```
Alternatively, use the function `inTransaction` from `common.js`, changing
the call:
```js
await doXyz(db, a, b, c);
```
to
```js
await inTransaction(db, async () => await doXyz(db, a, b, c));
```

### Isolation
Try running two operations in parallel by using two terminals
and suspend mode.

Are the operations **isolated** from each other, as implemented?

How can transactions help achieve isolation?

Do we need the more expensive isolation levels anywhere? If so, use the following pattern:
```js
async function doXyz(db, a, b, c) {
    await db.query('begin; set transaction isolation level repeatable read');
    // or await db.query('begin; set transaction isolation level serializable');
    try {
        // db access to implement operation xyz
        await db.query('commit');
    } catch (e) {
        await db.query('rollback');
        throw e;
    }
}
```
Alternatively, use one of the functions `inRepeatableReadTransaction` or
`inSerializableTransaction` from `common.js`:
```js
await inRepeatableReadTransaction(db, async () => await doXyz(db, a, b, c));
await inSerializableTransaction(db, async () => await doXyz(db, a, b, c));
```
