import { parseAccountId } from "./common.js";

export default async function open(db, args) {
    if (args.length !== 1) {
        console.log('Usage: o[pen] <account>');
        return;
    }
    const account = parseAccountId(args[0]);
    await doOpen(db, account);
}

async function doOpen(db, account) {
    await db.query('insert into accounts (account_id) values ($1)', [account]); 
}
