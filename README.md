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

To start the bank, execute:
```shell
npm run bank
```

You'll then get a prompt of the form:
```
bank> 
```

### Print accounts
To print all account balances and compare with vault balance:
```shell
print
```

### Open account
To open account 1234 with a balance of $0:
```shell
open account 1234
```
Account numbers must be unique integers in the range 0..1000000 (incl..excl).

### Close account
To close account 1234:
```shell
close account 1234
```
The account balance must be zero when closing an account.

### Deposit into account
To deposit $500 into account 1234:
```shell
deposit 500 into 1234
```
Amounts must be non-negative.

### Withdraw from account
To withdraw $500 from account 1234:
```shell
withdraw 500 from 1234
```
Account balances cannot be negative.

### Transfer between accounts
To transfer $500 from account 1234 to account 5678:
```shell
transfer 500 from 1234 to 5678
```

### Re-initialise the bank
To re-initialise the bank database and start over with
zero accounts and a zero vault balance:
```shell
init
```

## Prompting on database access

To facilitate playing with transaction isolation, you can execute the scripts
with explicit prompts on database queries and commands.

This means the console will show you what database access is about to be
performed and will ask you to press Enter to proceed.

You enable this functionality by setting the environment variable `PG_PROMPT`
to `true`.

On macOS, you just add the environment variable before `npm` as shown below.
It then applies only to a single execution:
```text
$ PG_PROMPT=true npm run transfer 500 from 1234 to 5678
select exists (select 1 from accounts where account_id = 1234) [press enter]
---> { exists: true }
select exists (select 1 from accounts where account_id = 5678) [press enter]
---> { exists: true }
update accounts set balance = balance + 500 where account_id = 5678 [press enter]
---> UPDATE 1
update accounts set balance = balance - 500 where account_id = 1234 [press enter]
---> UPDATE 1
Success.
$ npm run transfer 500 from 5678 to 1234
Success.
$
```

In Windows PowerShell, you need to set the variable on a separate line.
It applies to the terminal session, so you also need to unset it when done.
```text
C:\Users\mnra\ita-bank> $Env:PG_PROMPT = 'true'
C:\Users\mnra\ita-bank> npm run transfer 500 from 1234 to 5678
select exists (select 1 from accounts where account_id = 1234) [press enter]
---> { exists: true }
select exists (select 1 from accounts where account_id = 5678) [press enter]
---> { exists: true }
update accounts set balance = balance + 500 where account_id = 5678 [press enter]
---> UPDATE 1
update accounts set balance = balance - 500 where account_id = 1234 [press enter]
---> UPDATE 1
Success.
C:\Users\mnra\ita-bank> $Env:PG_PROMPT = ''
C:\Users\mnra\ita-bank> npm run transfer 500 from 5678 to 1234
Success.
```

## Transactions

### Atomicity
Try an operation that should fail, like transfering money from
an unknown account into an existing account. Is that operation
**atomic**, as implemented?

How can transactions help?

### Isolation
Try running two operations in parallel by using two terminals and
the `PG_PROMPT` environment variable.
Are the operations **isolated** from each other, as implemented?

How can transactions help?