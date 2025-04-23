import connect from './connect.js';
import { checkAccountExists, checkZeroBalance } from './common.js';

if (process.argv.length !== 3) {
    console.error('Usage: npm run close <account>')
    process.exit(1);
}

const conn = await connect();
try {
    const accountId = parseInt(process.argv[2]);
    await closeAccount(conn, accountId);
    console.log('Success.');
} catch (e) {
    console.error('Closing account failed:', e.message);
} finally {
    await conn.end();
}

async function closeAccount(conn, accountId) {
    await checkAccountExists(conn, accountId);
    await checkZeroBalance(conn, accountId);
    await conn.query('delete from accounts where account_id = $1', [accountId]); 
}
