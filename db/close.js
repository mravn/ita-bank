import { checkAccountExists, parseAccountId, checkZeroBalance } from './common.js';

export default async function close(db, args) {
    if (args.length !== 1) {
        console.log('Usage: c[lose] <account>');
        return;
    }
    const account = parseAccountId(args[0]);
    await doClose(db, account);
}

async function doClose(db, account) {
    await checkAccountExists(db, account);
    await checkZeroBalance(db, account);
    await db.query('delete from accounts where account_id = $1', [account]); 
}
