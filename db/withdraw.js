import { checkAccountExists, parseAmount, parseAccountId } from './common.js';

export default async function withdraw(db, args) {
    if (args.length !== 3 || args[1] !== 'from') {
        console.log('Usage: w[ithdraw] <amount> from <account>');
        return;
    }
    const amount = parseAmount(args[0]);
    const account = parseAccountId(args[2]);
    await doWithdraw(db, amount, account);
}

async function doWithdraw(db, amount, account) {
    await checkAccountExists(db, account);
    await db.query('update accounts set balance = balance - $1 where account_id = $2', [amount, account]);
    await db.query('update vault set balance = balance - $1', [amount]);
}
