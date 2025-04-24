import { checkAccountExists, parseAmount, parseAccountId } from './common.js';

export default async function deposit(db, args) {
    if (args.length !== 3 || args[1] !== 'into') {
        console.log('Usage: d[eposit] <amount> into <account>');
        return;
    }
    const amount = parseAmount(args[0]);
    const account = parseAccountId(args[2]);
    await doDeposit(db, amount, account);
}

async function doDeposit(db, amount, account) {
    await checkAccountExists(db, account);
    await db.query('update accounts set balance = balance + $1 where account_id = $2', [amount, account]);
    await db.query('update vault set balance = balance + $1', [amount]);
}
