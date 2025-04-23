import { parseAccountId } from "./common.js";

export default async function open(db, args) {
    if (args.length !== 2 || args[0] !== 'account') {
        console.log('Usage: open account <account>');
        return;
    }
    const account = parseAccountId(args[1]);
    await doOpen(db, account);
}

async function doOpen(db, account) {
    await db.query('insert into accounts (account_id) values ($1)', [account]); 
}
