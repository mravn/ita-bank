import { checkAccountExists, parseAccountId, checkZeroBalance } from './common.js';

export default async function close(db, args) {
    if (args.length !== 2 || args[0] !== 'account') {
        console.log('Usage: close account <account>');
        return;
    }
    const account = parseAccountId(args[1]);
    await doClose(db, account);
}

async function doClose(db, account) {
    await checkAccountExists(db, account);
    await checkZeroBalance(db, account);
    await db.query('delete from accounts where account_id = $1', [account]); 
}
