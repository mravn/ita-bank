import { checkAccountExists, parseAccountId, parseAmount } from './common.js';

export default async function transfer(db, args) {
    if (args.length !== 5 || args[1] !== 'from' || args[3] !== 'to') {
        console.log('Usage: transfer <amount> from <sender> to <receiver>')
        return;
    }
    const amount = parseAmount(args[0]);
    const sender = parseAccountId(args[2]);
    const receiver = parseAccountId(args[4]);
    await doTransfer(db, amount, sender, receiver);    
}

async function doTransfer(db, amount, sender, receiver) {
    await checkAccountExists(db, sender);
    await checkAccountExists(db, receiver);
    await db.query('update accounts set balance = balance + $1 where account_id = $2', [amount, receiver]);
    await db.query('update accounts set balance = balance - $1 where account_id = $2', [amount, sender]);
}
